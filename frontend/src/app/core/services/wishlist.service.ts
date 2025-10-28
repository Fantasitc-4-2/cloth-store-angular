import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface Wishlist {
  _id: string;
  user: string;
  products: any[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Set<string>>(new Set());
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.http
      .get<Wishlist>(`${environment.apiUrl}/wishlist`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          const productIds = new Set(response.products?.map((p: any) => p._id || p) || []);
          this.wishlistSubject.next(productIds);
        },
        error: (error) => {
          console.error('Error loading wishlist:', error);
          this.wishlistSubject.next(new Set());
        },
      });
  }

  // return the raw wishlist Observable when callers need the full data
  fetchWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${environment.apiUrl}/wishlist`, {
      withCredentials: true,
    });
  }

  addToWishlist(productId: string): Observable<Wishlist> {
    return this.http
      .post<Wishlist>(`${environment.apiUrl}/wishlist`, { productId }, { withCredentials: true })
      .pipe(
        tap((response) => {
          const productIds = new Set(response.products?.map((p: any) => p._id || p) || []);
          this.wishlistSubject.next(productIds);
        })
      );
  }

  removeFromWishlist(productId: string): Observable<Wishlist> {
    return this.http
      .delete<Wishlist>(`${environment.apiUrl}/wishlist/${productId}`, { withCredentials: true })
      .pipe(
        tap((response) => {
          const productIds = new Set(response.products?.map((p: any) => p._id || p) || []);
          this.wishlistSubject.next(productIds);
        })
      );
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistSubject.value.has(productId);
  }

  getWishlistIds(): Set<string> {
    return this.wishlistSubject.value;
  }
}
