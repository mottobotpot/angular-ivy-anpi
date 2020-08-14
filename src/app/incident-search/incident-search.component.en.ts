import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Incident } from '../incident';
import { IncidentService } from '../incident.service';

@Component({
  selector: 'app-incident-search',
  templateUrl: './incident-search.component.html',
  styleUrls: [ './incident-search.component.css' ]
})
export class IncidentSearchComponent implements OnInit {
  incidents$: Observable<Incident[]>;
  private searchTerms = new Subject<string>();

  constructor(private incidentService: IncidentService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.incidents$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.incidentService.searchIncidents(term)),
    );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
