import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import backupEditComponent from './backup-edit.component';
import IOService from '../core/io.service';
import NotificationService from '../core/notifications.service';

export default class backupsComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./backups.html')
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
    this.displayedColumns = ["select", "type", "name", "host", "path", "space"];
    this.selection = new SelectionModel(false);

  }

  openDialog(modify) {
    var self = this;
    var data = {};
    if (modify) {
      if (this.selection.selected.length) {
        data = Object.assign({}, this.selection.selected[0]);
      } else {
        return self.notification.error('Error', 'please select a backup first');
      }
    }
    const dialogRef = this.dialog.open(backupEditComponent, {
      width: '450px',
      height: '480px',
      data
    });

    dialogRef.afterClosed().subscribe(function(backup) {
      if (!backup) {
        return;
      }
      var request = 'backups:create';
      if (backup.id) {
        request = 'backups:update';
      }
      self.io.emit(request, backup, function(err) {
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
    this.io.emit('backups:paginate', {page, pageCount}, function(err, page) {
      if (err) {
        return self.notification.error('Error', err);
      }
      self.count = page.count;
      self.page = page.page;
      self.pageCount = page.pageCount;
      self.backups = new MatTableDataSource(page.list);
    });
  }

  changePage(event) {
    this.paginate(event.pageIndex + 1, event.pageSize);
  }

  delete() {
    var self = this;
    if (!this.selection.hasValue()) {
      return self.notification.error('Error', 'please select a backup first');
    }
    var id = this.selection.selected[0].id;
    this.io.emit('backups:delete', {id}, function(err) {
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

backupsComponent.parameters = [MatDialog, IOService, NotificationService];
