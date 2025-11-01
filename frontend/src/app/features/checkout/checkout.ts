import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Information } from './information/information';
import { Payment } from './payment/payment';

@Component({
  selector: 'app-checkout',
  imports: [RouterModule, Information, Payment],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {}
