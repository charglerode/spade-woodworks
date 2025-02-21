import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly api = '/api/v1/quotes/';

  constructor(private http: HttpClient) {}

  getQuote(): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000${this.api}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
