import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bookings } from '../../models/bookings.model';
import { Cars } from '../../models/cars.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getCars(): Observable<Cars> {
    const URL = `${environment.apiUrl}/cars`;
    return this.http.get<Cars>(URL)
  }

  getBookings(): Observable<Bookings> {
    const URL = `${environment.apiUrl}/Bookings`;
    return this.http.get<Bookings>(URL)
  }
}
