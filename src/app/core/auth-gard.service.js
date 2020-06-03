import { Router } from '@angular/router';
import SessionService from './session.service';

export default class AuthGuardService {

  constructor(SessionService, Router) {
      this.session = SessionService;
      this.router = Router;
  }

  canActivate() {
    if (this.session.sessionID === '') {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}

AuthGuardService.parameters = [SessionService, Router];