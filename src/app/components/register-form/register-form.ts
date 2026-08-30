import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private authService = inject(AuthService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  dob = '';
  password = '';
  confirmPassword = '';
  termsAgreed = false;

  errorMessage = '';
  isLoading = false;
  successMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.termsAgreed) {
      this.errorMessage = 'You must agree to the Terms & Conditions';
      return;
    }

    this.isLoading = true;
    
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      dob: this.dob
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = (res.message || 'Registration successful') + '! Redirecting to login in 5 seconds...';
          
          // Clear all input fields
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.dob = '';
          this.password = '';
          this.confirmPassword = '';
          this.termsAgreed = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        } else {
          this.errorMessage = res.message || 'Registration failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'An error occurred during registration.';
      }
    });
  }
}
