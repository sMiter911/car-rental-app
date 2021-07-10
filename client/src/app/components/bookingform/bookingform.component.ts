import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { BookingService } from 'src/app/shared/services/booking/booking.service';

@Component({
  selector: 'app-bookingform',
  templateUrl: './bookingform.component.html',
  styleUrls: ['./bookingform.component.scss'],
})
export class BookingformComponent implements OnInit {
  bookingForm: FormGroup;
  isFormSubmitted: boolean = false;
  error = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.reactiveForm();
  }

  private reactiveForm(): void {
    // Regex patterns
    const PAT_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$';

    this.bookingForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(PAT_EMAIL)]],
      idNum: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      city: [''],
      province: [''],
      country: [''],
      postal_code: [''],
      manufacturer: ['', [Validators.required]],
      vehicle_name: ['', [Validators.required]],
      booking_date: ['', [Validators.required]],
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.bookingForm.controls[control].hasError(error);
  };

  get f() {
    return this.bookingForm.controls;
  }

  submit(): void {
    this.isFormSubmitted = true;
    if (this.bookingForm.status == 'INVALID') {
      alert('Invalid form fields');
    } else {
      if (this.validateID() == true) {
        this.bookingService.bookTestDrive(this.bookingForm.value)
        .pipe(first())
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error)
        );
        this.bookingForm.reset();
        this.router.navigate(['/bookings']);
        console.log('Booking Payload: ', this.bookingForm.value);
      }
    }
  }

  validateID() {
    var idNo = this.bookingForm.value.idNum;

    if (this.bookingForm.status == 'VALID') {
      if (idNo.length == 13) {
        let evenConcat = '';
        let oddSum = 0;
        let evenSum = 0;
        for (let i = 0; i < idNo.length - 1; i++) {
          if ((i + 1) % 2 != 0) {
            oddSum += parseInt(idNo[i]);
          } else {
            evenConcat += idNo[i];
          }
        }
        evenConcat = (parseInt(evenConcat) * 2).toString();
        for (let i = 0; i < evenConcat.length; i++) {
          evenSum += parseInt(evenConcat[i]);
        }
        let result = ((10 - ((oddSum + evenSum) % 10)) % 10).toString();
        if (result == idNo[idNo.length - 1]) {
          alert(idNo + ' is a valid ID number');
          return true;
        } else {
          alert('Please supply a valid ID number');
          return false;
        }
      } else {
        alert('Please supply a valid ID number');
        return false;
      }
    }
    return '...';
  }
}
