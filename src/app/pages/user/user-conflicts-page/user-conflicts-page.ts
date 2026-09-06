import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConflictService, ConflictSummaryResponse } from '../../../core/services/conflict.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-conflicts-page',
  standalone: false,
  templateUrl: './user-conflicts-page.html',
  styleUrl: './user-conflicts-page.css'
})
export class UserConflictsPage implements OnInit {
  conflicts: ConflictSummaryResponse[] = [];
  isLoading = true;
  error = '';

  constructor(
    private conflictService: ConflictService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchConflicts();
  }

  fetchConflicts(): void {
    this.isLoading = true;
    this.conflictService.getMyConflicts().subscribe({
      next: (res) => {
        if (res.success) {
          this.conflicts = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load conflicts. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewSession(sessionId: number): void {
    this.router.navigate(['/user/session', sessionId]);
  }
}
