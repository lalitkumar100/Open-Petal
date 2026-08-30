import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password-form',
  standalone: false,
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.css',
})
export class ForgotPasswordForm {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isSuccess = false;

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email) return;

    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.isSuccess = true;
          this.successMessage = res.message || 'Password reset email sent';
          this.email = '';
        } else {
          this.errorMessage = res.message || 'Failed to send reset email';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'An error occurred';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
