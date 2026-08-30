import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private authService = inject(AuthService);

  email = '';
  password = '';
  rememberMe = false;
  
  errorMessage = '';
  isLoading = false;

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) return;
    
    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }, this.rememberMe)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.authService.redirectByRole(res.data.role);
          } else {
            this.errorMessage = res.message || 'Login failed.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'An error occurred during login.';
        }
      });
  }
}
