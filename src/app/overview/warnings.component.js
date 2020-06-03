import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service';

export default class warningsComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./warnings.html')
      })
    ];
  }
  constructor(MatDialog, IOService, NotificationService) {
    this.dialog = MatDialog;
    this.io = IOService;
    this.notification = NotificationService;
    this.count = 0;
    this.page = 1;
    this.pageCount = 10;
    this.paginate(1);
    this.displayedColumns = ["desc", "host", "state", "date"];
  }

  paginate(page, pageCount) {
    self = this;
    pageCount = pageCount || this.pageCount;
    this.io.emit('warnings:paginate', {page, pageCount}, function(err, page) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.count = page.count;
      self.page = page.page;
      self.pageCount = page.pageCount;
      self.warnings = new MatTableDataSource(page.list);
    });
  }

  changePage(event) {
    this.paginate(event.pageIndex + 1, event.pageSize);
  }

  ngOnInit() {
  }
}

warningsComponent.parameters = [MatDialog, IOService, NotificationService];