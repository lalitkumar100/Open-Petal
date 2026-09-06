import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminConflictService, AdminConflictDetailResponse, ResolveConflictRequest } from '../../../core/services/admin-conflict.service';

@Component({
  selector: 'app-admin-conflict-details-page',
  standalone: false,
  templateUrl: './admin-conflict-details-page.html'
})
export class AdminConflictDetailsPage implements OnInit {
  conflictId!: number;
  selectedConflict: AdminConflictDetailResponse | null = null;
  isLoadingDetails = true;
  resolveError = '';

  resolutionNotes = '';
  isResolving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminConflictService: AdminConflictService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('conflictId');
      if (id) {
        this.conflictId = +id;
        this.loadConflictDetails();
      } else {
        this.resolveError = 'Invalid conflict ID.';
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadConflictDetails(): void {
    this.isLoadingDetails = true;
    this.resolveError = '';
    
    this.adminConflictService.getConflictDetails(this.conflictId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedConflict = res.data;
        } else {
          this.resolveError = 'Failed to load conflict details.';
        }
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.resolveError = 'Error fetching conflict details.';
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitResolution(action: string): void {
    if (!this.selectedConflict) return;

    if (!this.resolutionNotes || this.resolutionNotes.trim().length === 0) {
      this.resolveError = 'Resolution notes are required.';
      return;
    }

    this.isResolving = true;
    this.resolveError = '';

    const payload: ResolveConflictRequest = {
      resolutionAction: action,
      adminNotes: this.resolutionNotes.trim()
    };

    this.adminConflictService.resolveConflict(this.conflictId, payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Instead of navigating away immediately, let's just reload the conflict details to show it's resolved
          this.resolutionNotes = '';
          this.loadConflictDetails();
        } else {
          this.resolveError = res.message || 'Failed to resolve conflict.';
        }
        this.isResolving = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.resolveError = err.error?.message || 'Failed to resolve conflict.';
        this.isResolving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/conflicts']);
  }
}
