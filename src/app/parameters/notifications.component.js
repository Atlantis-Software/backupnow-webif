import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service';

export default class notificationsComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./notifications.html')
      })
    ];
  }
  constructor(FormBuilder, IOService, NotificationService) {
    this.fb = FormBuilder;
    this.io = IOService;
    this.notification = NotificationService;
    this.notif = {
      dailySum: false,
      time: "00:00",
      recipients: [],
      onCritical: false,
      onError: false,
      onWarning: false,
      onSuccess: false
    };
  }

  addEmail() {
    if (this.form.valid) {
      this.notif.recipients.push(this.form.get('email').value);
      this.form.controls['email'].setValue("");
    }
  }

  remove(email) {
    var index = this.notif.recipients.indexOf(email);

    if (index >= 0) {
      this.notif.recipients.splice(index, 1);
    }
  }

  ngOnInit() {
    var self = this;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.io.emit('parameters:notifications_read', {}, function(err, params) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.notif = params.notif;
    });
  }

  save() {
    var self = this;
    this.io.emit('parameters:notifications_update', this.notif, function(err) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.notification.success('Notifications', 'updated notifications parameters successfully');
    });
  }
}

notificationsComponent.parameters = [FormBuilder, IOService, NotificationService];
