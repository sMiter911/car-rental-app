import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  dataTable: boolean = true;

  constructor(
    private _bookingsService: BookingService,
    private authService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    const clientID = {
      clientID: this.currentUser.user.id
    }
    console.log({...clientID})
    this._bookingsService.getClientBookings(clientID.clientID).subscribe((data: Bookings) => {
      this.bookings = data;
      console.log(this.bookings.rows.length);
      if(this.bookings.rows.length == 0){
        this.dataTable = false;
      }
    });
  }

  editBookingDetails(id: string): void {
    this.router.navigate(['editbooking', id])
  }
}
