import { Component } from '@angular/core';
import { WishlistItem } from '../wishlist-item/wishlist-item';

@Component({
  selector: 'app-wishlist-items',
  imports: [WishlistItem],
  templateUrl: './wishlist-items.html',
  styleUrl: './wishlist-items.css',
})
export class WishlistItems {
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
}
