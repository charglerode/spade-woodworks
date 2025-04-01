import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Cart } from '../models/cart.model';
import { StripeService } from 'ngx-stripe';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly api = '/api/v1/checkout/';

  constructor(
    private http: HttpClient,
    private stripe: StripeService,
  ) {}

  getSession(id: string): Observable<any> {
    return this.http
      .post(`http://127.0.0.1:8000${this.api}success/${id}`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }
}
