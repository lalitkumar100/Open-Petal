import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminConflictService, AdminConflictSummaryResponse } from '../../../core/services/admin-conflict.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-conflicts-page',
  standalone: false,
  templateUrl: './admin-conflicts-page.html',
  styleUrl: './admin-conflicts-page.css'
})
export class AdminConflictsPage implements OnInit {
  conflicts: AdminConflictSummaryResponse[] = [];
  isLoading = true;
  error = '';



  constructor(
    private adminConflictService: AdminConflictService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchConflicts();
  }

  fetchConflicts(): void {
    this.isLoading = true;
    this.adminConflictService.getAllConflicts().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.conflicts = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load conflicts.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewDetails(conflictId: number): void {
    this.router.navigate(['/admin/conflicts', conflictId, 'details']);
  }
}
