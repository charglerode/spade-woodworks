import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly api = '/api/v1/contact/';

  constructor(private http: HttpClient) {}

  sendMessage(body: any): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000${this.api}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
