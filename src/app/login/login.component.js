import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import AuthService from '../core/auth.service';

export default class loginComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./login.html')
      })
    ];
  }
  constructor(FormBuilder, ActivatedRoute, Router, AuthService) {
    this.fb = FormBuilder;
    this.route = ActivatedRoute;
    this.router = Router;
    this.authService = AuthService;
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
  }

  ngOnInit() {
    var self = this;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/app/overview/dashboard';

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.checkAuthenticated(function(valid) {
        if (valid) {
            self.router.navigate([self.returnUrl]);
        }
    });
  }

  onSubmit() {
    var self = this;
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        this.authService.login(username, password, function(err) {
          if (err) {
            return self.loginInvalid = true;
          }
          self.router.navigate([self.returnUrl]);
        });
    } else {
      this.formSubmitAttempt = true;
    }
  }
}

loginComponent.parameters = [FormBuilder, ActivatedRoute, Router, AuthService];
