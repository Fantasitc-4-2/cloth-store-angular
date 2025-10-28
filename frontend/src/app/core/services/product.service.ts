import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  price?: number;
  sizes?: string[];
  availability?: string | boolean;
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	// Point to your Node.js/Express API server
	private baseUrl = `${environment.apiUrl}/products`;

	constructor(private http: HttpClient) {
		// Log the base URL for debugging
		console.log('ProductService using API base URL:', this.baseUrl);
	}

	getProductById(id: string): Observable<Product> {
		const url = `${this.baseUrl}/${id}`;
		console.log('Fetching product from:', url);
		return this.http.get<Product>(url).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(() => error);
      })
		);
	}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching all products:', error);
        return throwError(() => error);
      })
    );
  }

  getProductsWithPagination(params: ProductQueryParams = {}): Observable<PaginatedProductsResponse> {
    let httpParams = new HttpParams();

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params.price) {
      httpParams = httpParams.set('price', params.price.toString());
    }
    if (params.sizes) {
      const sizesValue = Array.isArray(params.sizes)
        ? JSON.stringify(params.sizes.map(s => String(s).toLowerCase()))
        : JSON.stringify([String(params.sizes).toLowerCase()]);
      httpParams = httpParams.set('sizes', sizesValue);
    }
    if (params.availability !== undefined) {
      httpParams = httpParams.set('availability', String(params.availability));
    }
    if (params.colors) {
      const colorsValue = Array.isArray(params.colors)
        ? JSON.stringify(params.colors)
        : JSON.stringify([String(params.colors)]);
      httpParams = httpParams.set('colors', colorsValue);
    }
    if (params.minPrice !== undefined) {
      httpParams = httpParams.set('minPrice', String(params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      httpParams = httpParams.set('maxPrice', String(params.maxPrice));
    }
    if (params.rating !== undefined) {
      httpParams = httpParams.set('rating', String(params.rating));
    }

    const url = this.baseUrl;
    console.log('URL:', `${url}?${httpParams.toString()}`);

    return this.http.get<PaginatedProductsResponse>(this.baseUrl, { params: httpParams }).pipe(
      catchError(error => {
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        return throwError(() => error);
      })
    );
  }


  addProduct(payload: any): Observable<Product> {
    console.log('Posting new product to:', this.baseUrl, 'payload:', payload);
    return this.http.post<Product>(this.baseUrl, payload).pipe(
      catchError(error => {
        console.error('Error adding product:', error);
        return throwError(() => error);
      })
    );
  }

  // POST with multipart/form-data (FormData) for image upload directly to backend
  addProductFormData(formData: FormData): Observable<Product> {
    console.log('Posting new product (form-data) to:', this.baseUrl);
    return this.http.post<Product>(this.baseUrl, formData).pipe(
      catchError(error => {
        console.error('Error adding product (form-data):', error);
        return throwError(() => error);
      })
    );
  }

  getCategories(): Observable<any[]> {
    const url = `${environment.apiUrl}/categories`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }
}
