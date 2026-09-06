import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  email = '';
  password = '';
  rememberMe = false;
  
  errorMessage = '';
  isLoading = false;

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) return;
    
    this.isLoading = true;
    const url = `${environment.apiUrl}/${environment.apiVersion}/auth/login`;
    this.http.post<any>(url, { email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.storage.setItem('auth_token', res.data.token, this.rememberMe);
            const userProfile = {
              userId: res.data.userId,
              email: res.data.email,
              fullName: res.data.fullName,
              role: res.data.role,
              status: res.data.status
            };
            this.storage.setItem('user_profile', userProfile, this.rememberMe);
            
            this.authService.redirectByRole(res.data.role);
          } else {
            this.errorMessage = res.message || 'Login failed.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 0) {
            this.errorMessage = 'Server is unreachable. Please try again later.';
          } else {
            this.errorMessage = err.error?.message || 'An error occurred during login.';
          }
        }
      });
  }
}
