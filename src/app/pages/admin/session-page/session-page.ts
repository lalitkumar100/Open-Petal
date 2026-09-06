import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminSessionService, AdminSessionSummaryResponse, AdminSessionDetailResponse } from '../../../core/services/admin-session.service';

@Component({
  selector: 'app-session-page',
  standalone: false,
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
})
export class SessionPage implements OnInit {
  sessions: AdminSessionSummaryResponse[] = [];
  isLoading = true;

  selectedSession: AdminSessionDetailResponse | null = null;
  isModalOpen = false;
  isDetailsLoading = false;
  isCancelling = false;
  cancelReason = '';
  showCancelConfirm = false;
  cancelError = '';
  cancelSuccess = '';

  constructor(
    private adminSessionService: AdminSessionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    this.adminSessionService.getAllSessions().subscribe({
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
    this.isModalOpen = true;
    this.isDetailsLoading = true;
    this.selectedSession = null;
    this.showCancelConfirm = false;
    this.cancelReason = '';
    this.cancelError = '';
    this.cancelSuccess = '';
    this.cdr.detectChanges();

    this.adminSessionService.getSessionDetails(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedSession = res.data;
        }
        this.isDetailsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isDetailsLoading = false;
        this.cancelError = 'Failed to load session details.';
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    if (this.isCancelling) return;
    this.isModalOpen = false;
    this.selectedSession = null;
    this.showCancelConfirm = false;
    this.cdr.detectChanges();
  }

  initiateCancel(): void {
    this.showCancelConfirm = true;
    this.cancelError = '';
    this.cancelSuccess = '';
  }

  cancelInitiation(): void {
    this.showCancelConfirm = false;
    this.cancelReason = '';
  }

  confirmCancel(): void {
    if (!this.selectedSession) return;
    
    this.isCancelling = true;
    this.cancelError = '';
    this.cancelSuccess = '';

    const reason = this.cancelReason.trim() || 'Cancelled by Administrator';

    this.adminSessionService.cancelSession(this.selectedSession.id, reason).subscribe({
      next: (res) => {
        this.isCancelling = false;
        if (res.success) {
          this.cancelSuccess = 'Session force-cancelled successfully.';
          this.showCancelConfirm = false;
          
          if (this.selectedSession) {
            this.selectedSession.status = 'CANCELLED';
            this.selectedSession.creditsHeld = 0;
          }
          
          const idx = this.sessions.findIndex(s => s.id === this.selectedSession?.id);
          if (idx !== -1) {
            this.sessions[idx].status = 'CANCELLED';
            this.sessions[idx].creditsHeld = 0;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isCancelling = false;
        this.cancelError = err.error?.message || 'Failed to cancel session.';
        this.cdr.detectChanges();
      }
    });
  }
}
