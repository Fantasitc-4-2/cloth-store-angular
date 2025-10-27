import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { WishlistService } from '../../core/services/wishlist.service';
import { Subject, takeUntil } from 'rxjs';

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  discountRate?: number;
  image: string;
  quantity: number;
  sold: number;
  categoryName: string;
  reviewCount: number;
  averageRating: number;
}

interface ProductResponse {
  products: Product[];
  total: number;
  currentPage: number;
  pages: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  products: Product[] = [];
  loading: boolean = true;
  wishlistIds: Set<string> = new Set();
  private destroy$ = new Subject<void>();

  slider1Index: number = 0;
  slider1Products: Product[] = [];

  slider2Index: number = 0;
  slider2Products: Product[] = [];

  slider3Products: Product[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private wishlistService: WishlistService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToWishlist();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToWishlist(): void {
    this.wishlistService.wishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wishlistIds => {
        this.wishlistIds = wishlistIds;
      });
  }

  loadProducts(): void {
    this.http.get<ProductResponse>(`${environment.apiUrl}/products`).subscribe({
      next: (response) => {
        this.products = response.products;
        this.updateAllSliders();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      },
    });
  }

  updateAllSliders(): void {
    this.updateSlider1();
    this.updateSlider2();
    this.updateSlider3();
  }

  updateSlider1(): void {
    this.slider1Products = this.products.slice(this.slider1Index, this.slider1Index + 2);
  }

  nextSlider1(): void {
    if (this.slider1Index < this.products.length - 2) {
      this.slider1Index++;
      this.updateSlider1();
    }
  }

  prevSlider1(): void {
    if (this.slider1Index > 0) {
      this.slider1Index--;
      this.updateSlider1();
    }
  }

  updateSlider2(): void {
    this.slider2Products = this.products.slice(this.slider2Index, this.slider2Index + 6);
  }

  nextSlider2(): void {
    if (this.slider2Index < this.products.length - 6) {
      this.slider2Index++;
      this.updateSlider2();
    }
  }

  prevSlider2(): void {
    if (this.slider2Index > 0) {
      this.slider2Index--;
      this.updateSlider2();
    }
  }

  updateSlider3(): void {
    const startIndex = Math.max(0, this.products.length - 3);
    this.slider3Products = this.products.slice(startIndex, this.products.length);
  }

  getInventoryStatus(quantity: number): string {
    if (quantity === 0) return 'OUTOFSTOCK';
    if (quantity < 5) return 'LOWSTOCK';
    return 'INSTOCK';
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds.has(productId);
  }

  toggleWishlist(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.isInWishlist(product._id)) {
      this.removeFromWishlist(product);
    } else {
      this.addToWishlist(product);
    }
  }

  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${product.title} added to wishlist`,
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add to wishlist. Please try again.',
          life: 3000
        });
      }
    });
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Removed',
          detail: `${product.title} removed from wishlist`,
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove from wishlist. Please try again.',
          life: 3000
        });
      }
    });
  }

  addToCart(product: Product): void {
    console.log('Added to cart:', product);
  }

  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  goToProductsPage(): void {
    this.router.navigate(['/products']);
  }
}