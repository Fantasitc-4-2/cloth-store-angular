import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { ProductCard } from "../../../shared/product-card/product-card";
import { ProductSearch } from "../product-search/product-search";
import { Pagination } from "../../../shared/pagination/pagination";
import { ProductService, ProductQueryParams, PaginatedProductsResponse } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, Sidebar, ProductCard, ProductSearch, Pagination],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  // Pagination properties
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  hasNextPage = false;
  hasPrevPage = false;
  itemsPerPage = 50;

  // Search and filter properties
  searchTerm = '';
  selectedCategory = '';
  searchSubject = new Subject<string>();
  isSearching = false;

  // Query parameters
  private queryParams: ProductQueryParams = {
    page: 1,
    limit: 50
  };

  constructor(private productService: ProductService, private router: Router) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.isSearching = true;
      this.loadProducts();
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    // Update query parameters
    this.queryParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined,
      category: this.selectedCategory || undefined
    };

    console.log('Loading products with params:', this.queryParams);

    this.productService.getProductsWithPagination(this.queryParams).subscribe({
      next: (response: PaginatedProductsResponse) => {
        console.log('API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is array:', Array.isArray(response));

        if (response && response.products && Array.isArray(response.products)) {
          console.log('✅ Processing paginated response');
          this.products = response.products;
          this.currentPage = response.currentPage || 1;
          this.totalPages = response.totalPages || 1;
          this.totalCount = response.totalCount || response.products.length;
          this.hasNextPage = response.hasNextPage || false;
          this.hasPrevPage = response.hasPrevPage || false;
        } else if (Array.isArray(response)) {
          // Fallback: if API returns array directly instead of paginated response
          console.log('⚠️ API returned array directly, treating as page 1');
          this.products = response;
          this.currentPage = 1;
          this.totalPages = 1;
          this.totalCount = response.length;
          this.hasNextPage = false;
          this.hasPrevPage = false;
        } else {
          console.warn('❌ Unexpected response format:', response);
          this.products = [];
          this.totalCount = 0;
          this.currentPage = 1;
          this.totalPages = 1;
          this.hasNextPage = false;
          this.hasPrevPage = false;
        }

        this.loading = false;
        this.isSearching = false;
        console.log('Final state:', {
          productsLength: this.products?.length || 0,
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          totalCount: this.totalCount
        });
      },
      error: (err) => {
        this.error = 'Error loading products';
        console.error('❌ API Error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        this.loading = false;
        this.isSearching = false;

        // Fallback to basic API call
        console.log('🔄 Trying fallback to getAllProducts...');
        this.productService.getAllProducts().subscribe({
          next: (data) => {
            console.log('✅ Fallback success:', data);
            this.products = data || [];
            this.currentPage = 1;
            this.totalPages = 1;
            this.totalCount = this.products.length;
            this.hasNextPage = false;
            this.hasPrevPage = false;
            this.loading = false;
            this.isSearching = false;
          },
          error: (fallbackErr) => {
            console.error('❌ Fallback also failed:', fallbackErr);
            this.products = [];
            this.loading = false;
            this.isSearching = false;
          }
        });
      }
    });
  }

  goToProduct(id?: string) {
    if (!id) {
      this.error = 'Product ID is missing!';
      console.error('Product ID is missing!');
      return;
    }
    this.router.navigate(['/products', id]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.loadProducts();
  }
}
