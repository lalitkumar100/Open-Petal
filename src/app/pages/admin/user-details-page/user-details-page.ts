import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface AdminUserDetailsDto {
  userInfo: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    createdAt: string;
  };
  skillsOffered: { name: string; level: string; isVerified?: boolean }[];
  learningGoals: { name: string; level: string }[];
}

@Component({
  selector: 'app-user-details-page',
  standalone: false,
  templateUrl: './user-details-page.html',
})
export class AdminUserDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  userId: string | null = null;
  userDetails: AdminUserDetailsDto | null = null;
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.fetchUserDetails(this.userId);
    } else {
      this.error = "User ID not found in route.";
    }
  }

  fetchUserDetails(id: string) {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();
    const url = `${environment.apiUrl}/${environment.apiVersion}/search/users/${id}/details`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success) {
          this.userDetails = res.data;
        } else {
          this.error = res.message || "Failed to load user details.";
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || "Failed to load user details. Please try again.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.trim().charAt(0) : '';
    const l = lastName ? lastName.trim().charAt(0) : '';
    const initials = (f + l).toUpperCase();
    return initials || '??';
  }

  getAvatarColor(firstName: string, lastName: string): string {
    const name = `${firstName || ''} ${lastName || ''}`;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 40%)`;
  }

  goBack() {
    window.history.back();
  }
}
