import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { LucideAngularModule } from 'lucide-angular';
import { MatIconModule } from '@angular/material/icon';

// Import Angular Material Button Module


import { App } from './app';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LucideAngularModule,
    MatIconModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    
  ],
  bootstrap: [App]
})
export class AppModule { }