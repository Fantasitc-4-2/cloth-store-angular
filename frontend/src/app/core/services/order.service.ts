import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Shipping {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CreateOrderResponse {
  message: string;
  order?: any;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Create an order for the given cart id.
   * POST to /orders/{cartId} with body { shipping: { ... } }
   */
  createOrder(cartId: string, shipping: Shipping): Observable<CreateOrderResponse> {
    const url = `${this.baseUrl}/${cartId}`;
    const body = { shipping };

    return this.http.post<CreateOrderResponse>(url, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error creating order:', error);
        return throwError(() => error);
      })
    );
  }
}
