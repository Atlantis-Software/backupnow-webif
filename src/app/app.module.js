import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/platform-browser-animations';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ChartsModule } from 'ng2-charts';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";

import appComponent from './app.component';
import loginComponent from './login/login.component';
import backupsComponent from './backups/backups.component';
import backupEditComponent from './backups/backup-edit.component';
import hostsComponent from './hosts/hosts.component';
import hostEditComponent from './hosts/host-edit.component';
import activitiesComponent from './overview/activities.component';
import dashboardComponent from './overview/dashboard.component';
import warningsComponent from './overview/warnings.component';
import emailserverComponent from './parameters/emailserver.component';
import notificationsComponent from './parameters/notifications.component';
import plansComponent from './plans/plans.component';
import planEditComponent from './plans/plan-edit.component';

import AuthService from './core/auth.service';
import IOService from './core/io.service';
import LogService from './core/log.service';
import NotificationService from './core/notifications.service';
import SessionService from './core/session.service';
import AuthGuardService from './core/auth-gard.service';

import Route from './app.route';

var AppModule = function() {};

AppModule.annotations = [
  new NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(Route),
        ChartsModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatCardModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatCheckboxModule,
        MatChipsModule,
        MatPaginatorModule,
        MatDialogModule
    ],
    declarations: [
      appComponent,
      loginComponent,
      backupsComponent,
      backupEditComponent,
      hostsComponent,
      hostEditComponent,
      activitiesComponent,
      dashboardComponent,
      warningsComponent,
      emailserverComponent,
      notificationsComponent,
      plansComponent,
      planEditComponent
    ],
    entryComponents: [backupEditComponent, hostEditComponent, planEditComponent],
    bootstrap: [appComponent],
    providers: [
      {provide: LocationStrategy, useClass: HashLocationStrategy},
      AuthService,
      IOService,
      LogService,
      NotificationService,
      SessionService,
      AuthGuardService
    ]
  })
];

document.addEventListener("DOMContentLoaded", function() {
  platformBrowserDynamic().bootstrapModule(AppModule, [{provide: Window, useValue: window}]);
});

export default AppModule;