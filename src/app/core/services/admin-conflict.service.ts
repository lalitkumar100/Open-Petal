import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminConflictSummaryResponse {
  conflictId: number;
  sessionId: number;
  learnerName: string;
  mentorName: string;
  primarySkillName: string;
  reason: string;
  status: string;
  creditsHeld: number;
  raisedByName: string;
  createdAt: string;
}

export interface AdminConflictDetailResponse {
  conflictId: number;
  sessionId: number;
  learnerName: string;
  mentorName: string;
  primarySkillName: string;
  sessionMode: string;
  sessionType: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  creditsHeld: number;
  learnerStory: string;
  mentorStory: string;
  reason: string;
  status: string;
  raisedByName: string;
  adminResolutionNotes: string;
  resolvedByName: string;
  resolvedAt: string;
  createdAt: string;
}

export interface ResolveConflictRequest {
  resolutionAction: string;
  adminNotes: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminConflictService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/conflicts`;

  constructor(private http: HttpClient) {}

  getAllConflicts(): Observable<{ success: boolean, message: string, data: AdminConflictSummaryResponse[] }> {
    return this.http.get<any>(this.apiUrl);
  }

  getConflictDetails(id: number): Observable<{ success: boolean, message: string, data: AdminConflictDetailResponse }> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  resolveConflict(id: number, payload: ResolveConflictRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/resolve`, payload);
  }
}
