import { Component, OnInit } from '@angular/core';
import { Bookings } from 'src/app/shared/models/bookings.model';
import { BookingService } from 'src/app/shared/services/booking/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: Bookings;

  constructor(private _bookingsService: BookingService) { }

  ngOnInit(): void {
    this._bookingsService.getBookings().subscribe((data: Bookings) => {
      this.bookings = data;
      console.log(this.bookings.rows)
    });
  }

}
