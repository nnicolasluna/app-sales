import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { LoginCredentials, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private currentUserSignal = signal<User | null>(this.getInitialUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setSession(response);
        }),
        catchError(this.handleError),
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUserSignal.set(authResult.user);
  }

  private getInitialUser(): User | null {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser) as User;
    } catch {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error.status === 401 || error.status === 422) {
      errorMessage =
        error.error?.message || 'Credenciales o datos incorrectos.';
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor Backend.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
