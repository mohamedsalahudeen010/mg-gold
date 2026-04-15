import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductsResponse } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = `${environment.apiUrl}/products`;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll(page = 1, category = ''): Observable<ProductsResponse> {
    const params: any = { page };
    if (category) params['category'] = category;
    return this.http.get<ProductsResponse>(this.api, { params });
  }
  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }
  create(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.api, data, {
      headers: this.authHeaders(),
    });
  }
  update(id: string, data: any): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, data, {
      headers: this.authHeaders(),
    });
  }
  addImages(id: string, fd: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.api}/${id}/images`, fd, {
      headers: this.authHeaders(),
    });
  }
  deleteImage(productId: string, imageId: string): Observable<Product> {
    return this.http.delete<Product>(
      `${this.api}/${productId}/images/${imageId}`,
      { headers: this.authHeaders() },
    );
  }
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
