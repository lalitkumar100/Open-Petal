import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SessionSummaryResponse {
  id: number;
  partnerName: string;
  role: string;
  primarySkillName: string;
  sessionType: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  mode: string;
  status: string;
}

export interface SessionDetailResponse extends SessionSummaryResponse {
  offeredSkillName?: string;
  creditsHeld: number;
  meetingLink?: string;
  locationName?: string;
  createdAt: string;
  isMentor: boolean;
  canAccept: boolean;
  canDecline: boolean;
  canCancel: boolean;

  learnerVerifiedStart: boolean;
  mentorVerifiedStart: boolean;
  learnerVerifiedEnd: boolean;
  mentorVerifiedEnd: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/sessions`;

  constructor(private http: HttpClient) {}

  getMySessions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-sessions`);
  }

  getSessionDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  cancelSession(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  acceptSession(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/accept`, {});
  }

  declineSession(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/decline`, {});
  }

  getMyOtp(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/my-otp`);
  }

  verifyStart(id: number, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/verify-start`, { otp });
  }



  verifyEnd(id: number, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/verify-end`, { otp });
  }

  raiseConflict(id: number, payload: { reason: string; story: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/raise-conflict`, payload);
  }

  getSessionConflict(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${sessionId}/conflict`);
  }

  submitConflictStory(sessionId: number, story: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${sessionId}/conflict/story`, { story });
  }
}
