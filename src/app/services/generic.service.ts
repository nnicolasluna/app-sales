import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService<T> {
  protected http = inject(HttpClient);
  private readonly url: string;

  constructor(resource: string) {
    this.url = `${environment.apiUrl}/${resource}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }
  create(data: T): Observable<T> {
    return this.http.post<T>(this.url, data);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
