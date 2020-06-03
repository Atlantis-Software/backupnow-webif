import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service';

export default class activitiesComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./activities.html')
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
    this.displayedColumns = ["desc", "host", "state", "start", "duration", "initiator"];
  }

  openDialog(row) {
    console.log(row);
  }

  paginate(page, pageCount) {
    self = this;
    pageCount = pageCount || this.pageCount;
    this.io.emit('activities:paginate', {page, pageCount}, function(err, page) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.count = page.count;
      self.page = page.page;
      self.pageCount = page.pageCount;
      self.activities = new MatTableDataSource(page.list);
    });
  }

  changePage(event) {
    this.paginate(event.pageIndex + 1, event.pageSize);
  }
}

activitiesComponent.parameters = [MatDialog, IOService, NotificationService];
