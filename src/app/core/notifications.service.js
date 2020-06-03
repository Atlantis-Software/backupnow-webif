
export default class NotificationService {
  constructor() {
    this.notifs = [];
    this.alerts = [];
    this.visibleExit = false;
    this.timer = null;
  }

  _timer() {
    var self = this;
    if (!this.timer) {
      this.timer = setTimeout(function() {
        self.timer = null;
        self.notifs.shift();
        if (self.notifs.length > 0) {
          self._timer();
        }
      }, 5000);
    }
  }

  error(title, msg, exitTime) {
    var alert = {
      title: title,
      msg: msg,
      exitButton: false,
      exitTimer: null,
      visibleExit: function() {
        var self = this;
        if (!this.exitTimer) {
          this.exitTimer = setTimeout(function() {
            self.exitButton = true;
          }, exitTime || 0);
        }
        return this.exitButton;
      }
    };

    this.alerts.push(alert);
  }

  success(msg) {
    this.notifs.push(msg);
    this._timer();
  }

}

NotificationService.parameters = [];
