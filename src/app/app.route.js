import loginComponent from './login/login.component';
import backupsComponent from './backups/backups.component';
import hostsComponent from './hosts/hosts.component';
import activitiesComponent from './overview/activities.component';
import dashboardComponent from './overview/dashboard.component';
import warningsComponent from './overview/warnings.component';
import emailserverComponent from './parameters/emailserver.component';
import notificationsComponent from './parameters/notifications.component';
import plansComponent from './plans/plans.component';
import AuthGuardService from './core/auth-gard.service';

export default [
  {
    path: '',
    component: loginComponent
  },
  {
    path: 'app',
    children: [
      {
        path: '',
        redirectTo: 'overview/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            component: dashboardComponent,
            canActivate: [ AuthGuardService ]
          },
          {
            path: 'warnings',
            component: warningsComponent,
            canActivate: [ AuthGuardService ]
          },
          {
            path: 'activities',
            component: activitiesComponent,
            canActivate: [ AuthGuardService ]
          }
        ]
      },
      {
        path: 'hosts',
        component: hostsComponent,
        canActivate: [ AuthGuardService ]
      },
      {
        path: 'plans',
        component: plansComponent,
        canActivate: [ AuthGuardService ]
      },
      {
        path: 'backups',
        component: backupsComponent,
        canActivate: [ AuthGuardService ]
      },
      {
        path: 'parameters',
        children: [
          {
            path: '',
            redirectTo: 'notifications',
            pathMatch: 'full'
          },
          {
            path: 'notifications',
            component: notificationsComponent,
            canActivate: [ AuthGuardService ]
          },
          {
            path: 'smtp',
            component: emailserverComponent,
            canActivate: [ AuthGuardService ]
          }
        ]
      }
    ]
  }
];