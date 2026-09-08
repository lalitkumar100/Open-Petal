import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminDashboardService, AdminDashboardDto } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-home-page',
  standalone: false,
  templateUrl: './admin-home-page.html'
})
export class AdminHomePage implements OnInit {
  stats: AdminDashboardDto | null = null;
  isLoading = true;
  error = '';

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.isLoading = true;
    this.error = '';
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
        } else {
          this.error = res.message || 'Failed to load dashboard statistics.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'An error occurred while fetching dashboard statistics.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

