import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

export const crmRoutes = [
  {
    path: 'home',
    component: HomeComponent
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(crmRoutes)
  ]
})
export class FinanceModule { }
