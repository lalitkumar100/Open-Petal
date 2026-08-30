```markdown
### Task: Implement Auth Module with 3 Distinct Pages, Split Carousel Layout, and Layered Architecture

Build a modular, non-standalone Angular authentication feature structured across clean layers (`pages/`, `components/`, `services/`, and `models/`). 

The implementation consists of **3 distinct routed pages**:
1. `LoginPage` (`/auth/login`)
2. `RegisterPage` (`/auth/register`)
3. `ForgotPasswordPage` (`/auth/forgot-password`)

All 3 pages share the same responsive **Split-Screen Layout**:
- **Left Half (50% Width):** Animated cross-fade image carousel cycling slides automatically every **5 seconds (5000ms)**.
- **Right Half (50% Width):** Scrollable container rendering the top website logo header (`Open Petal` with rotating petal icon) above the dedicated form component.

The UI must use **DaisyUI** components, **Angular Material Icons** (`<mat-icon>`), and the **Modern Tech Ocean** theme.

---

### 1. File & Folder Architecture

```text
src/app/
├── core/
│   ├── models/
│   │   └── auth.model.ts                  # Auth request/response DTOs
│   └── services/
│       └── auth.service.ts                # HTTP calls to Spring Boot Auth API
└── features/
    └── auth/
        ├── auth-routing.module.ts         # Routes for /login, /register, /forgot-password
        ├── auth.module.ts                 # Declares pages and components
        ├── components/
        │   ├── auth-carousel/             # 5-second automatic image slider
        │   │   ├── auth-carousel.component.ts
        │   │   └── auth-carousel.component.html
        │   ├── auth-header/               # Reusable logo + animated petal + title
        │   │   ├── auth-header.component.ts
        │   │   └── auth-header.component.html
        │   ├── login-form/                # Standalone Login form component
        │   │   ├── login-form.component.ts
        │   │   └── login-form.component.html
        │   ├── register-form/             # Standalone Register form component
        │   │   ├── register-form.component.ts
        │   │   └── register-form.component.html
        │   └── forgot-password-form/      # Standalone Forgot Password form component
        │       ├── forgot-password-form.component.ts
        │       └── forgot-password-form.component.html
        └── pages/
            ├── login-page/                # Shell pairing Carousel + LoginForm
            │   ├── login-page.component.ts
            │   └── login-page.component.html
            ├── register-page/             # Shell pairing Carousel + RegisterForm
            │   ├── register-page.component.ts
            │   └── register-page.component.html
            └── forgot-password-page/      # Shell pairing Carousel + ForgotPasswordForm
                ├── forgot-password-page.component.ts
                └── forgot-password-page.component.html

```

---

### 2. Code Implementation

#### A. Models (`src/app/core/models/auth.model.ts`)

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    userId: number;
    email: string;
    fullName: string;
    role: string;
    status: string;
  };
}

```

---

#### B. Service (`src/app/core/services/auth.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload);
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, payload);
  }
}

```

---

#### C. Left Carousel Component (`src/app/features/auth/components/auth-carousel/`)

**`auth-carousel.component.ts`**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-auth-carousel',
  templateUrl: './auth-carousel.component.html'
})
export class AuthCarouselComponent implements OnInit, OnDestroy {
  slides: CarouselSlide[] = [
    {
      image: '[https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80)',
      title: 'Exchange Real-World Skills',
      subtitle: 'Connect with mentors and learners across global tech domains.'
    },
    {
      image: '[https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80)',
      title: 'Learn By Collaborating',
      subtitle: 'Teach what you know, master what you need with session credits.'
    },
    {
      image: '[https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80)',
      title: 'Accelerate Your Growth',
      subtitle: 'Join thousands of developers leveling up their careers every day.'
    }
  ];

  currentIndex: number = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 5000);
  }

  setSlide(index: number): void {
    this.currentIndex = index;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

```

**`auth-carousel.component.html`**

