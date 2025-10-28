import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { ProductCard } from "../../../shared/product-card/product-card";
import { ProductSearch } from "../product-search/product-search";
import { Pagination } from "../../../shared/pagination/pagination";
import { ProductService, ProductQueryParams, PaginatedProductsResponse } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink, Sidebar, ProductCard, ProductSearch, Pagination],
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
  // default to 9 items per page as requested
  itemsPerPage = 9;
  // sensible page-size options (9 is default)
  pageSizes = [9, 18, 36];

  // Expose Math to template for min/max operations
  readonly Math = Math;

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

  // Sidebar filters
  private sidebarFilters: any = {};
  @ViewChild(Sidebar) sidebarComp?: Sidebar;

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
      category: this.selectedCategory || undefined,
      // include sidebar filters if present
      sizes: this.sidebarFilters?.sizes,
      availability: this.sidebarFilters?.availability ?? undefined,
      colors: this.sidebarFilters?.colors,
      minPrice: this.sidebarFilters?.minPrice,
      maxPrice: this.sidebarFilters?.maxPrice,
      rating: this.sidebarFilters?.rating
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
          // normalize total count (backend may use 'total' or 'totalCount')
          this.totalCount = (response as any).totalCount ?? (response as any).total ?? response.products.length;
          // compute total pages based on itemsPerPage
          this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.itemsPerPage));
          this.hasNextPage = this.currentPage < this.totalPages;
          this.hasPrevPage = this.currentPage > 1;
        } else if (Array.isArray(response)) {
          // Fallback: if API returns array directly instead of paginated response
          console.log('⚠️ API returned array directly, treating as page 1');
          this.products = response;
          this.currentPage = 1;
          this.totalPages = Math.max(1, Math.ceil(response.length / this.itemsPerPage));
          this.totalCount = response.length;
          this.hasNextPage = this.currentPage < this.totalPages;
          this.hasPrevPage = this.currentPage > 1;
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
            this.totalCount = this.products.length;
            this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.itemsPerPage));
            this.hasNextPage = this.currentPage < this.totalPages;
            this.hasPrevPage = this.currentPage > 1;
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

  onSidebarFilters(filters: any) {
    // store filters and reload products
    this.sidebarFilters = filters || {};
    this.currentPage = 1;
    if (this.filtersActive) {
      this.loadProducts();
    } else {
      this.router.navigate(['/products']).then(() => this.loadProducts());
    }
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

  onPageSizeChange(eventOrSize: any): void {
    // Accept either a number or a change event
    const newSize = typeof eventOrSize === 'number' ? eventOrSize : Number(eventOrSize.target?.value ?? eventOrSize);
    if (!isNaN(newSize) && newSize > 0 && newSize !== this.itemsPerPage) {
      this.itemsPerPage = newSize;
      this.currentPage = 1; // reset page when page size changes
      this.loadProducts();
    }
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
    this.sidebarFilters = {};
    this.currentPage = 1;
    // also clear the sidebar component selections if available
    this.sidebarComp?.clearFilters();
    // navigate to /products to reset route state and reload
    this.router.navigate(['/products']).then(() => {
      this.loadProducts();
    });
  }

  get filtersActive(): boolean {
    return !!(
      (this.searchTerm && this.searchTerm.trim()) ||
      this.selectedCategory ||
      this.sidebarFilters?.sizes?.length ||
      this.sidebarFilters?.colors?.length ||
      this.sidebarFilters?.availability !== undefined && this.sidebarFilters?.availability !== null ||
      this.sidebarFilters?.minPrice !== undefined ||
      this.sidebarFilters?.maxPrice !== undefined ||
      this.sidebarFilters?.rating !== undefined
    );
  }
}
