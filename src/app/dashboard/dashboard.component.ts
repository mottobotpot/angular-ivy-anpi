import { Component, OnInit } from '@angular/core';
import { Incident } from '../incident';
import { IncidentService } from '../incident.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  incidents: Incident[] = [];

  constructor(private incidentService: IncidentService) { }

  ngOnInit() {
    this.getIncidents();
  }

  getIncidents(): void {
    this.incidentService.getIncidents()
      .subscribe(incidents => this.incidents);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
