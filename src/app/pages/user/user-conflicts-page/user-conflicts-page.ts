import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConflictService, ConflictSummaryResponse } from '../../../core/services/conflict.service';
import { QueryService, UserQuery } from '../../../core/services/query.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-conflicts-page',
  standalone: false,
  templateUrl: './user-conflicts-page.html',
  styleUrl: './user-conflicts-page.css'
})
export class UserConflictsPage implements OnInit {
  activeTab: 'conflicts' | 'queries' = 'conflicts';
  
  conflicts: ConflictSummaryResponse[] = [];
  userQueries: UserQuery[] = [];
  
  isLoadingConflicts = true;
  isLoadingQueries = true;
  
  error = '';

  constructor(
    private conflictService: ConflictService,
    private queryService: QueryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchConflicts();
    this.fetchQueries();
  }

  setActiveTab(tab: 'conflicts' | 'queries'): void {
    this.activeTab = tab;
  }

  fetchConflicts(): void {
    this.isLoadingConflicts = true;
    this.conflictService.getMyConflicts().subscribe({
      next: (res) => {
        if (res.success) {
          this.conflicts = res.data;
        }
        this.isLoadingConflicts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load conflicts. Please try again.';
        this.isLoadingConflicts = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectedQuery: UserQuery | null = null;

  fetchQueries(): void {
    this.isLoadingQueries = true;
    this.queryService.getUserQueries().subscribe({
      next: (res) => {
        if (res.success) {
          this.userQueries = res.data;
        }
        this.isLoadingQueries = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load queries. Please try again.';
        this.isLoadingQueries = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewSession(sessionId: number): void {
    this.router.navigate(['/user/session', sessionId]);
  }

  viewQueryDetails(query: UserQuery): void {
    this.selectedQuery = query;
    const modal = document.getElementById('query_details_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeQueryModal(): void {
    const modal = document.getElementById('query_details_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.selectedQuery = null;
  }
}
