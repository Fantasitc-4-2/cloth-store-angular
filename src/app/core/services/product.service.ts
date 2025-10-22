import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	// Point to your Node.js/Express API server
	private baseUrl: string = 'http://localhost:5000/products';

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
}
