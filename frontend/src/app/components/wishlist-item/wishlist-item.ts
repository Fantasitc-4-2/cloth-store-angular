import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [],
  templateUrl: './wishlist-item.html',
  styleUrls: ['./wishlist-item.css'],
})
export class WishlistItem {
  @Input() product!: any;
  @Output() remove = new EventEmitter<string>();

  onRemove() {
    const id = this.product?._id ?? this.product?.id;
    if (id != null) {
      this.remove.emit(id.toString());
    }
  }
}
