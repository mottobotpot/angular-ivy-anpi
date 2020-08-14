import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Incident } from './incident';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class IncidentService {

  private incidentsUrl = 'api/incidents';  // Web APIのURL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** サーバーからヒーローを取得する */
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.incidentsUrl)
      .pipe(
        tap(incidents => this.log('fetched incidents')),
        catchError(this.handleError<Incident[]>('getIncidents', []))
      );
  }

  /** IDによりヒーローを取得する。idが見つからない場合は`undefined`を返す。 */
  getIncidentNo404<Data>(id: number): Observable<Incident> {
    const url = `${this.incidentsUrl}/?id=${id}`;
    return this.http.get<Incident[]>(url)
      .pipe(
        map(incidents => incidents[0]), // {0|1} 要素の配列を返す
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} incident id=${id}`);
        }),
        catchError(this.handleError<Incident>(`getIncident id=${id}`))
      );
  }

  /** IDによりヒーローを取得する。見つからなかった場合は404を返却する。 */
  getIncident(id: number): Observable<Incident> {
    const url = `${this.incidentsUrl}/${id}`;
    return this.http.get<Incident>(url).pipe(
      tap(_ => this.log(`fetched incident id=${id}`)),
      catchError(this.handleError<Incident>(`getIncident id=${id}`))
    );
  }

  /* 検索語を含むヒーローを取得する */
  searchIncidents(term: string): Observable<Incident[]> {
    if (!term.trim()) {
      // 検索語がない場合、空のヒーロー配列を返す
      return of([]);
    }
    return this.http.get<Incident[]>(`${this.incidentsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found incidents matching "${term}"`)),
      catchError(this.handleError<Incident[]>('searchIncidents', []))
    );
  }

  //////// Save methods //////////

  /** POST: サーバーに新しいヒーローを登録する */
  addIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.incidentsUrl, incident, this.httpOptions).pipe(
      tap((newIncident: Incident) => this.log(`added incident w/ id=${newIncident.id}`)),
      catchError(this.handleError<Incident>('addIncident'))
    );
  }

  /** DELETE: サーバーからヒーローを削除 */
  deleteIncident(incident: Incident | number): Observable<Incident> {
    const id = typeof incident === 'number' ? incident : incident.id;
    const url = `${this.incidentsUrl}/${id}`;

    return this.http.delete<Incident>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted incident id=${id}`)),
      catchError(this.handleError<Incident>('deleteIncident'))
    );
  }

  /** PUT: サーバー上でヒーローを更新 */
  updateIncident(incident: Incident): Observable<any> {
    return this.http.put(this.incidentsUrl, incident, this.httpOptions).pipe(
      tap(_ => this.log(`updated incident id=${incident.id}`)),
      catchError(this.handleError<any>('updateIncident'))
    );
  }

  /**
   * 失敗したHttp操作を処理します。
   * アプリを持続させます。
   * @param operation - 失敗した操作の名前
   * @param result - observableな結果として返す任意の値
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }

  /** IncidentServiceのメッセージをMessageServiceを使って記録 */
  private log(message: string) {
    this.messageService.add(`IncidentService: ${message}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
