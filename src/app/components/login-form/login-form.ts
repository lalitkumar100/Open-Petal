import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  email = '';
  password = '';
  rememberMe = false;
  
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) return;
    
    this.isLoading = true;
    const url = '/auth/login';
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
            
            const currentRole = res.data.role;
            if (currentRole === 'ROLE_ADMIN' || currentRole?.includes('ADMIN')) {
              this.router.navigate(['/admin/home']);
            } else {
              this.router.navigate(['/user/home']);
            }
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
