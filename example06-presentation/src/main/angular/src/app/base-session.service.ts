import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from './session';
import { SportType } from './sportType';
import { User } from './user';

export abstract class BaseSessionService {
  protected defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  protected constructor(protected http: HttpClient) {
  }

  abstract getAllSessions(): Observable<Session[]>;

  abstract createSession(name: string, description: string, typeOfSport: SportType, duration: Number, appointment: Date, privat: Boolean): Observable<Session>;

  abstract editSession(id:Number, name: string, description: string, typeOfSport: SportType, duration: Number, appointment: Date, privat: Boolean): Observable<Session[]>;

  abstract deleteSession(id: Number): Observable<Session[]>;

  abstract subscribeSession(id: Number): Observable<Session[]>;

  abstract unsubscribeSession(id: Number): Observable<Session[]>;
}
