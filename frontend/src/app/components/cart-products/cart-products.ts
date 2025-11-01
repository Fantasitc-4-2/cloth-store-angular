import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartProduct } from '../cart-product/cart-product';

@Component({
  selector: 'app-cart-products',
  imports: [CartProduct],
  templateUrl: './cart-products.html',
  styleUrl: './cart-products.css',
})
export class CartProducts {
  @Input() cartItems: any[] = [];
  @Output() cartUpdated = new EventEmitter<{ subTotal?: number }>();
  // emit events to parent when cart changes (removed or quantity updated)
  removeFromLocalList(deletedId: string) {
    this.cartItems = this.cartItems.filter((item) => item._id !== deletedId);
    // notify parent to refresh totals
    this.cartUpdated.emit({});
  }

  onQuantityChanged(payload: { productId: string; quantity: number }) {
    // Find the cart item that matches this productId and update its quantity
    const item = this.cartItems.find((i) => {
      const pid = i.productId?._id || i.productId;
      return pid === payload.productId;
    });
    if (item) {
      item.quantity = payload.quantity;
      // notify parent to refresh totals
      this.cartUpdated.emit({});
    }
  }
}
