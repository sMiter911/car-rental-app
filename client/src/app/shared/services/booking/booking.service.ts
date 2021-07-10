import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bookings } from '../../models/bookings.model';
import { Cars } from '../../models/cars.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
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
  


  constructor(private http: HttpClient) {}

  getCars(): Observable<Cars> {
    const URL = `${environment.apiUrl}/cars`;
    return this.http.get<Cars>(URL)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getBookings(): Observable<Bookings> {
    const URL = `${environment.apiUrl}/bookings`;
    return this.http.get<Bookings>(URL)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  bookTestDrive(booking): Observable<Bookings> {
    const URL = `${environment.apiUrl}/book`;
    return this.http.post<Bookings>(URL, booking)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
