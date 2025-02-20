import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly api = '/api/v1/inventory/';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<any> {
    return this.http.get<Product[]>(`http://127.0.0.1:8000${this.api}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  getItemById(id: string): Observable<any> {
    return this.http.get<Product>(`http://127.0.0.1:8000${this.api}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  addItem(body: any): Observable<any> {
    return this.http
      .post<Product>(`http://127.0.0.1:8000${this.api}`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  updateItem(id: string, body: any): Observable<any> {
    return this.http
      .patch<Product>(`http://127.0.0.1:8000${this.api}${id}`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }
}
