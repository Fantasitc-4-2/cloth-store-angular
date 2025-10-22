import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }
}
