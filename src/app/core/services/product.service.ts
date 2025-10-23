import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  price?: number;
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
				throw error;
			})
		);
	}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching all products:', error);
        throw error;
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

    const url = this.baseUrl;
    console.log('=== API CALL ===');
    console.log('URL:', url);
    console.log('Params:', httpParams.toString());
    console.log('Full URL:', `${url}?${httpParams.toString()}`);

    return this.http.get<PaginatedProductsResponse>(this.baseUrl, { params: httpParams }).pipe(
      catchError(error => {
        console.error('❌ API Error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        throw error;
      })
    );
  }
}
