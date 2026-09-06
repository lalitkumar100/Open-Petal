import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export interface User {
  userId: number;
  authId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string | null;
  dob?: string | null;
  status?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-user-page',
  standalone: false,
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  users: User[] = [];
  
  searchType: string = 'name';
  searchQuery: string = '';
  sortOption: string = 'a-z'; // default sort A-Z
  
  currentPage: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  get startIndex(): number {
    return this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Determine sort parameters based on sortOption
    let sortBy = 'firstName';
    let sortDir = 'asc';
    
    switch (this.sortOption) {
      case 'a-z':
        sortBy = 'firstName';
        sortDir = 'asc';
        break;
      case 'z-a':
        sortBy = 'firstName';
        sortDir = 'desc';
        break;
      case 'new-old':
        sortBy = 'createdAt';
        sortDir = 'desc';
        break;
      case 'old-new':
        sortBy = 'createdAt';
        sortDir = 'asc';
        break;
    }

    let params = new HttpParams()
      .set('page', (this.currentPage - 1).toString())
      .set('size', this.pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      params = params.set('searchType', this.searchType)
                     .set('searchQuery', this.searchQuery.trim());
    }

    // Call the API required for this page
    const url = `${environment.apiUrl}/${environment.apiVersion}/admin/user`;
    
    this.http.get<any>(url, { params }).subscribe({
      next: (response) => {
        if (response && response.data) {
           this.users = response.data.content || response.data;
           this.totalRecords = response.data.totalElements || this.users.length;
        } else {
           this.users = response.content || response;
           this.totalRecords = response.totalElements || this.users.length;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Backend API not yet ready or failed, using demo fallback data.', err);
        this.loadDemoData();
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onReset() {
    this.searchQuery = '';
    this.searchType = 'name';
    this.sortOption = 'a-z';
    this.currentPage = 1;
    this.loadUsers();
  }

  onSortChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(direction: number) {
    this.currentPage += direction;
    this.loadUsers();
  }

  viewDetails(user: User) {
    this.router.navigate(['/admin/users', user.userId, 'details']);
  }

  // Fallback demo data to render view properly even without the backend API hooked up
  private loadDemoData() {
    const allUsers: User[] = [
      { userId: 1, firstName: "Alexander", lastName: "Rivera", email: "alexander.r@example.com", phone: "9876543201", gender: "MALE", createdAt: "2026-01-01T10:00:00Z" },
      { userId: 2, firstName: "Prajwal", lastName: "Reyar", email: "prajwal.reyar@example.com", phone: "9876543202", gender: null, createdAt: "2026-01-02T10:00:00Z" },
      { userId: 3, firstName: "Sophia", lastName: "Chen", email: "sophia.chen@example.com", phone: "9876543203", gender: "FEMALE", createdAt: "2026-01-03T10:00:00Z" },
      { userId: 4, firstName: "Marcus", lastName: "Vance", email: "marcus.vance@example.com", phone: "9876543204", gender: "MALE", createdAt: "2026-01-04T10:00:00Z" },
      { userId: 5, firstName: "Elena", lastName: "Rostova", email: "elena.rostova@example.com", phone: "9876543205", gender: "FEMALE", createdAt: "2026-01-05T10:00:00Z" },
      { userId: 6, firstName: "Liam", lastName: "Gallagher", email: "liam.g@example.com", phone: "9876543206", gender: "MALE", createdAt: "2026-01-06T10:00:00Z" },
      { userId: 7, firstName: "Amina", lastName: "Yusuf", email: "amina.yusuf@example.com", phone: "9876543207", gender: "FEMALE", createdAt: "2026-01-07T10:00:00Z" },
      { userId: 8, firstName: "Lucas", lastName: "Silva", email: "lucas.silva@example.com", phone: "9876543208", gender: "MALE", createdAt: "2026-01-08T10:00:00Z" },
      { userId: 9, firstName: "Chloe", lastName: "Bennett", email: "chloe.b@example.com", phone: "9876543209", gender: "FEMALE", createdAt: "2026-01-09T10:00:00Z" },
      { userId: 10, firstName: "Dev", lastName: "Patel", email: "dev.patel@example.com", phone: "9876543210", gender: "MALE", createdAt: "2026-01-10T10:00:00Z" },
      { userId: 11, firstName: "Zoe", lastName: "Kravitz", email: "zoe.k@example.com", phone: "9876543211", gender: "FEMALE", createdAt: "2026-01-11T10:00:00Z" },
      { userId: 12, firstName: "Ethan", lastName: "Hunt", email: "ethan.hunt@example.com", phone: "9876543212", gender: "MALE", createdAt: "2026-01-12T10:00:00Z" }
    ];

    let filtered = [...allUsers];

    // Simulate Server-side search filtering
    if (this.searchQuery) {
       const q = this.searchQuery.toLowerCase();
       filtered = allUsers.filter(u => {
          if (this.searchType === 'userId') return String(u.userId).includes(q);
          if (this.searchType === 'name') return `${u.firstName} ${u.lastName}`.toLowerCase().includes(q);
          if (this.searchType === 'email') return (u.email || '').toLowerCase().includes(q);
          if (this.searchType === 'phone') return (u.phone || '').toLowerCase().includes(q);
          return false;
       });
    }

    // Simulate Server-side sorting
    filtered.sort((a, b) => {
       if (this.sortOption === 'a-z') return a.firstName.localeCompare(b.firstName);
       if (this.sortOption === 'z-a') return b.firstName.localeCompare(a.firstName);
       if (this.sortOption === 'new-old') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
       if (this.sortOption === 'old-new') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
       return 0;
    });

    // Simulate Server-side Pagination
    this.totalRecords = filtered.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.users = filtered.slice(startIndex, startIndex + this.pageSize);
  }
}
