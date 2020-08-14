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

  // 検索語をobservableストリームにpushする
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.incidents$ = this.searchTerms.pipe(
      // 各キーストロークの後、検索前に300ms待つ
      debounceTime(300),

      // 直前の検索語と同じ場合は無視する
      distinctUntilChanged(),

      // 検索語が変わる度に、新しい検索observableにスイッチする
      switchMap((term: string) => this.incidentService.searchIncidents(term)),
    );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
