import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLoginForm: FormGroup;
  isFormSubmitted: boolean = false;
  error = '';
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.reactiveForm();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  private reactiveForm(): void {
    // Regex patterns
    const PAT_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$';

    this.userLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(PAT_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Handling of form errors
  public errorHandling = (control: string, error: string) => {
    return this.userLoginForm.controls[control].hasError(error);
  };

  get f() {
    return this.userLoginForm.controls;
  }

  submit() {
    this.isFormSubmitted = true;

    if (this.userLoginForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.authService
        .login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: () => {
            const returnUrl =
              this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          error: (error) => {
            this.error = error;
            this.loading = false;
          },
        });
      console.log('Submit', this.userLoginForm.value);
    }
  }
}
