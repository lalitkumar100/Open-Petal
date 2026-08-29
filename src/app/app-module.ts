import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { RouterModule } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { BreadcrumbComponent } from './components/breadcrumb-component/breadcrumb-component';
import { App } from './app';
import { MainAreaComponent } from './components/main-area-component/main-area-component';

@NgModule({
  declarations: [
    App,
    MainLayout,
    SidebarComponent,
    BreadcrumbComponent,
    MainAreaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App],
})
export class AppModule {}
