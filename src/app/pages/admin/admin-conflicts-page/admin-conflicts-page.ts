import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminConflictService, AdminConflictSummaryResponse } from '../../../core/services/admin-conflict.service';
import { AdminQueryService } from '../../../core/services/admin-query.service';
import { UserQuery } from '../../../core/services/query.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-conflicts-page',
  standalone: false,
  templateUrl: './admin-conflicts-page.html',
  styleUrl: './admin-conflicts-page.css'
})
export class AdminConflictsPage implements OnInit {
  activeTab: 'conflicts' | 'queries' = 'conflicts';

  // Conflicts State
  conflicts: AdminConflictSummaryResponse[] = [];
  isLoadingConflicts = true;
  errorConflicts = '';

  // Queries State
  queries: UserQuery[] = [];
  isLoadingQueries = true;
  errorQueries = '';
  
  selectedQuery: UserQuery | null = null;
  replyForm: FormGroup;
  isSubmitting = false;
  submitError = '';

  constructor(
    private adminConflictService: AdminConflictService,
    private adminQueryService: AdminQueryService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.replyForm = this.fb.group({
      status: ['', Validators.required],
      adminResponse: ['']
    });
  }

  ngOnInit(): void {
    this.fetchConflicts();
    this.fetchQueries();
  }

  setActiveTab(tab: 'conflicts' | 'queries'): void {
    this.activeTab = tab;
  }

  // --- Conflicts Logic ---
  fetchConflicts(): void {
    this.isLoadingConflicts = true;
    this.adminConflictService.getAllConflicts().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.conflicts = res.data;
        }
        this.isLoadingConflicts = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorConflicts = 'Failed to load conflicts.';
        this.isLoadingConflicts = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewDetails(conflictId: number): void {
    this.router.navigate(['/admin/conflicts', conflictId, 'details']);
  }

  // --- Queries Logic ---
  fetchQueries(): void {
    this.isLoadingQueries = true;
    this.adminQueryService.getAllQueries().subscribe({
      next: (res) => {
        if (res.success) {
          this.queries = res.data;
        }
        this.isLoadingQueries = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorQueries = 'Failed to load queries.';
        this.isLoadingQueries = false;
        this.cdr.detectChanges();
      }
    });
  }

  openReviewModal(query: UserQuery): void {
    this.selectedQuery = query;
    this.submitError = '';
    this.replyForm.patchValue({
      status: query.status,
      adminResponse: query.adminResponse || ''
    });
    const modal = document.getElementById('query_review_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeModal(): void {
    const modal = document.getElementById('query_review_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.selectedQuery = null;
  }

  onSubmitReply(): void {
    if (this.replyForm.invalid || !this.selectedQuery) return;

    this.isSubmitting = true;
    this.submitError = '';
    
    this.adminQueryService.replyToQuery(this.selectedQuery.id, this.replyForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          Object.assign(this.selectedQuery!, res.data);
          this.closeModal();
        } else {
          this.submitError = res.message || 'Failed to update query.';
        }
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.submitError = 'Failed to update query. Please try again.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
