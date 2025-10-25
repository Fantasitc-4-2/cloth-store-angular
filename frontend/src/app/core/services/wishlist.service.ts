import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AddToWishlistPayload {
  productId: string;
}

export interface AddToWishlistResponse {
  message: string;
  wishlist?: any;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = `${environment.apiUrl}/wishlist`; // Singular or plural depending on your backend route

  constructor(private http: HttpClient) {
    console.log('WishlistService using API base URL:', this.baseUrl);
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(productId: string): Observable<AddToWishlistResponse> {
    const payload: AddToWishlistPayload = { productId };

    console.log('Adding to wishlist:', payload);

    return this.http
      .post<AddToWishlistResponse>(this.baseUrl, payload, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding to wishlist:', error);

          if (error.status === 401) {
            console.error('User not authenticated');
          } else if (error.status === 404) {
            console.error('Product not found');
          }

          return throwError(() => error);
        })
      );
  }

  /**
   * Get user's wishlist
   */
  getWishlist(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching wishlist:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/${productId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error removing from wishlist:', error);
          return throwError(() => error);
        })
      );
  }
}
