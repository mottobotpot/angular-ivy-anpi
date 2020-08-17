import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Incident } from '../incident';
import { IncidentService } from '../incident.service';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail2.component.html',
  styleUrls: [ './incident-detail.component.css' ]
})
export class IncidentDetailComponent implements OnInit {
  @Input() incident: Incident;

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getIncident();
  }

  getIncident(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.incidentService.getIncident(id)
      .subscribe(incident => this.incident = incident);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.incidentService.updateIncident(this.incident)
      .subscribe(() => this.goBack());
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
