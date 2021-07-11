import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error) {
      let errMessage = '';
      try {
        // error.error holds the json response sent from API.
        errMessage = JSON.stringify(error.error);
      } catch (error) {
        errMessage = error.statusText;
      }
      return throwError(errMessage || error || 'Server error');
    }
    return throwError(error.error || error || 'Server error');
  }

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  register(client) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/register`, client)
      .pipe(retry(2), catchError(this.handleError));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
