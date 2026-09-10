import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService, SessionDetailResponse } from '../../../core/services/session.service';

@Component({
  selector: 'app-session-details-page',
  standalone: false,
  templateUrl: './session-details-page.html',
  styleUrl: './session-details-page.css'
})
export class SessionDetailsPage implements OnInit, OnDestroy {
  sessionId!: number;
  session: SessionDetailResponse | null = null;
  isLoading = true;
  error = '';

  otpInput = '';
  isOtpLoading = false;
  otpError = '';
  otpSuccess = '';
  myOtpCode = '';

  conflictReason = 'NO_SHOW';
  conflictStory = '';
  isConflictLoading = false;
  conflictError = '';

  showConflictDetails = false;
  conflictDetails: any = null;
  conflictDetailsLoading = false;
  counterStoryInput = '';
  isSubmittingCounterStory = false;
  storySubmitError = '';
  storySubmitSuccess = '';

  isCancelling = false;
  isAccepting = false;
  isDeclining = false;
  cancelError = '';
  cancelSuccess = '';

  private timerInterval: any;
  now = new Date();
  startCountdownStr = '';
  endCountdownStr = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sessionId = +id;
        this.loadSession();
      }
    });

    this.timerInterval = setInterval(() => {
      this.now = new Date();
      this.updateCountdowns();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadSession(): void {
    this.isLoading = true;
    this.sessionService.getSessionDetails(this.sessionId).subscribe({
      next: (res) => {
        if (res.success) {
          this.session = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load session details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isWithin15Minutes(targetDateStr: string, targetTimeStr: string): boolean {
    const target = new Date(`${targetDateStr}T${targetTimeStr}`);
    const diff = Math.abs(this.now.getTime() - target.getTime());
    return diff <= 15 * 60 * 1000;
  }

  updateCountdowns(): void {
    if (!this.session) return;
    this.startCountdownStr = this.getCountdownString(this.session.sessionDate, this.session.startTime);
    this.endCountdownStr = this.getCountdownString(this.session.sessionDate, this.session.endTime);
  }

  getCountdownString(targetDateStr: string, targetTimeStr: string): string {
    const target = new Date(`${targetDateStr}T${targetTimeStr}`);
    const endWindow = new Date(target.getTime() + 15 * 60 * 1000);
    const diff = endWindow.getTime() - this.now.getTime();
    if (diff <= 0 || !this.isWithin15Minutes(targetDateStr, targetTimeStr)) return '';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get isStartWindow(): boolean {
    if (!this.session) return false;
    return this.isWithin15Minutes(this.session.sessionDate, this.session.startTime);
  }

  get isEndWindow(): boolean {
    if (!this.session) return false;
    return this.isWithin15Minutes(this.session.sessionDate, this.session.endTime);
  }

  get canRaiseConflict(): boolean {
    if (!this.session) return false;
    const start = new Date(`${this.session.sessionDate}T${this.session.startTime}`);
    const end = new Date(`${this.session.sessionDate}T${this.session.endTime}`);
    const endWindow = new Date(end.getTime() + 15 * 60 * 1000);
    return this.now >= start && this.now <= endWindow;
  }

  fetchMyOtp(): void {
    if (this.myOtpCode) return; // already fetched
    this.isOtpLoading = true;
    this.otpError = '';
    this.sessionService.getMyOtp(this.sessionId).subscribe({
      next: (res) => {
        if (res.success) {
          this.myOtpCode = res.data;
        }
        this.isOtpLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.otpError = err.error?.message || 'Failed to fetch OTP.';
        this.isOtpLoading = false;
        this.cdr.detectChanges();
      }
    });
  }



  verifyStartOtp(): void {
    if (!this.otpInput) return;
    this.isOtpLoading = true;
    this.otpError = '';
    this.otpSuccess = '';
    this.sessionService.verifyStart(this.sessionId, this.otpInput).subscribe({
      next: (res) => {
        this.otpInput = '';
        this.otpSuccess = 'Start OTP Verified Successfully!';
        this.loadSession(); // reload to get new flags/status
      },
      error: (err) => {
        this.otpError = err.error?.message || 'Invalid OTP.';
        this.isOtpLoading = false;
        this.cdr.detectChanges();
      }
    });
  }



  verifyEndOtp(): void {
    if (!this.otpInput) return;
    this.isOtpLoading = true;
    this.otpError = '';
    this.otpSuccess = '';
    this.sessionService.verifyEnd(this.sessionId, this.otpInput).subscribe({
      next: (res) => {
        this.otpInput = '';
        this.otpSuccess = 'End OTP Verified Successfully!';
        this.loadSession();
      },
      error: (err) => {
        this.otpError = err.error?.message || 'Invalid OTP.';
        this.isOtpLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  raiseConflict(): void {
    if (!this.conflictStory.trim()) return;
    this.isConflictLoading = true;
    this.conflictError = '';
    this.sessionService.raiseConflict(this.sessionId, { reason: this.conflictReason, story: this.conflictStory }).subscribe({
      next: (res) => {
        const modal = document.getElementById('conflict_modal') as HTMLDialogElement;
        if (modal) modal.close();
        this.isConflictLoading = false;
        this.conflictStory = '';
        this.loadSession();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.conflictError = err.error?.message || 'Failed to raise conflict.';
        this.isConflictLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleConflictDetails(): void {
    if (!this.conflictDetails && !this.showConflictDetails) {
      this.conflictDetailsLoading = true;
      this.sessionService.getSessionConflict(this.sessionId).subscribe({
        next: (res) => {
          if (res.success) {
            this.conflictDetails = res.data;
          }
          this.conflictDetailsLoading = false;
          this.showConflictDetails = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.conflictDetailsLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.showConflictDetails = !this.showConflictDetails;
    }
  }

  submitCounterStory(): void {
    if (!this.counterStoryInput.trim()) return;
    this.isSubmittingCounterStory = true;
    this.storySubmitError = '';
    this.storySubmitSuccess = '';
    this.sessionService.submitConflictStory(this.sessionId, this.counterStoryInput).subscribe({
      next: (res) => {
        if (res.success) {
          this.storySubmitSuccess = 'Statement submitted successfully.';
          this.counterStoryInput = '';
          // Reload conflict details
          this.conflictDetails = null;
          this.showConflictDetails = false;
          this.toggleConflictDetails();
        }
        this.isSubmittingCounterStory = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.storySubmitError = err.error?.message || 'Failed to submit statement.';
        this.isSubmittingCounterStory = false;
        this.cdr.detectChanges();
      }
    });
  }

  get canSubmitCounterStory(): boolean {
    if (!this.conflictDetails || this.conflictDetails.status !== 'OPEN') return false;
    const isLearner = this.session?.role === 'LEARNER';
    const hasStory = isLearner 
      ? !!this.conflictDetails.learnerStory 
      : !!this.conflictDetails.mentorStory;
    return !hasStory;
  }

  get amIVerifiedStart(): boolean {
    if (!this.session) return false;
    return this.session.isMentor ? this.session.mentorVerifiedStart : this.session.learnerVerifiedStart;
  }
  
  get partnerVerifiedStart(): boolean {
    if (!this.session) return false;
    return this.session.isMentor ? this.session.learnerVerifiedStart : this.session.mentorVerifiedStart;
  }

  get amIVerifiedEnd(): boolean {
    if (!this.session) return false;
    return this.session.isMentor ? this.session.mentorVerifiedEnd : this.session.learnerVerifiedEnd;
  }
  
  get partnerVerifiedEnd(): boolean {
    if (!this.session) return false;
    return this.session.isMentor ? this.session.learnerVerifiedEnd : this.session.mentorVerifiedEnd;
  }

  onAcceptSession(): void {
    this.isAccepting = true;
    this.cancelError = '';
    this.cancelSuccess = '';

    this.sessionService.acceptSession(this.sessionId).subscribe({
      next: (res) => {
        this.isAccepting = false;
        if (res.success) {
          this.cancelSuccess = 'Session accepted successfully.';
          this.loadSession();
        }
      },
      error: (err) => {
        this.isAccepting = false;
        this.cancelError = err.error?.message || 'Failed to accept session.';
        this.cdr.detectChanges();
      }
    });
  }

  onDeclineSession(): void {
    this.isDeclining = true;
    this.cancelError = '';
    this.cancelSuccess = '';

    this.sessionService.declineSession(this.sessionId).subscribe({
      next: (res) => {
        this.isDeclining = false;
        if (res.success) {
          this.cancelSuccess = 'Session declined successfully.';
          this.loadSession();
        }
      },
      error: (err) => {
        this.isDeclining = false;
        this.cancelError = err.error?.message || 'Failed to decline session.';
        this.cdr.detectChanges();
      }
    });
  }

  onCancelSession(): void {
    this.isCancelling = true;
    this.cancelError = '';
    this.cancelSuccess = '';

    this.sessionService.cancelSession(this.sessionId).subscribe({
      next: (res) => {
        this.isCancelling = false;
        if (res.success) {
          this.cancelSuccess = 'Session cancelled successfully.';
          this.loadSession();
        }
      },
      error: (err) => {
        this.isCancelling = false;
        this.cancelError = err.error?.message || 'Failed to cancel session.';
        this.cdr.detectChanges();
      }
    });
  }
  submitFeedbackRating: number = 0;
  isSubmittingFeedback: boolean = false;
  feedbackError: string = '';
  feedbackSuccess: string = '';

  get canLeaveFeedback(): boolean {
    if (!this.session || this.session.status !== 'ENDED') return false;
    if (this.session.myRating !== null && this.session.myRating !== undefined) return false;
    if (this.session.sessionType === 'CREDIT' && this.session.role === 'MENTOR') return false;
    return true;
  }

  setRating(val: number) {
    this.submitFeedbackRating = val;
  }

  submitFeedback(): void {
    if (this.submitFeedbackRating < 1 || this.submitFeedbackRating > 5) return;
    this.isSubmittingFeedback = true;
    this.feedbackError = '';
    this.feedbackSuccess = '';
    
    this.sessionService.submitFeedback(this.sessionId, this.submitFeedbackRating).subscribe({
      next: (res) => {
        this.isSubmittingFeedback = false;
        if (res.success) {
          this.feedbackSuccess = 'Feedback submitted successfully.';
          this.loadSession(); // refresh to get myRating
          const modal = document.getElementById('feedback_modal') as HTMLDialogElement;
          if (modal) modal.close();
        }
      },
      error: (err) => {
        this.isSubmittingFeedback = false;
        this.feedbackError = err.error?.message || 'Failed to submit feedback.';
        this.cdr.detectChanges();
      }
    });
  }
}
