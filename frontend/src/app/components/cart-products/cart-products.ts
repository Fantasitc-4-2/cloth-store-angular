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

  //   name: string;
  //   category: string;
  //   price: number;
  //   size: string;
  //   color: string;
  //   img: string;
  // }> = [
  //   {
  //     id: 1,
  //     name: 'Sample Product',
  //     category: 'Shirts',
  //     price: 29.99,
  //     size: 'M',
  //     color: 'Red',
  //     img: '/Rectangle 3.png',
  //   },
  //   {
  //     id: 2,
  //     name: 'Sample Product',
  //     category: 'Shirts',
  //     price: 40.99,
  //     size: 'L',
  //     color: 'Blue',
  //     img: '/Rectangle 3.png',
  //   },
  // ];
}
