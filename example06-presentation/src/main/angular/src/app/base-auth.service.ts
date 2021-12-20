import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

export abstract class AuthService {

  protected defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(protected http: HttpClient) {
  }

  abstract login(username: string, password: string): Observable<boolean>;

  abstract logout(): Observable<boolean>;

  abstract checkAdmin(): Observable<Boolean>;

  abstract createUser(username: string, password: string): Observable<User>;

  abstract getAuthHeaders(): HttpHeaders;

  abstract getBaseUrl(): string;

  abstract get isLoggedIn(): boolean;
}
