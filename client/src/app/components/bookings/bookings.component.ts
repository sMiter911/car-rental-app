import { Component, OnInit } from '@angular/core';
import { Bookings } from 'src/app/shared/models/bookings.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import { BookingService } from 'src/app/shared/services/booking/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  bookings: Bookings;
  currentUser: User;

  constructor(
    private _bookingsService: BookingService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    const clientID = {
      clientID: this.currentUser.user.id
    }
    console.log({...clientID})
    this._bookingsService.getClientBookings(clientID).subscribe((data: Bookings) => {
      this.bookings = data;
      console.log(this.bookings);
    });
  }
}
