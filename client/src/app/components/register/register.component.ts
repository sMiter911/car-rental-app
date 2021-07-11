import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isFormSubmitted: boolean = false;
  error = '';
  loading = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.reactiveForm();
  }

  private reactiveForm() {
    // Regex patterns
    const PAT_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$';

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(PAT_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required]],
    });
  }

  // Handling of form errors
  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  };

  get f() {
    return this.f.controls;
  }

  ngOnInit(): void {}

  submit(): void {
    this.isFormSubmitted = true;
    if (this.form.invalid) {
      return
    }else {
      this.loading = true;
      this.authService
        .register(this.form.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.error = error;
            this.loading = false;
            if(this.error == "Bad Request"){
            alert('Email exists')
            }
          },
        });
      console.log('Submit', this.form.value);
    }
  }
}
