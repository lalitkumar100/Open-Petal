import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage
  },
  {
    path: '',
    component: MainLayout,
    children: [
      // Your future Stitch pages will load here as child routes or components
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }