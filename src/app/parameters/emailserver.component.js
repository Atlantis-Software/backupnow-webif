import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service';

export default class emailserverComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./emailserver.html')
      })
    ];
  }
  constructor(FormBuilder, IOService, NotificationService) {
    var self = this;
    this.fb = FormBuilder;
    this.io = IOService;
    this.notification = NotificationService;
  }

  save() {
    if (this.form.valid) {
      var self = this;
      var server = {
        host: this.form.get('host').value,
        port: this.form.get('port').value,
        isAuth: this.form.get('isAuth').value,
        username: this.form.get('username').value,
        password: this.form.get('password').value,
        secure: this.form.get('secure').value,
        email: this.form.get('email').value
      };
      this.io.emit('parameters:email_server_update', server, function(err) {
        if (err) {
          return self.notification.error('Error', err);
        }
        self.notification.success('Smtp server', 'updated smtp server parameters successfully');
      });
    }
  }

  ngOnInit() {
    var self = this;
    this.form = this.fb.group({
      host: ['', Validators.required],
      port: [25, [Validators.required, Validators.min(0)]],
      isAuth: [false, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      secure: [false, Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.io.emit('parameters:email_server_read', this.server, function(err, params) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.form.controls['host'].setValue(params.server.host);
      self.form.controls['port'].setValue(params.server.port);
      self.form.controls['isAuth'].setValue(params.server.isAuth);
      self.form.controls['username'].setValue(params.server.username);
      self.form.controls['password'].setValue(params.server.password);
      self.form.controls['secure'].setValue(params.server.secure);
      self.form.controls['email'].setValue(params.server.email);
    });
  }
}

emailserverComponent.parameters = [FormBuilder, IOService, NotificationService];
