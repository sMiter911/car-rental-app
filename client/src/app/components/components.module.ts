import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent, NavbarComponent],
  imports: [CommonModule],
  exports: [NavbarComponent]
})
export class ComponentsModule {}
