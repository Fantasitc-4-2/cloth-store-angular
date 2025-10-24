import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wishlist-item',
  imports: [],
  templateUrl: './wishlist-item.html',
  styleUrl: './wishlist-item.css',
})
export class WishlistItem {
  @Input() product!: {
    name: string;
    category: string;
    price: number;
    size: string;
    color: string;
    img: string;
  };
}
