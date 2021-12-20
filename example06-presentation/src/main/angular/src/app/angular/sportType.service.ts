import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SportType } from '../sportType';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { BaseSportTypeService } from '../base-sportType.service';

@Injectable({providedIn: 'root'})
export class SportTypeService extends BaseSportTypeService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllSportTypes(): Observable<SportType[]> {
    return this.http.get<any[]>(`${env.apiUrl}/sporttypes`, {headers: this.defaultHeaders}).pipe(
      map(body => body.map(n => SportType.fromObject(n)))
    );
  }

  createSportType(name: string, description: string, indoor: boolean, teamsport: boolean): Observable<SportType> {
    return this.http.post<any>(`${env.apiUrl}/sporttypes`, {name, description, indoor, teamsport}, {headers: this.defaultHeaders}).pipe(
      map(body => SportType.fromObject(body))
    );
  }
}
