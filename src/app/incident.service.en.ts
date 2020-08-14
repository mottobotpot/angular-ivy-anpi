import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Incident } from './incident';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class IncidentService {

  private incidentsUrl = 'api/incidents';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET incidents from the server */
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.incidentsUrl)
      .pipe(
        tap(_ => this.log('fetched incidents')),
        catchError(this.handleError<Incident[]>('getIncidents', []))
      );
  }

  /** GET incident by id. Return `undefined` when id not found */
  getIncidentNo404<Data>(id: number): Observable<Incident> {
    const url = `${this.incidentsUrl}/?id=${id}`;
    return this.http.get<Incident[]>(url)
      .pipe(
        map(incidents => incidents[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} incident id=${id}`);
        }),
        catchError(this.handleError<Incident>(`getIncident id=${id}`))
      );
  }

  /** GET incident by id. Will 404 if id not found */
  getIncident(id: number): Observable<Incident> {
    const url = `${this.incidentsUrl}/${id}`;
    return this.http.get<Incident>(url).pipe(
      tap(_ => this.log(`fetched incident id=${id}`)),
      catchError(this.handleError<Incident>(`getIncident id=${id}`))
    );
  }

  /* GET incidents whose name contains search term */
  searchIncidents(term: string): Observable<Incident[]> {
    if (!term.trim()) {
      // if not search term, return empty incident array.
      return of([]);
    }
    return this.http.get<Incident[]>(`${this.incidentsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found incidents matching "${term}"`) :
         this.log(`no incidents matching "${term}"`)),
      catchError(this.handleError<Incident[]>('searchIncidents', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new incident to the server */
  addIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.incidentsUrl, incident, this.httpOptions).pipe(
      tap((newIncident: Incident) => this.log(`added incident w/ id=${newIncident.id}`)),
      catchError(this.handleError<Incident>('addIncident'))
    );
  }

  /** DELETE: delete the incident from the server */
  deleteIncident(incident: Incident | number): Observable<Incident> {
    const id = typeof incident === 'number' ? incident : incident.id;
    const url = `${this.incidentsUrl}/${id}`;

    return this.http.delete<Incident>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted incident id=${id}`)),
      catchError(this.handleError<Incident>('deleteIncident'))
    );
  }

  /** PUT: update the incident on the server */
  updateIncident(incident: Incident): Observable<any> {
    return this.http.put(this.incidentsUrl, incident, this.httpOptions).pipe(
      tap(_ => this.log(`updated incident id=${incident.id}`)),
      catchError(this.handleError<any>('updateIncident'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a IncidentService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`IncidentService: ${message}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
