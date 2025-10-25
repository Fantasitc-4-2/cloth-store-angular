import { Component, OnInit } from '@angular/core';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../models/product.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NgxImageZoomModule, CurrencyPipe, HttpClientModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  addingToCart = false;
  addToCartMessage: string | null = null;
  addToCartSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Product id is missing from route.';
      return;
    }
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.error = err.message || 'Failed to load product. Please check the API connection.';
        this.loading = false;
      },
    });
  }

  addToCart(): void {
    if (!this.product || !this.product._id) {
      return;
    }

    // Check if product is in stock
    if (this.product.quantity && this.product.quantity <= 0) {
      this.addToCartMessage = 'Sorry, this product is out of stock.';
      this.addToCartSuccess = false;
      this.hideMessageAfterDelay();
      return;
    }

    this.addingToCart = true;
    this.addToCartMessage = null;

    // Call API to add to cart (quantity default is 1)
    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: (response) => {
        console.log('Add to cart response:', response);
        this.addingToCart = false;
        this.addToCartSuccess = true;
        this.addToCartMessage = response.message || 'Product added to cart successfully!';
        this.hideMessageAfterDelay();
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
        this.addingToCart = false;
        this.addToCartSuccess = false;

        // Handle different error cases
        if (err.status === 401) {
          this.addToCartMessage = 'Please login to add items to cart.';
          // Optionally redirect to login after a delay
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url },
            });
          }, 2000);
        } else if (err.status === 404) {
          this.addToCartMessage = 'Product not found.';
        } else if (err.status === 400) {
          this.addToCartMessage = err.error?.error || 'Invalid request.';
        } else {
          this.addToCartMessage =
            err.error?.error || 'Failed to add product to cart. Please try again.';
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

  // These methods are called in the template but were missing
  isInCart(): boolean {
    // For now, return false since we don't have cart state tracked locally
    // You can enhance this later by fetching cart on init
    return false;
  }

  getCartQuantity(): number {
    // For now, return 0 since we don't have cart state tracked locally
    // You can enhance this later by fetching cart on init
    return 0;
  }
}
