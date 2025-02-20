import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = '/api/v1/users';
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`http://127.0.0.1:8000${this.api}/login`, credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  forgotPassword(credentials: { email: string }): Observable<any> {
    return this.http
      .post(`http://127.0.0.1:8000${this.api}/forgotPassword`, credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  resetPassword(
    id: string,
    credentials: { password: string },
  ): Observable<any> {
    return this.http
      .patch(
        `http://127.0.0.1:8000${this.api}/resetPassword/${id}`,
        credentials,
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return false;
    } else {
      return true;
    }
  }
}
