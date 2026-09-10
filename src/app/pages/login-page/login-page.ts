import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  constructor(private cdr: ChangeDetectorRef) {}
}
