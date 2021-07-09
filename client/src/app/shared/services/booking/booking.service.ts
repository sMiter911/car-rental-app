import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cars } from '../../models/cars.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getCars(): Observable<Cars> {
    const URL = `http://localhost:3500/cars`;
    return this.http.get<Cars>(URL)
  }
}
