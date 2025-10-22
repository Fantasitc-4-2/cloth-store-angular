import { Component, OnInit } from '@angular/core';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NgxImageZoomModule, CurrencyPipe, HttpClientModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
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
        if (!p) {
          this.error = 'Product not found';
          console.error('Product data is empty');
        } else {
          this.product = p;
          console.log('Received product:', p);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.error = err.message || 'Failed to load product. Please check the API connection.';
        this.loading = false;
      }
    });
  }
}
