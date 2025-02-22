import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Gallery } from '../models/gallery.model';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly api = '/api/v1/gallery/';

  constructor(private http: HttpClient) {}

  getGallery(): Observable<any> {
    return this.http.get<Gallery[]>(`http://127.0.0.1:8000${this.api}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  getGalleryPieceById(id: string): Observable<any> {
    return this.http.get<Gallery>(`http://127.0.0.1:8000${this.api}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  addGalleryPiece(body: any): Observable<any> {
    return this.http
      .post<Gallery>(`http://127.0.0.1:8000${this.api}`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  updateGalleryPiece(id: string, body: any): Observable<any> {
    return this.http
      .patch<Gallery>(`http://127.0.0.1:8000${this.api}${id}`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }
}
