import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutStateService } from '../checkout-state.service';
import { Shipping } from '../../../core/services/order.service';

@Component({
  selector: 'app-information',
  imports: [FormsModule],
  templateUrl: './information.html',
  styleUrl: './information.css',
})
export class Information {
  products: Array<{
    id: number;
    name: string;
    category: string;
    price: number;
    size: string;
    color: string;
    img: string;
  }> = [
    {
      id: 1,
      name: 'Sample Product',
      category: 'Shirts',
      price: 29.99,
      size: 'M',
      color: 'Red',
      img: '/Rectangle 3.png',
    },
    {
      id: 2,
      name: 'Sample Product',
      category: 'Shirts',
      price: 40.99,
      size: 'L',
      color: 'Blue',
      img: '/Rectangle 3.png',
    },
  ];

  // form fields bound with ngModel
  email: string = '';
  phone: string = '';
  firstName: string = '';
  lastName: string = '';
  country: string = '';
  stateRegion: string = '';
  address: string = '';
  city: string = '';
  postalCode: string = '';

  constructor(private checkoutState: CheckoutStateService) {}

  updateShipping() {
    const shipping: Shipping = {
      street: this.address,
      city: this.city,
      state: this.stateRegion,
      postal_code: this.postalCode,
      country: this.country,
    };
    this.checkoutState.setShipping(shipping);
  }
}
