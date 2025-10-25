import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  message: string;
  cart?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = `${environment.apiUrl}/carts`; // Note: /carts (plural) to match your backend

  constructor(private http: HttpClient) {
    console.log('CartService using API base URL:', this.baseUrl);
  }

  /**
   * Add product to cart via API
   * Requires authentication token in cookies or headers
   */
  addToCart(productId: string, quantity: number = 1): Observable<AddToCartResponse> {
    const payload: AddToCartPayload = {
      productId,
      quantity,
    };

    console.log('Adding to cart:', payload);

    // Your backend uses cookie-based auth, so credentials are included
    return this.http
      .post<AddToCartResponse>(this.baseUrl, payload, {
        withCredentials: true, // Important: sends cookies with request
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding to cart:', error);

          // Handle specific error cases
          if (error.status === 401) {
            console.error('User not authenticated');
          } else if (error.status === 404) {
            console.error('Product not found');
          } else if (error.status === 400) {
            console.error('Invalid quantity or product');
          }

          return throwError(() => error);
        })
      );
  }

  /**
   * Get user's cart
   */
  getCart(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching cart:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Remove item from cart
   */
  removeFromCart(itemId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/${itemId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error removing from cart:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update item quantity in cart
   */
  updateQuantity(itemId: string, quantity: number): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${itemId}`, { quantity }, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error updating quantity:', error);
          return throwError(() => error);
        })
      );
  }
}
