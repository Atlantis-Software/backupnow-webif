import io from 'socket.io-client';
import SessionService from './session.service';
import LogService from './log.service';
import asynk from 'asynk';
import _find from 'lodash/find';
import _keys from 'lodash/keys';
import _isEqual from 'lodash/isEqual';
import _filter from 'lodash/filter';
import _merge from 'lodash/merge';
import NotificationService from './notifications.service';

export default class IOService {
  constructor(session, LogService, NotificationService) {
    this.requests = {};
    this.session = session;
    this.log = LogService;
    this.notification = NotificationService;
    this.ID = null;
    this.needLogin = null;
    this.io = io;
    let self = this;
    var ioParams = {
      'reconnection limit': 3000,
      'max reconnection attempts': Number.MAX_VALUE,
      'connect timeout': 7000,
      path: '/socket.io'
    };

    // var socketAddress = "http://" + window.location.hostname + "/";
    var socketAddress = "";
    this.socket = io.connect(socketAddress, ioParams);
    var tryReconnect = null;

    this.socket.on('connect', function() {
      // handle flapping connection
      if (tryReconnect) {
        clearTimeout(tryReconnect);
      }
      (function reconnected() {
        if (!(self.socket.connected || self.socket.connecting)) {
          tryReconnect = setTimeout(reconnected, 10);
          self.log.error("socket not ready => timeout");
        } else {
          self.log.info("restarting service IO");
          self.restart();
        }
      })();
    });

    this.socket.on('disconnect', function() {

    });

    this.socket.on('reconnect', function() {

    });

    this.socket.on('RESOLVE', function(data) {
      var uid = null;
      if (data.notification && data.notification.uid) {
        uid = data.notification.uid;
      }
      if (self.requests[uid]) {
        var request = self.requests[uid];
        delete self.requests[uid];
        request.defer.resolve(data);
        if (request.callback) {
          request.callback.apply(null, [null, data]);
        }
        clearTimeout(request.timeout);
      }
    });

    this.socket.on('NOTIFY', function(data) {
      var uid = null;
      if (data.notification && data.notification.uid) {
        uid = data.notification.uid;
      }
      if (self.requests[uid]) {
        self.requests[uid].defer.notify(data);
        clearTimeout(self.requests[uid].timeout);
        self.requests[uid].timeout = setTimeout(function() {
          self.timeoutFct(uid);
        }, 15000);
      }
    });

    this.socket.on('REJECT', function(data) {
      var uid = null;
      if (data.notification && data.notification.uid) {
        uid = data.notification.uid;
      }
      if (self.requests[uid]) {
        var request = self.requests[uid];
        delete self.requests[uid];
        request.defer.reject(data);
        if (request.callback) {
          request.callback.apply(null, arguments);
        }
        clearTimeout(request.timeout);

        if (data.notification.type === "ERROR") {
          switch (data.notification.msg) {
            case "#INVALID_SESSION":
              self.session.expire();
              break;
          }
        }
      }
    });
  }

  login(loginOpts, callback) {
    let self = this;
    if (!this.socket || !(this.socket.connected || this.socket.connecting)) {
      this.needLogin.loginOpts = loginOpts;
      this.needLogin.callback = callback;
      return;
    }
    this.emit('user:login', loginOpts, function(err, result) {
      var args = arguments;
      self.needLogin = null;
      if (!err) {
        self.ID = loginOpts;
        self.session.sessionID = result.sessionID;
        self.restart();
      }
      if (callback) {
        callback.apply(null, args);
      }
    });
  }

