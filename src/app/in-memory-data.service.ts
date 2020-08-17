import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Incident } from './incident';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const incidents = [
      {
        id:1,
        name:'【地震】青森県東方沖地震',
        items:[
          {
            id:1,
            name:'本人の安否',
            item:[
              { id: 1, name: '安全' },
              { id: 2, name: '軽傷' },
              { id: 3, name: '重傷' }
            ]
          },
          {
            id:2,
            name:'家族の安否',
            item:[
              { id: 1, name: '全員無事' },
              { id: 2, name: '負傷者がいる' },
              { id: 3, name: '不明者がいる' },
              { id: 4, name: '重大な事故がある' },
              { id: 5, name: 'わからない' }
            ]
          },
          {
            id:3,
            name:'出社可否',
            item:[
              { id: 1, name: '出社できない' },
              { id: 2, name: '1時間以内に出社できる' },
              { id: 3, name: '3時間以内に出社できる' },
              { id: 4, name: '出社済み' }
            ]
          },
          {
            id:4,
            name:'家屋の状態',
            item:[
              { id: 1, name: 'わからない' },
              { id: 2, name: '無事' },
              { id: 3, name: '半壊' },
              { id: 4, name: '全壊' }
            ]
          }
        ]
      }
    ];
    return {incidents};
  }

  // Overrides the genId method to ensure that a incident always has an id.
  // If the incidents array is empty,
  // the method below returns the initial number (11).
  // if the incidents array is not empty, the method below returns the highest
  // incident id + 1.
  genId(incidents: Incident[]): number {
    return incidents.length > 0 ? Math.max(...incidents.map(incident => incident.id)) + 1 : 11;
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
