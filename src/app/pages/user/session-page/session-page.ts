import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService, SessionSummaryResponse, SessionDetailResponse } from '../../../core/services/session.service';

@Component({
  selector: 'app-session-page',
  standalone: false,
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
})
export class SessionPage implements OnInit {
  sessions: SessionSummaryResponse[] = [];
  isLoading = true;

  constructor(
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchSessions();
  }

  fetchSessions(): void {
    this.isLoading = true;
    this.sessionService.getMySessions().subscribe({
      next: (res) => {
        if (res.success) {
          this.sessions = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/user/session', id]);
  }
}