  emit(eventName, data, callback, ttl) {
    let self = this;
    ttl = ttl || 0;
    var deferred = asynk.deferred();
    var result = {};
    var now = new Date().getTime();

    if (this.session.sessionID !== null) { //  && this.socket && (this.socket.connected || this.socket.connecting)
      var uid = Math.random().toString(36).substr(2, 9);

      var isBinary = false;
      _keys(data).forEach(function(key) {
        if (data[key] instanceof File) {
          isBinary = true;
        }
      });

      if (isBinary) {
        return this.httpEmit(eventName, data, callback);
      }

      var req = {};
      req.sessionID = this.session.sessionID;
      req.request = eventName;
      req.data = data;
      req.uid = uid;
      this.socket.emit('request', req, function() {
        self.requests[uid] = {};
        self.requests[uid].uid = uid;
        self.requests[uid].event = eventName;
        self.requests[uid].data = data;
        self.requests[uid].callback = callback;
        self.requests[uid].defer = deferred;
        self.requests[uid].timeout = setTimeout(function() {
          self.timeoutFct(uid);
        }, 15000);
        self.requests[uid].ttl = ttl;
        self.requests[uid].requests = self.requests;
      });
    } else {
      result.notification = {};
      result.notification.msg = "#INVALID_SESSION";
      result.notification.type = "ERROR";
      deferred.reject(result);
      if (callback) {
        callback.apply(null, [result]);
      }
    }
    if (!callback) {
      return deferred.promise();
    }
  }

  restart() {
    if (this.needLogin) {
      this.log.info("IO need relogin");
      return this.login(this.needLogin.loginOpts, this.needLogin.callback);
    } else {
      this.log.info("must resend " + Object.keys(this.requests).length + " requests");
      this.log.info("resend " + Object.keys(this.requests).length + " requests");
      let self = this;
      Object.keys(this.requests).forEach(function(uid) {
        let req = self.requests[uid];
        delete self.requests[uid];
        req.ttl++;
        if (req.ttl <= 3) {
          self.emit(req.event, req.data, req.cb, req.ttl);
        } else {
          var result = {};
          result.notification = {};
          result.notification.msg = "#NETWORK ERROR";
          result.notification.type = "ERROR";
          req.cb.call(null, result);
        }
      });
    }
  }

  httpEmit(eventName, data, callback) {
    var self = this;
    var deferred = asynk.deferred();
    var req = new FormData();
    var uid = Math.random().toString(36).substr(2, 9);
    var result = {
      notification: {
        type: 'ERROR',
        msg: '#INTERNAL_SERVER_ERROR'
      }
    };
    req.append('sessionID', this.session.sessionID);
    req.append('uid', uid);
    req.append('request', eventName);
    _keys(data).forEach(function(key) {
      req.append(key, data[key]);
    });
    var request = new XMLHttpRequest();

    request.upload.addEventListener("progress", function(progress) {
      if (progress.lengthComputable) {
        var percentComplete = (progress.loaded * 100 / progress.total).toFixed(2) + '%';
        deferred.progress({upload: percentComplete});
      }
    }, false);
    request.upload.addEventListener("load", function() {
      deferred.progress({upload: '100%'});
    }, false);
    request.addEventListener("load", function(load) {
      if (load.target.status === 200) {
        result.notification.type = 'SUCCESS';
        result.notification.msg = 'OK';
        result = _merge(result, load.target.response);
        return deferred.resolve(result);
      }
      result.notification.msg = load.target.statusText;
      deferred.reject(result);
    }, false);
    request.addEventListener("error", function(error) {
      self.log.error('Upload error', error);
      result.notification.msg = 'Upload error';
      deferred.reject(result);
    }, false);
    request.addEventListener("abort", function(abort) {
      self.log.error('Upload aborted', abort);
      result.notification.msg = 'Upload aborted';
      deferred.reject(result);
    }, false);


    request.open("POST", 'DYN/' + eventName);
    request.responseType = "json";
    request.send(req);

    if (callback) {
      deferred.done(function(result) {
        callback.apply(null, [result]);
      });
      deferred.fail(function(err) {
        callback.apply(null, [err]);
      });
    }

    return deferred.promise();
  }

  timeoutFct(uid) {
    if (this.requests && this.requests[uid]) {
      var request = this.requests[uid];
      var result = {};
      result.notification = {};
      result.notification.msg = "#NETWORK ERROR";
      result.notification.type = "ERROR";
      request.defer.reject(result);
      if (request.callback) {
        request.callback.apply(null, [result]);
      }
      delete this.requests[uid];
    }
  }

}

IOService.parameters = [SessionService, LogService, NotificationService];

