import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterPage } from './pages/register-page/register-page';
import { MainLayout } from './main-layout/main-layout';
import { AdminUserDetailsPage } from './pages/admin/user-details-page/user-details-page';

import { LoginPage } from './pages/login-page/login-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { AdminHomePage } from './pages/admin/admin-home-page/admin-home-page';
import { UserHomePage } from './pages/user/user-home-page/user-home-page';
import { SkillManagementPage } from './pages/admin/skill-management-page/skill-management-page';
import { SkillCategoryPage } from './pages/admin/skill-category-page/skill-category-page';
import { SkillCategoryDetailsPage } from './pages/admin/skill-category-details-page/skill-category-details-page';
import { UserPage } from './pages/admin/user-page/user-page';
import { SessionPage as AdminSessionPage } from './pages/admin/session-page/session-page';
import { AdminConflictsPage } from './pages/admin/admin-conflicts-page/admin-conflicts-page';
import { AdminConflictDetailsPage } from './pages/admin/admin-conflict-details-page/admin-conflict-details-page';
import { SettingPage } from './pages/admin/setting-page/setting-page';
import { Locations } from './pages/admin/locations/locations';

import { MyQueriesPage } from './pages/user/my-queries-page/my-queries-page';
import { SkillPage } from './pages/user/skill-page/skill-page';
import { SearchPage } from './pages/user/search-page/search-page';
import { SessionPage as UserSessionPage } from './pages/user/session-page/session-page';
import { SessionDetailsPage } from './pages/user/session-details-page/session-details-page';
import { UserConflictsPage } from './pages/user/user-conflicts-page/user-conflicts-page';
import { InboxPage } from './pages/user/inbox-page/inbox-page';
import { UserDetailsPage as UserSideDetailsPage } from './pages/user/user-details-page/user-details-page';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  {
    path: 'admin',
    component: MainLayout,
    children: [
      { path: 'home', component: AdminHomePage },
      { path: 'profile', component: ProfilePage },
      { path: 'skill-management', component: SkillCategoryPage },
      { path: 'skill-categories', component: SkillCategoryPage },
      { path: 'skill-categories/:categoryId/details', component: SkillCategoryDetailsPage },
      { path: 'queries', component: AdminConflictsPage },
      { path: 'user', component: UserPage },
      { path: 'users/:userId/details', component: AdminUserDetailsPage },
      { path: 'session', component: AdminSessionPage },
      { path: 'conflicts', component: AdminConflictsPage },
      { path: 'conflicts/:conflictId/details', component: AdminConflictDetailsPage },
      { path: 'locations', component: Locations },
      { path: 'setting', component: SettingPage }
    ]
  },
  {
    path: 'user',
    component: MainLayout,
    children: [
      { path: 'home', component: UserHomePage },
      { path: 'profile', component: ProfilePage },
      { path: 'my-queries', component: UserConflictsPage },
      { path: 'skill', component: SkillPage },
      { path: 'search', component: SearchPage },
      { path: 'session', component: UserSessionPage },
      { path: 'session/:id', component: SessionDetailsPage },
      { path: 'conflicts', component: UserConflictsPage },
      { path: 'inbox', component: InboxPage },
      { path: 'user-details/:userId', component: UserSideDetailsPage },
    ]
  },
  { path: '**', component: NotFoundPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