```html
<div class="relative w-full h-full min-h-screen bg-slate-900 overflow-hidden flex items-end p-12">
  <!-- Dynamic Background Images with Smooth Cross-Fade -->
  <div *ngFor="let slide of slides; let i = index" 
       class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
       [ngClass]="currentIndex === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'"
       [style.backgroundImage]="'url(' + slide.image + ')'">
    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
  </div>

  <!-- Slide Text & Indicators -->
  <div class="relative z-10 max-w-lg text-white">
    <h2 class="text-3xl font-bold tracking-tight mb-2">{{ slides[currentIndex].title }}</h2>
    <p class="text-slate-300 text-sm leading-relaxed mb-6">{{ slides[currentIndex].subtitle }}</p>

    <div class="flex items-center gap-2">
      <button *ngFor="let slide of slides; let i = index"
              (click)="setSlide(i)"
              class="h-1.5 rounded-full transition-all duration-300"
              [ngClass]="currentIndex === i ? 'w-8 bg-[#22c1d6]' : 'w-2 bg-white/40 hover:bg-white/70'">
      </button>
    </div>
  </div>
</div>

```

---

#### D. Universal Brand Header (`src/app/features/auth/components/auth-header/`)

**`auth-header.component.ts`**

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  template: `
    <div class="flex flex-col items-center text-center mb-8">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-8 h-8 animate-spin text-[#0e8ca5]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
        </svg>
        <span class="text-2xl font-bold text-slate-900 tracking-tight">pen Petal</span>
      </div>
      <h1 class="text-xl font-bold text-slate-800">{{ title }}</h1>
      <p class="text-xs text-slate-500 mt-1">{{ subtitle }}</p>
    </div>
  `
})
export class AuthHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}

```

---

#### E. Form Components

##### 1. Login Form (`src/app/features/auth/components/login-form/`)

**`login-form.component.ts`**

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('auth_token', res.data.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password';
      }
    });
  }
}

```

