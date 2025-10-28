import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistItem } from '../wishlist-item/wishlist-item';

@Component({
  selector: 'app-wishlist-items',
  standalone: true,
  imports: [CommonModule, WishlistItem],
  templateUrl: './wishlist-items.html',
  styleUrls: ['./wishlist-items.css'],
})
export class WishlistItems {
  @Input() products: Array<any> = [];
  @Output() remove = new EventEmitter<string>();

  trackById(index: number, item: any) {
    return item?._id ?? item?.id ?? index;
  }
}
