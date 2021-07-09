import { Component, OnInit } from '@angular/core';
import { Cars } from 'src/app/shared/models/cars.model';
import { BookingService } from 'src/app/shared/services/booking/booking.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  availableCars: Cars;

  constructor(private _bookingsService: BookingService) {}

  ngOnInit(): void {
    this._bookingsService.getCars().subscribe((data: Cars) => {
      this.availableCars = data;
      console.log(this.availableCars.rows)
    });
  }
}
