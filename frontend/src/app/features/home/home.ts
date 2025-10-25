import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { environment } from '../../../environments/environment';

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
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  
  // Slider 1: New Collection (shows 2 products)
  slider1Index: number = 0;
  slider1Products: Product[] = [];
  
  // Slider 2: New This Week (shows 6 products)
  slider2Index: number = 0;
  slider2Products: Product[] = [];
  
  // Slider 3: XIV Collections (shows 3 products)
  slider3Products: Product[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<ProductResponse>(`${environment.apiUrl}/products`)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.updateAllSliders();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false;
        }
      });
  }

  updateAllSliders(): void {
    this.updateSlider1();
    this.updateSlider2();
    this.updateSlider3();
  }

  // Slider 1: New Collection
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

  // Slider 2: New This Week
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

  // Slider 3: XIV Collections
  updateSlider3(): void {
    // Show last 3 products for XIV Collections
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

  addToCart(product: Product): void {
    console.log('Added to cart:', product);
    // Implement your cart logic here
  }

  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product);
    // Implement your wishlist logic here
  }

  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  goToProductsPage(): void {
    this.router.navigate(['/products']);
  }
}