import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { QueryService } from '../../../core/services/query.service';

export interface SkillBadge {
  id?: number;
  name: string;
  level?: string;
}

export interface UserSearchSummary {
  userId: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  description: string;
  learningSkills: SkillBadge[];
  techSkills: SkillBadge[];
}

@Component({
  selector: 'app-search-page',
  standalone: false,
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  searchType: string = 'user';
  query: string = '';
  usersList: UserSearchSummary[] = [];
  isLoading = false;
  error: string | null = null;
  loggedInUserId: number | null = null;
  private authService = inject(AuthService);
  private queryService = inject(QueryService);

  // Request Skill Modal State
  requestSubject: string = '';
  requestDescription: string = '';
  isSubmittingRequest: boolean = false;
  requestError: string | null = null;
  requestSuccess: boolean = false;

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.userId) {
      this.loggedInUserId = user.userId;
    }
    this.fetchSearchResults();
  }

  onSearch() {
    this.fetchSearchResults();
  }

  fetchSearchResults() {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    const url = `${environment.apiUrl}/${environment.apiVersion}/search/users?searchType=${encodeURIComponent(this.searchType)}&query=${encodeURIComponent(this.query)}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.usersList = res.data.content || [];
        } else {
          this.usersList = [];
          this.error = res.message || 'Failed to fetch search results.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Error fetching search results. Please try again.';
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

  openRequestModal() {
    this.requestSubject = '';
    this.requestDescription = '';
    this.requestError = null;
    this.requestSuccess = false;
    const modal = document.getElementById('request_skill_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeRequestModal() {
    const modal = document.getElementById('request_skill_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  requestNewSkill() {
    if (!this.requestSubject.trim() || !this.requestDescription.trim()) {
      this.requestError = 'Please provide both a skill name and a description.';
      return;
    }

    this.isSubmittingRequest = true;
    this.requestError = null;
    this.cdr.detectChanges();

    this.queryService.submitQuery({
      queryType: 'ADD_NEW_SKILL',
      subject: this.requestSubject,
      description: this.requestDescription
    }).subscribe({
      next: (res) => {
        this.isSubmittingRequest = false;
        if (res.success) {
          this.requestSuccess = true;
          // Close after 2 seconds
          setTimeout(() => {
            this.closeRequestModal();
          }, 2000);
        } else {
          this.requestError = res.message || 'Failed to submit request.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingRequest = false;
        this.requestError = err.error?.message || 'Error submitting request. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}

