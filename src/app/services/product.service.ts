import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = '/api/v1/products/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<Product[]>(`http://127.0.0.1:8000${this.api}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<Product>(`http://127.0.0.1:8000${this.api}${id}`);
  }
}