**`login-form.component.html`**

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
  <div *ngIf="errorMessage" class="alert alert-error text-xs py-2">
    <span>{{ errorMessage }}</span>
  </div>

  <!-- Email Input -->
  <div class="form-control">
    <label class="label"><span class="label-text font-medium text-slate-700">Email Address</span></label>
    <div class="relative flex items-center">
      <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">email</mat-icon>
      <input type="email" formControlName="email" placeholder="name@company.com" 
             class="input input-bordered w-full pl-10 focus:border-[#0e8ca5]" />
    </div>
    <span *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-error text-xs mt-1">
      Valid email is required
    </span>
  </div>

  <!-- Password Input -->
  <div class="form-control">
    <label class="label"><span class="label-text font-medium text-slate-700">Password</span></label>
    <div class="relative flex items-center">
      <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">lock</mat-icon>
      <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" 
             class="input input-bordered w-full pl-10 pr-10 focus:border-[#0e8ca5]" />
      <button type="button" (click)="showPassword = !showPassword" class="absolute right-3 text-slate-400">
        <mat-icon class="!text-xl !w-5 !h-5">{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
    </div>
  </div>

  <!-- Remember & Forgot -->
  <div class="flex items-center justify-between text-xs">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" formControlName="rememberMe" class="checkbox checkbox-xs checkbox-primary" />
      <span class="text-slate-600">Remember me</span>
    </label>
    <a routerLink="/auth/forgot-password" class="text-[#0e8ca5] font-semibold hover:underline">Forgot password?</a>
  </div>

  <!-- Submit CTA -->
  <button type="submit" [disabled]="loginForm.invalid || isLoading" 
          class="btn bg-[#0e8ca5] hover:bg-[#0a6e82] text-white w-full shadow-md mt-2">
    <span *ngIf="isLoading" class="loading loading-spinner loading-xs"></span>
    <mat-icon *ngIf="!isLoading">login</mat-icon> Sign In
  </button>

  <p class="text-center text-xs text-slate-500 mt-4">
    Don't have an account? 
    <a routerLink="/auth/register" class="text-[#0e8ca5] font-semibold hover:underline">Create an account</a>
  </p>
</form>

```

---

##### 2. Register Form (`src/app/features/auth/components/register-form/`)

**`register-form.component.ts`**

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html'
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirm = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const pwd = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}

```

**`register-form.component.html`**

```html
<form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
  <div *ngIf="errorMessage" class="alert alert-error text-xs py-2">
    <span>{{ errorMessage }}</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <!-- First Name -->
    <div class="form-control">
      <label class="label"><span class="label-text font-medium text-slate-700">First Name</span></label>
      <div class="relative flex items-center">
        <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">person</mat-icon>
        <input type="text" formControlName="firstName" placeholder="Alex" 
               class="input input-bordered w-full pl-10" />
      </div>
    </div>

    <!-- Last Name -->
    <div class="form-control">
      <label class="label"><span class="label-text font-medium text-slate-700">Last Name</span></label>
      <div class="relative flex items-center">
        <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">person_outline</mat-icon>
        <input type="text" formControlName="lastName" placeholder="Rivera" 
               class="input input-bordered w-full pl-10" />
      </div>
    </div>
  </div>

  <!-- Email -->
  <div class="form-control">
    <label class="label"><span class="label-text font-medium text-slate-700">Email Address</span></label>
    <div class="relative flex items-center">
      <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">email</mat-icon>
      <input type="email" formControlName="email" placeholder="alex@example.com" 
             class="input input-bordered w-full pl-10" />
    </div>
  </div>

  <!-- Date of Birth -->
  <div class="form-control">
    <label class="label"><span class="label-text font-medium text-slate-700">Date of Birth</span></label>
    <div class="relative flex items-center">
      <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">calendar_today</mat-icon>
      <input type="date" formControlName="dob" class="input input-bordered w-full pl-10" />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <!-- Password -->
    <div class="form-control">
      <label class="label"><span class="label-text font-medium text-slate-700">Password</span></label>
      <div class="relative flex items-center">
        <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">lock</mat-icon>
        <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" 
               class="input input-bordered w-full pl-10 pr-10" />
        <button type="button" (click)="showPassword = !showPassword" class="absolute right-3 text-slate-400">
          <mat-icon class="!text-xl !w-5 !h-5">{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </div>
    </div>

    <!-- Confirm Password -->
    <div class="form-control">
      <label class="label"><span class="label-text font-medium text-slate-700">Confirm</span></label>
      <div class="relative flex items-center">
        <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">lock_reset</mat-icon>
        <input [type]="showConfirm ? 'text' : 'password'" formControlName="confirmPassword" placeholder="••••••••" 
               class="input input-bordered w-full pl-10 pr-10" />
        <button type="button" (click)="showConfirm = !showConfirm" class="absolute right-3 text-slate-400">
          <mat-icon class="!text-xl !w-5 !h-5">{{ showConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </div>
    </div>
  </div>
  <span *ngIf="registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched" class="text-error text-xs">
    Passwords do not match
  </span>

  <!-- Submit CTA -->
  <button type="submit" [disabled]="registerForm.invalid || isLoading" 
          class="btn bg-[#0e8ca5] hover:bg-[#0a6e82] text-white w-full shadow-md mt-4">
    <span *ngIf="isLoading" class="loading loading-spinner loading-xs"></span>
    <mat-icon *ngIf="!isLoading">person_add</mat-icon> Create Account
  </button>

  <p class="text-center text-xs text-slate-500 mt-4">
    Already registered? 
    <a routerLink="/auth/login" class="text-[#0e8ca5] font-semibold hover:underline">Sign In</a>
  </p>
</form>

```

---

##### 3. Forgot Password Form (`src/app/features/auth/components/forgot-password-form/`)

**`forgot-password-form.component.ts`**

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html'
})
export class ForgotPasswordFormComponent {
  forgotForm: FormGroup;
  isLoading = false;
  isSent = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;
    this.isLoading = true;

    this.authService.forgotPassword(this.forgotForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSent = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send reset link';
      }
    });
  }
}

```

**`forgot-password-form.component.html`**

```html
<div *ngIf="isSent" class="text-center space-y-4">
  <div class="w-12 h-12 rounded-full bg-teal-50 text-[#0e8ca5] flex items-center justify-center mx-auto">
    <mat-icon class="!text-2xl !w-6 !h-6">mark_email_read</mat-icon>
  </div>
  <h3 class="text-lg font-bold text-slate-800">Check your email</h3>
  <p class="text-xs text-slate-500">We have dispatched password reset instructions to your inbox.</p>
  <a routerLink="/auth/login" class="btn btn-outline btn-sm w-full border-slate-300 text-slate-600">Back to Login</a>
</div>

