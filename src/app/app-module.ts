import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { FormsModule } from '@angular/forms';

import { App } from './app';
import { RegisterPage } from './pages/register-page/register-page';
import { RegisterForm } from './components/register-form/register-form';
import { LoginPage } from './pages/login-page/login-page';
import { LoginForm } from './components/login-form/login-form';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { ForgotPasswordForm } from './components/forgot-password-form/forgot-password-form';
import { MainLayout } from './main-layout/main-layout';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { BreadcrumbComponent } from './components/breadcrumb-component/breadcrumb-component';
import { MainAreaComponent } from './components/main-area-component/main-area-component';
import { UniversalCarousel } from './components/universal-carousel/universal-carousel';
import { ProfilePage } from './pages/profile-page/profile-page';
import { LoaderComponent } from './components/loader/loader';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { AdminHomePage } from './pages/admin-home-page/admin-home-page';
import { UserHomePage } from './pages/user-home-page/user-home-page';

@NgModule({
  declarations: [
    App,
    RegisterPage,
    RegisterForm,
    LoginPage,
    LoginForm,
    ForgotPasswordPage,
    ForgotPasswordForm,
    MainLayout,
    SidebarComponent,
    BreadcrumbComponent,
    MainAreaComponent,
    UniversalCarousel,
    ProfilePage,
    LoaderComponent,
    NotFoundPage,
    AdminHomePage,
    UserHomePage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }