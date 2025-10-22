import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

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
}
