import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedProductResponse, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private baseUrl = 'http://localhost:3000/api/products';

    constructor(private http: HttpClient) { }

    getAll(params = {}) {
        return this.http.get<PaginatedProductResponse>(this.baseUrl, { params });
    }

    getById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    create(formData: FormData): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, formData);
    }

    update(id: string, formData: FormData): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, formData);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
