import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // Regex patterns
    const PAT_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$';

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(PAT_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.isFormSubmitted = true;
    if (this.form.valid) {
      console.log(this.form.value)
    }
  }
}
