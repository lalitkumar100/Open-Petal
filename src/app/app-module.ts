import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { RouterModule } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';

import { MainLayout } from './layouts/main-layout/main-layout';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { BreadcrumbComponent } from './components/breadcrumb-component/breadcrumb-component';
import { App } from './app';
import { MainAreaComponent } from './components/main-area-component/main-area-component';
import { LoaderComponent } from './components/loader/loader';
import { LoginCarousel } from './components/login-carousel/login-carousel';
import { LoginForm } from './components/login-form/login-form';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterForm } from './components/register-form/register-form';
import { RegisterPage } from './pages/register-page/register-page';
import { ForgotPasswordForm } from './components/forgot-password-form/forgot-password-form';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    App,
    MainLayout,
    SidebarComponent,
    BreadcrumbComponent,
    MainAreaComponent,
    LoaderComponent,
    LoginCarousel,
    LoginForm,
    LoginPage,
    RegisterForm,
    RegisterPage,
    ForgotPasswordForm,
    ForgotPasswordPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideAnimationsAsync()],
  bootstrap: [App],
})
export class AppModule {}
