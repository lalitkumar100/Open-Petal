import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  constructor(private cdr: ChangeDetectorRef) {}
}
