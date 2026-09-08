import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminDashboardDto {
  totalUsers: number;
  newUsers24h: number;
  totalSkills: number;
  totalSkillCategories: number;
  totalConflicts: number;
  totalSessions: number;
  sessions24h: number;
  newQueries24h: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = '/admin/dashboard';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all dashboard statistics for the admin homepage.
   */
  getDashboardStats(): Observable<ApiResponse<AdminDashboardDto>> {
    return this.http.get<ApiResponse<AdminDashboardDto>>(this.apiUrl);
  }
}
