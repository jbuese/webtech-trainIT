import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from './base-auth.service';
import { environment as env } from '../environments/environment';
import { User } from './user';

@Injectable()
export class SessionAuthService extends AuthService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  loggedIn: boolean = false;

  username: string = "";
  isAdmin: Boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(username: string, password: string): Observable<boolean> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(`/login.jsp`, body.toString(), {headers, responseType: 'text'}).pipe(
      map(() => {
        this.loggedIn = true;
        this.username = username;
        this.checkAdmin().subscribe(
          data => this.isAdmin = data
        );
        return true;
      })
    );
  }

  logout(): Observable<boolean> {
    console.log("login out on service");
    let response = this.http.get<any[]>(`/logout.jsp`).pipe(
      catchError(err => {
        return err.status == 0 ? of([]) : throwError(err);
      }),
      map(() => {
        this.loggedIn = false;
        this.username = "";
        this.isAdmin = false;
        return true;
      })
    );
    console.log("response was "+typeof(response));
    console.log("response was "+response.toPromise());
    return response;
  }

  checkAdmin(): Observable<Boolean> {
    return this.http.get<any[]>(`${env.apiUrl}/auth/admin/${this.username}`, {headers: this.defaultHeaders}).pipe(
      map((result) => {
        if(result)
          return true;
        else
          return false;
      })
    );
  }

  createUser(userName: string, password: string): Observable<User> {
    return this.http.post<any>(`${env.apiUrl}/auth/users`, {userName, password}, {headers: this.defaultHeaders}).pipe(
      map(body => User.fromObject(body))
    );
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  getBaseUrl(): string {
    return `${env.apiUrl}/auth/session`
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
