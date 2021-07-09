import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CarsComponent } from './cars/cars.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [HomeComponent, NavbarComponent, CarsComponent, BookingsComponent],
  imports: [CommonModule, AppRoutingModule],
  exports: [NavbarComponent]
})
export class ComponentsModule {}
