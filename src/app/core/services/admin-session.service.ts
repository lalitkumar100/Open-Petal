import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminSessionSummaryResponse {
  id: number;
  learnerName: string;
  learnerEmail: string;
  mentorName: string;
  mentorEmail: string;
  primarySkillName: string;
  sessionType: string;
  creditsHeld: number;
  mode: string;
  status: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface AdminSessionDetailResponse extends AdminSessionSummaryResponse {
  locationName?: string;
  meetingLink?: string;
  learnerStartPassword?: string;
  mentorStartPassword?: string;
  learnerEndPassword?: string;
  mentorEndPassword?: string;
  offeredSkillName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSessionService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/sessions`;

  constructor(private http: HttpClient) {}

  getAllSessions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getSessionDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  cancelSession(id: number, reason: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, { reason });
  }
}
