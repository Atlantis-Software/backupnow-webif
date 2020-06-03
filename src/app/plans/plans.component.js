import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import planEditComponent from './plan-edit.component';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service';

export default class plansComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./plans.html')
      })
    ];
  }
  constructor(MatDialog, IOService, NotificationService) {
    var self = this;
    this.dialog = MatDialog;
    this.io = IOService;
    this.notification = NotificationService;
    this.count = 0;
    this.page = 1;
    this.pageCount = 10;
    this.paginate(1);
    this.displayedColumns = ["select", "name", "host", "state", "lastDone", "destination"];
    this.selection = new SelectionModel(false);
    this.hosts = [];
    this.backups = [];
    this.io.emit('hosts:list', {}, function(err, hosts) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.hosts = hosts.list;
    });
    this.io.emit('backups:list', {}, function(err, backups) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.backups = backups.list;
    });
  }

  hostname(hostId) {
    var host = _.find(this.hosts, function(host) {
      return host.id === hostId;
    });
    if (host) {
      return host.name;
    }
    return 'host invalide';
  }

  backupname(backupId) {
    var backup = _.find(this.backups, function(backup) {
      return backup.id === backupId;
    });
    if (backup) {
      return backup.name;
    }
    return 'backup invalide';
  }

  openDialog(modify) {
    var self = this;
    var data = {
      // default value
      plan: {
        type: "folder",
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
        time: "00:00",
        keptCount: 1,
        keptPeriod: 'w'
      }
    };
    if (modify) {
      if (this.selection.selected.length) {
        data.plan = Object.assign({}, this.selection.selected[0]);
      } else {
        return self.notification.error('Error', 'please select a plan first');
      }
    }
    data.hosts = this.hosts;
    data.backups = this.backups;
    const dialogRef = this.dialog.open(planEditComponent, {
      width: '900px',
      height: '480px',
      data
    });

    dialogRef.afterClosed().subscribe(function(plan) {
      if (!plan) {
        return;
      }
      var request = 'plans:create';
      if (plan.id) {
        request = 'plans:update';
      }
      self.io.emit(request, plan, function(err) {
        if (err) {
          return self.notification.error('Error', err);
        }
        self.paginate(1);
      });
    });
  }

  paginate(page, pageCount) {
    self = this;
    pageCount = pageCount || this.pageCount;
    this.io.emit('plans:paginate', {page, pageCount}, function(err, page) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.count = page.count;
      self.page = page.page;
      self.pageCount = page.pageCount;
      self.plans = new MatTableDataSource(page.list);
    });
  }

  changePage(event) {
    this.paginate(event.pageIndex + 1, event.pageSize);
  }

  delete() {
    var self = this;
    if (!this.selection.hasValue()) {
      return self.notification.error('Error', 'please select a plan first');
    }
    var id = this.selection.selected[0].id;
    this.io.emit('plans:delete', {id}, function(err) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.paginate(1);
    });
  }

  checkboxLabel(row) {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngOnInit() {
  }
}

plansComponent.parameters = [MatDialog, IOService, NotificationService];
