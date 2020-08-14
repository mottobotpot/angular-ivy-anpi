import { Component, OnInit } from '@angular/core';

import { Incident } from '../incident';
import { IncidentService } from '../incident.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[];

  constructor(private incidentService: IncidentService) { }

  ngOnInit() {
    this.getIncidents();
  }

  getIncidents(): void {
    this.incidentService.getIncidents()
    .subscribe(incidents => this.incidents = incidents);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.incidentService.addIncident({ name } as Incident)
      .subscribe(incident => {
        this.incidents.push(incident);
      });
  }

  delete(incident: Incident): void {
    this.incidents = this.incidents.filter(h => h !== incident);
    this.incidentService.deleteIncident(incident).subscribe();
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
