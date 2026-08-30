import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { LoginRequest, LoginResponse, UserData } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_profile';

  login(credentials: LoginRequest, rememberMe: boolean): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/${environment.apiVersion}/auth/login`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap((res) => {
        if (res && res.data) {
          this.storage.setItem(this.TOKEN_KEY, res.data.token, rememberMe);
          const userProfile = {
            userId: res.data.userId,
            email: res.data.email,
            fullName: res.data.fullName,
            role: res.data.role,
            status: res.data.status
          };
          this.storage.setItem(this.USER_KEY, userProfile, rememberMe);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    const url = `${environment.apiUrl}/${environment.apiVersion}/auth/register`;
    return this.http.post<any>(url, data);
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${environment.apiUrl}/${environment.apiVersion}/auth/forgot-password`;
    return this.http.post<any>(url, { email });
  }

  redirectByRole(role?: string): void {
    const currentRole = role || this.getRole();
    if (currentRole === 'ROLE_ADMIN' || currentRole?.includes('ADMIN')) {
      this.router.navigate(['/admin/home']);
    } else {
      this.router.navigate(['/user/home']);
    }
  }

  getToken(): string | null {
    return this.storage.getItem<string>(this.TOKEN_KEY);
  }

  getUser(): Partial<UserData> | null {
    return this.storage.getItem<Partial<UserData>>(this.USER_KEY);
  }

  getRole(): string | undefined {
    return this.getUser()?.role;
  }

  logout(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }
}
