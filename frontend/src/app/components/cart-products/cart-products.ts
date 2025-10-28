import { Component, Input } from '@angular/core';
import { CartProduct } from '../cart-product/cart-product';

@Component({
  selector: 'app-cart-products',
  imports: [CartProduct],
  templateUrl: './cart-products.html',
  styleUrl: './cart-products.css',
})
export class CartProducts {
  @Input() cartItems: any[] = [];
  removeFromLocalList(deletedId: string) {
    this.cartItems = this.cartItems.filter((item) => item._id !== deletedId);
  }
}
