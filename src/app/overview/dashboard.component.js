import { Component } from '@angular/core';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

export default class dashboardComponent {

  static get annotations() {
    return [
      new Component({
        template: require('./dashboard.html')
      })
    ];
  }
  constructor() {
    // status
    this.statusOptions = {
      responsive: true,
      legend: {
        position: 'bottom',
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      }
    };
    this.statusLabels = ['OK', 'Warning', 'Error', 'Critical'];
    this.statusData = [5, 12, 6, 1];
    this.statusPlugins = [pluginDataLabels];
    this.statusColors = [
      {
        backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(0,255,255,0.3)'],
      },
    ];

    // storage
    this.storageOptions = {
      responsive: true,
      legend: {
        position: 'bottom',
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      }
    };
    this.storageLabels = ['Used space', 'Free Space'];
    this.storageData = [5, 12];
    this.storagePlugins = [pluginDataLabels];
    this.storageColors = [
      {
        backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
      },
    ];

    // Activities
    this.activitiesOptions = {
      responsive: true,
      legend: {
        position: 'bottom',
      },
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.activitiesLabels = ['mon', 'tue', 'web', 'thu', 'fie', 'sat', 'sun'];
    this.activitiesPlugins = [pluginDataLabels];
    this.activitiesData = [
      { data: [5, 6, 3, 6, 6, 6, 6], label: 'Succes' },
      { data: [1, 0, 2, 0, 0, 0, 0], label: 'Error' },
      { data: [0, 0, 1, 0, 0, 0, 0], label: 'Warning' }
    ];


    // Warnings
    this.warningsOptions = {
      responsive: true,
      legend: {
        position: 'bottom',
      },
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.warningsLabels = ['mon', 'tue', 'web', 'thu', 'fie', 'sat', 'sun'];
    this.warningsPlugins = [pluginDataLabels];
    this.warningsData = [
      { data: [1, 0, 1, 0, 0, 0, 0], label: 'Critical' },
      { data: [1, 0, 2, 0, 0, 0, 0], label: 'Error' },
      { data: [0, 0, 1, 0, 0, 0, 0], label: 'Warning' }
    ];

    // Montly storage
    this.msData = [
      { data: [47.1, 47.1, 47.2, 47.2, 47.3, 47.3, 47.4], label: 'Used Go' }
    ];
    this.msLabels = ['01/01/20', '01/02/20', '01/03/20', '01/04/20', '01/05/20', '01/06/20', '01/07/20'];
    this.msOptions = {
      responsive: true,
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{}],
        yAxes: [
          {
            id: 'y-axis-0',
            position: 'left',
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };
    this.msColors = [{
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];


  }

  ngOnInit() {
  }
}

dashboardComponent.parameters = [];