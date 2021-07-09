import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CarsComponent } from './cars/cars.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AppRoutingModule } from '../app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    CarsComponent,
    BookingsComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [NavbarComponent],
})
export class ComponentsModule {}
