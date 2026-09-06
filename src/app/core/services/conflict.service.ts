import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConflictSummaryResponse {
  conflictId: number;
  sessionId: number;
  partnerName: string;
  myRole: string;
  primarySkillName: string;
  reason: string;
  status: string;
  raisedByMe: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConflictService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/conflicts`;

  constructor(private http: HttpClient) {}

  getMyConflicts(): Observable<{ success: boolean, message: string, data: ConflictSummaryResponse[] }> {
    return this.http.get<any>(`${this.apiUrl}/my-conflicts`);
  }
}
