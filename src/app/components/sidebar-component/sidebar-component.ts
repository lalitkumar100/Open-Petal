import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-component',
  standalone: false,
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);
  constructor(private router: Router) {}

  get basePath(): string {
    return this.router.url.startsWith('/admin') ? '/admin' : '/user';
  }

  get userProfile(): any {
    return this.authService.getUser() || { fullName: 'User', email: '', role: 'USER' };
  }

  get userInitials(): string {
    const name = this.userProfile.fullName || 'User';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'U').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
