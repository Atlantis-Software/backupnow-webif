import IOService from './io.service';
import SessionService from './session.service';

export default class AuthService {
  constructor (IOService, SessionService) {
    this.IO = IOService;
    this.Session = SessionService;
  }

  checkAuthenticated(cb) {
    if (this.Session.sessionID !== '') {
      return cb(true);
    }
    return cb(false);
  }

  login(user, password, cb) {
    this.IO.login({username: user, password: password}, cb);
  }
}

AuthService.parameters = [IOService, SessionService];