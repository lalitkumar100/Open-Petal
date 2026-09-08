import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

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
  
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(this.firstName) || !nameRegex.test(this.lastName)) {
      this.errorMessage = 'Name must not contain numbers or special characters';
      return;
    }

    if (!this.dob) {
      this.errorMessage = 'Date of birth is required';
      return;
    }
    const dobDate = new Date(this.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 18) {
      this.errorMessage = 'You must be at least 18 years old to register';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage = 'Password must be more than 8 characters, including number, lowercase letter, uppercase letter';
      return;
    }

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

    const url = '/auth/register';
    this.http.post<any>(url, payload).subscribe({
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
        if (err.status === 0) {
          this.errorMessage = 'Server is unreachable. Please try again later.';
        } else {
          this.errorMessage = err.error?.message || 'An error occurred during registration.';
        }
      }
    });
  }
}
