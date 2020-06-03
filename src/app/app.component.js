import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import SessionService from './core/session.service';

export default class AppComponent {

  static get annotations() {
    return [
      new Component({
        selector: "my-app",
        template: require('./app.html'),
        directives: [ROUTER_DIRECTIVES]
      })
    ];
  }

  constructor(SessionService) {
    this.session = SessionService;
  }

  isLoggedIn() {
    if (this.session.sessionID === '') {
      return false;
    }
    return true;
  }

}

AppComponent.parameters = [SessionService];