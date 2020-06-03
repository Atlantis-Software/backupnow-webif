import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export default class hostEditComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./edit.html')
      })
    ];
  }
  constructor(MatDialogRef, MAT_DIALOG_DATA) {
      this.dialogRef = MatDialogRef;
      this.data = MAT_DIALOG_DATA;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }
}

hostEditComponent.parameters = [MatDialogRef, MAT_DIALOG_DATA];