import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly api = '/api/v1/products/';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<any> {
    return this.http.get<Product[]>(`http://127.0.0.1:8000${this.api}`);
  }

  getItemById(id: string): Observable<any> {
    return this.http.get<Product>(`http://127.0.0.1:8000${this.api}${id}`);
  }
}
