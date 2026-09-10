import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatPanelComponent } from './components/chat-panel/chat-panel.component';

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
import { AdminHomePage } from './pages/admin/admin-home-page/admin-home-page';
import { UserHomePage } from './pages/user/user-home-page/user-home-page';
import { SkillManagementPage } from './pages/admin/skill-management-page/skill-management-page';
import { SkillCategoryPage } from './pages/admin/skill-category-page/skill-category-page';
import { SkillCategoryDetailsPage } from './pages/admin/skill-category-details-page/skill-category-details-page';
import { AddSkillCategoryDialog } from './components/add-skill-category-dialog/add-skill-category-dialog';
import { AddSkillDialog } from './components/add-skill-dialog/add-skill-dialog';
import { UserPage } from './pages/admin/user-page/user-page';
import { AdminUserDetailsPage } from './pages/admin/user-details-page/user-details-page';
import { SessionPage as AdminSessionPage } from './pages/admin/session-page/session-page';
import { AdminConflictsPage } from './pages/admin/admin-conflicts-page/admin-conflicts-page';
import { AdminConflictDetailsPage } from './pages/admin/admin-conflict-details-page/admin-conflict-details-page';
import { SettingPage } from './pages/admin/setting-page/setting-page';
import { SessionPage as UserSessionPage } from './pages/user/session-page/session-page';
import { SessionDetailsPage } from './pages/user/session-details-page/session-details-page';
import { UserConflictsPage } from './pages/user/user-conflicts-page/user-conflicts-page';
import { MyQueriesPage } from './pages/user/my-queries-page/my-queries-page';
import { SkillPage } from './pages/user/skill-page/skill-page';
import { SearchPage } from './pages/user/search-page/search-page';
import { InboxPage } from './pages/user/inbox-page/inbox-page';
import { AccessDeniedDialog } from './components/access-denied-dialog/access-denied-dialog';
import { UnauthorizedDialog } from './components/unauthorized-dialog/unauthorized-dialog';
import { Locations } from './pages/admin/locations/locations';
import { ServerDownDialog } from './components/server-down-dialog/server-down-dialog';
import { UserDetailsPage as UserSideDetailsPage } from './pages/user/user-details-page/user-details-page';
import { RoadmapDialogComponent } from './components/roadmap-dialog/roadmap-dialog.component';
import { LandingPage } from './pages/landing-page/landing-page';

@NgModule({
  declarations: [
    App,
    LandingPage,
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
    UserHomePage,
    SkillManagementPage,
    SkillCategoryPage,
    SkillCategoryDetailsPage,
    AddSkillCategoryDialog,
    AddSkillDialog,
    UserPage,
    AdminUserDetailsPage,
    AdminSessionPage,
    AdminConflictsPage,
    AdminConflictDetailsPage,
    SettingPage,
    MyQueriesPage,
    SkillPage,
    SearchPage,
    UserSessionPage,
    SessionDetailsPage,
    UserConflictsPage,
    InboxPage,
    AccessDeniedDialog,
    UnauthorizedDialog,
    Locations,
    ServerDownDialog,
    UserSideDetailsPage,
    RoadmapDialogComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, MatIconModule, FormsModule, ReactiveFormsModule, ChatPanelComponent],
  providers: [provideHttpClient(withInterceptors([apiInterceptor])), provideMarkdown()],
  bootstrap: [App],
})
export class AppModule { }