<form *ngIf="!isSent" [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
  <div *ngIf="errorMessage" class="alert alert-error text-xs py-2">
    <span>{{ errorMessage }}</span>
  </div>

  <div class="form-control">
    <label class="label"><span class="label-text font-medium text-slate-700">Account Email</span></label>
    <div class="relative flex items-center">
      <mat-icon class="absolute left-3 text-slate-400 !text-xl !w-5 !h-5">mail</mat-icon>
      <input type="email" formControlName="email" placeholder="name@company.com" 
             class="input input-bordered w-full pl-10" />
    </div>
  </div>

  <button type="submit" [disabled]="forgotForm.invalid || isLoading" 
          class="btn bg-[#0e8ca5] hover:bg-[#0a6e82] text-white w-full shadow-md mt-2">
    <span *ngIf="isLoading" class="loading loading-spinner loading-xs"></span>
    <mat-icon *ngIf="!isLoading">send</mat-icon> Send Reset Link
  </button>

  <div class="text-center mt-4">
    <a routerLink="/auth/login" class="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
      <mat-icon class="!text-sm !w-4 !h-4">arrow_back</mat-icon> Back to Sign In
    </a>
  </div>
</form>

```

---

#### F. The 3 Dedicated Pages

##### 1. Login Page (`src/app/features/auth/pages/login-page/`)

* **`login-page.component.ts`**: Standard `@Component` with `templateUrl: './login-page.component.html'`.
* **`login-page.component.html`**:

```html
<div class="flex w-full min-h-screen overflow-hidden bg-[#f8fafb]">
  <!-- Left Half: Carousel (50%) -->
  <div class="hidden lg:flex lg:w-1/2 h-screen sticky top-0">
    <app-auth-carousel></app-auth-carousel>
  </div>

  <!-- Right Half: Scrollable Form Viewport (50%) -->
  <div class="w-full lg:w-1/2 h-screen overflow-y-auto px-6 py-12 flex flex-col items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <app-auth-header title="Welcome back" subtitle="Please enter your credentials to access your account"></app-auth-header>
      <app-login-form></app-login-form>
    </div>
  </div>
</div>

```

##### 2. Register Page (`src/app/features/auth/pages/register-page/`)

* **`register-page.component.ts`**: Standard `@Component` with `templateUrl: './register-page.component.html'`.
* **`register-page.component.html`**:

```html
<div class="flex w-full min-h-screen overflow-hidden bg-[#f8fafb]">
  <!-- Left Half: Carousel (50%) -->
  <div class="hidden lg:flex lg:w-1/2 h-screen sticky top-0">
    <app-auth-carousel></app-auth-carousel>
  </div>

  <!-- Right Half: Scrollable Form Viewport (50%) -->
  <div class="w-full lg:w-1/2 h-screen overflow-y-auto px-6 py-12 flex flex-col items-center justify-center">
    <div class="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <app-auth-header title="Create an account" subtitle="Join Open Petal to exchange skills and connect with mentors"></app-auth-header>
      <app-register-form></app-register-form>
    </div>
  </div>
</div>

```

##### 3. Forgot Password Page (`src/app/features/auth/pages/forgot-password-page/`)

* **`forgot-password-page.component.ts`**: Standard `@Component` with `templateUrl: './forgot-password-page.component.html'`.
* **`forgot-password-page.component.html`**:

```html
<div class="flex w-full min-h-screen overflow-hidden bg-[#f8fafb]">
  <!-- Left Half: Carousel (50%) -->
  <div class="hidden lg:flex lg:w-1/2 h-screen sticky top-0">
    <app-auth-carousel></app-auth-carousel>
  </div>

  <!-- Right Half: Scrollable Form Viewport (50%) -->
  <div class="w-full lg:w-1/2 h-screen overflow-y-auto px-6 py-12 flex flex-col items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <app-auth-header title="Reset credentials" subtitle="Enter your email to receive recovery instructions"></app-auth-header>
      <app-forgot-password-form></app-forgot-password-form>
    </div>
  </div>
</div>

```

---

#### G. Module & Routing Setup

##### `auth-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

```

##### `auth.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthCarouselComponent } from './components/auth-carousel/auth-carousel.component';
import { AuthHeaderComponent } from './components/auth-header/auth-header.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';

@NgModule({
  declarations: [
    AuthCarouselComponent,
    AuthHeaderComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ForgotPasswordFormComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPasswordPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}

```

```

```