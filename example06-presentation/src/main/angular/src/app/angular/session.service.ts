import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../session';
import { SportType } from '../sportType';
import { User } from '../user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseSessionService } from '../base-session.service';
import { environment as env } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class SessionService extends BaseSessionService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllSessions(): Observable<Session[]> {
    return this.http.get<any[]>(`${env.apiUrl}/trainingssession`, {headers: this.defaultHeaders}).pipe(
      map(body => body.map(n => Session.fromObject(n)))
    );
  }

  createSession(name: string, description: string, typeOfSport: SportType, duration: Number, appointment: Date, privat: Boolean): Observable<Session> {
    return this.http.post<any>(`${env.apiUrl}/trainingssession`, {name, description, typeOfSport, duration, appointment, privat}, {headers: this.defaultHeaders}).pipe(
      map(body => Session.fromObject(body))
    );
  }

  editSession(id:Number, name: string, description: string, typeOfSport: SportType, duration: Number, appointment: Date, privat: Boolean): Observable<Session[]> {
    return this.http.put<any>(`${env.apiUrl}/trainingssession/${id}`, {id, name, description, typeOfSport, duration, appointment, privat}, {headers: this.defaultHeaders}).pipe(
      map(body => body.map(n => Session.fromObject(n)))
    );
  }

  deleteSession(id: Number): Observable<Session[]> {
    return this.http.delete<any>(`${env.apiUrl}/trainingssession/${id}`, {headers: this.defaultHeaders}).pipe(
      map(body => body.map(n => Session.fromObject(n)))
    );
  }

  subscribeSession(id: Number): Observable<Session[]> {
    return this.http.post<any>(`${env.apiUrl}/trainingssession/${id}/attendees`, {id}, {headers: this.defaultHeaders}).pipe(
      map(body => body.map(n => Session.fromObject(n)))
    );
  }

  //TODO need to be fixed, da RESTpath angepasst werden musste
  unsubscribeSession(id: Number): Observable<Session[]> {
    return this.http.delete<any>(`${env.apiUrl}/trainingssession/${id}/attendees`, {headers: this.defaultHeaders}).pipe(
      map(body => body.map(n => Session.fromObject(n)))
    );
  }
}
