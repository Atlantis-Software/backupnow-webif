export default class SessionService {
    constructor() {
      this.expireFct = [];
      this.onExpire = function(fct) {
        this.expireFct.push(fct);
      };
      this.sessionID = '';
      this.resetID = function() {
        this.sessionID = '';
      };
      this.setID = function(sessionId) {
        this.sessionID = sessionId;
      };
      this.expire = function() {
        this.resetID();
        this.expireFct.forEach(function(fct) {
          fct.call(this);
        });
      }
    }
  }