import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import hostEditComponent from './host-edit.component';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service'

export default class hostsComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./hosts.html')
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
    this.displayedColumns = ["select", "name", "host", "state", "agentVersion"];
    this.selection = new SelectionModel(false);
  }

  openDialog(modify) {
    var self = this;
    var data = {};
    if (modify) {
      if (this.selection.selected.length) {
        data = Object.assign({}, this.selection.selected[0]);
      } else {
        return self.notification.error('Error', 'please select an host first');
      }
    }
    const dialogRef = this.dialog.open(hostEditComponent, {
      width: '450px',
      height: '480px',
      data
    });

    dialogRef.afterClosed().subscribe(function(host) {
      if (!host) {
        return;
      }
      var request = 'hosts:create';
      if (host.id) {
        request = 'hosts:update';
      }
      self.io.emit(request, host, function(err, host) {
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
    this.io.emit('hosts:paginate', {page, pageCount}, function(err, page) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.count = page.count;
      self.page = page.page;
      self.pageCount = page.pageCount;
      self.hosts = new MatTableDataSource(page.list);
    });
  }

  changePage(event) {
    this.paginate(event.pageIndex + 1, event.pageSize);
  }

  delete() {
    var self = this;
    if (!this.selection.hasValue()) {
      return self.notification.error('Error', 'please select an host first');
    }
    var id = this.selection.selected[0].id;
    this.io.emit('hosts:delete', {id}, function(err) {
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

hostsComponent.parameters = [MatDialog, IOService, NotificationService];
