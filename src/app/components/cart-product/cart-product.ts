import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cart-product',
  imports: [],
  templateUrl: './cart-product.html',
  styleUrl: './cart-product.css',
})
export class CartProduct {
  @Input() product!: {
    name: string;
    category: string;
    price: number;
    size: string;
    color: string;
    img: string;
  };
}
