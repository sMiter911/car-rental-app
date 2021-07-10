import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingformComponent } from './components/bookingform/bookingform.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { CarsComponent } from './components/cars/cars.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './shared/helpers/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'cars', component: CarsComponent},
  {path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard]},
  {path: 'book', component: BookingformComponent, canActivate: [AuthGuard]},
  {path: 'editbooking/:id', component: BookingformComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
