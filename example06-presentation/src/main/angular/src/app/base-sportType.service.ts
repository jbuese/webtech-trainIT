import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SportType } from './sportType';

export abstract class BaseSportTypeService {
  protected defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  protected constructor(protected http: HttpClient) {
  }

  abstract getAllSportTypes(): Observable<SportType[]>;

  abstract createSportType(name: string, description: string, indoor: boolean, teamsport: boolean): Observable<SportType>;

}
