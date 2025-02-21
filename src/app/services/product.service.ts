import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = '/api/v1/products/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<Product[]>(`http://127.0.0.1:8000${this.api}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<Product>(`http://127.0.0.1:8000${this.api}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
