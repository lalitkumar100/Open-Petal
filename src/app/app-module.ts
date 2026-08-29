import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';

// Import Angular Material Button Module
import { MatButtonModule } from '@angular/material/button';

import { App } from './app';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule // <-- Add it here
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    
  ],
  bootstrap: [App]
})
export class AppModule { }