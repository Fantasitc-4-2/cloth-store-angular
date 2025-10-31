import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, Shipping } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { CheckoutStateService } from '../checkout-state.service';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  isProcessing: boolean = false;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private checkoutState: CheckoutStateService
  ) {}

  /**
   * Triggered when user clicks Pay Now.
   * This example reads the cart id from CartService.getCart() response and
   * sends a shipping payload. You should replace the hardcoded shipping with
   * actual form values collected from the Information component.
   */
  payNow() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    // Read shipping values that were saved from the Information form
    const shipping = this.checkoutState.getShippingSnapshot();
    if (!shipping) {
      console.error(
        'Shipping information is empty. Please fill out the information form before paying.'
      );
      this.isProcessing = false;
      return;
    }
    this.cartService.getCart().subscribe({
      next: (data) => {
        const cartId = data?.cartUser?._id || data?.cartUser?.id || data?.id;
        if (!cartId) {
          console.error('No cart id found in getCart response', data);
          this.isProcessing = false;
          return;
        }

        this.orderService.createOrder(cartId, shipping).subscribe({
          next: (res) => {
            console.log('Order created:', res);
            this.isProcessing = false;
            // Navigate to a confirmation page or orders list if desired
            this.router.navigate(['/orders']);
          },
          error: (err) => {
            console.error('Failed to create order', err);
            this.isProcessing = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to load cart to obtain cart id', err);
        this.isProcessing = false;
      },
    });
  }
}
