import { Routes } from '@angular/router';

import { Checkout } from './checkout';
import { Payment } from './payment/payment';
import { Information } from './information/information';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    component: Checkout,
    children: [
      { path: 'info', component: Information },
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'payment', component: Payment },
    ],
  },
];
