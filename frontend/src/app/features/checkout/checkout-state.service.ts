import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shipping } from '../../core/services/order.service';

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  private shipping$ = new BehaviorSubject<Shipping | null>(null);

  setShipping(shipping: Shipping) {
    this.shipping$.next(shipping);
  }

  getShipping$(): Observable<Shipping | null> {
    return this.shipping$.asObservable();
  }

  getShippingSnapshot(): Shipping | null {
    return this.shipping$.getValue();
  }
}
