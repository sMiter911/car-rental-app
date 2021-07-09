import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userLoginForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Regex patterns
    const PAT_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$';

    this.userLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(PAT_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submit() {
    this.isFormSubmitted = true;

    if (this.userLoginForm.invalid) {
      return;
    } else {
      // this.login.login(
      //   this.userLoginForm.value.email,
      //   this.userLoginForm.value.password
      // );
      console.log('Submit', this.userLoginForm.value);
    }
  }

}
