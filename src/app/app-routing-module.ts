import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterPage } from './pages/register-page/register-page';
import { MainLayout } from './main-layout/main-layout';

import { LoginPage } from './pages/login-page/login-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { AdminHomePage } from './pages/admin-home-page/admin-home-page';
import { UserHomePage } from './pages/user-home-page/user-home-page';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { 
    path: 'admin', 
    component: MainLayout,
    children: [
      { path: 'home', component: AdminHomePage },
      { path: 'profile', component: ProfilePage }
    ]
  },
  { 
    path: 'user', 
    component: MainLayout,
    children: [
      { path: 'home', component: UserHomePage },
      { path: 'profile', component: ProfilePage }
    ]
  },
  { path: '**', component: NotFoundPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
