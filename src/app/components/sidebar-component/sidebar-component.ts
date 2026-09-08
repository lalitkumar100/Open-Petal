import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-component',
  standalone: false,
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  constructor(private router: Router) {}

  unreadCount: number = 0;
  private unreadSub?: Subscription;

  ngOnInit() {
    if (!this.isAdmin) {
        this.unreadSub = this.chatService.unreadCount$.subscribe(count => {
            this.unreadCount = count;
        });
        this.chatService.startUnreadPolling(30000);
    }
  }

  ngOnDestroy() {
    if (this.unreadSub) {
        this.unreadSub.unsubscribe();
    }
  }

  get basePath(): string {
    return this.router.url.startsWith('/admin') ? '/admin' : '/user';
  }

  get isAdmin(): boolean {
    return this.router.url.startsWith('/admin');
  }

  adminMenuItems = [
    { label: 'Skill Management', icon: 'model_training', path: '/admin/skill-management' },
    { label: 'Support & Conflicts', icon: 'question_answer', path: '/admin/queries' },
    { label: 'User', icon: 'group', path: '/admin/user' },
    { label: 'Session', icon: 'history', path: '/admin/session' },
    { label: 'Locations', icon: 'location_on', path: '/admin/locations' },
    { label: 'Setting', icon: 'settings', path: '/admin/setting' }
  ];

  userMenuItems = [
    { label: 'My Queries', icon: 'chat', path: '/user/my-queries' },
    { label: 'Skill', icon: 'psychology', path: '/user/skill' },
    { label: 'Search', icon: 'search', path: '/user/search' },
    { label: 'Session', icon: 'update', path: '/user/session' },
    { label: 'Inbox', icon: 'inbox', path: '/user/inbox' }
  ];

  get currentMenuItems() {
    return this.isAdmin ? this.adminMenuItems : this.userMenuItems;
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
