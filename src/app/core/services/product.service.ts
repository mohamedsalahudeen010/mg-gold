import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductsResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

  getAll(page = 1, category = ''): Observable<ProductsResponse> {
    const params: any = { page };
    if (category) params['category'] = category;
    return this.http.get<ProductsResponse>(this.api, { params });
  }

  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  create(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.api, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, data);
  }

  addMedia(id: string, files: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.api}/${id}/media`, files);
  }

  deleteMedia(productId: string, mediaId: string): Observable<Product> {
    return this.http.delete<Product>(
      `${this.api}/${productId}/media/${mediaId}`,
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
