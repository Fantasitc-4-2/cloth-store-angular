import { Component, OnInit } from '@angular/core';
import { WishlistItems } from '../../../components/wishlist-items/wishlist-items';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [WishlistItems],
  templateUrl: './favourites.html',
  styleUrls: ['./favourites.css'],
})
export class Favourites implements OnInit {
  wishlistItems: any[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.wishlistService.fetchWishlist().subscribe({
      next: (data) => {
        this.wishlistItems = data.products || [];
      },
      error: (err: any) => console.error('Error fetching cart products:', err),
    });
  }

  onRemove(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err: any) => console.error('Error removing wishlist item:', err),
    });
  }
}
