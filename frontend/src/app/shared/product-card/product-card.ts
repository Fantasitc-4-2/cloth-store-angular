import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product: any;
  addingToCart = false;
  addToCartMessage: string | null = null;
  addToCartSuccess = false;

  constructor(private cartService: CartService, private router: Router) {}

  onAddToCart(event: Event): void {
    // prevent the parent click (which navigates to product) from firing
    event.stopPropagation();

    if (!this.product || !this.product._id) return;

    // check stock
    if (this.product.quantity && this.product.quantity <= 0) {
      this.addToCartMessage = 'Sorry, this product is out of stock.';
      this.addToCartSuccess = false;
      this.hideMessageAfterDelay();
      return;
    }

    this.addingToCart = true;
    this.addToCartMessage = null;

    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: (res) => {
        this.addingToCart = false;
        this.addToCartSuccess = true;
        this.addToCartMessage = res.message || 'Product added to cart.';
        this.hideMessageAfterDelay();
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        this.addingToCart = false;
        this.addToCartSuccess = false;

        if (err?.status === 401) {
          this.addToCartMessage = 'Please login to add items to cart.';
          // navigate to login after a short delay and preserve return url
          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          }, 700);
        } else if (err?.status === 404) {
          this.addToCartMessage = 'Product not found.';
        } else {
          this.addToCartMessage = err?.error?.error || 'Failed to add product to cart. Please try again.';
        }

        this.hideMessageAfterDelay();
      },
    });
  }

  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.addToCartMessage = null;
      this.addToCartSuccess = false;
    }, 3000);
  }
}
