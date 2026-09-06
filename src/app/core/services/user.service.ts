import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AvailabilitySlot {
  dayOfWeek: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface UserProfile {
  authId?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  description?: string;
  credit?: number;
  availableTimeInWeek?: AvailabilitySlot[];
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/user`;

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, data);
  }

  getAvailabilitySlots(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/availability`);
  }

  addAvailabilitySlot(slot: AvailabilitySlot): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/availability`, slot);
  }

  removeAvailabilitySlot(slot: AvailabilitySlot): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/availability`, { body: slot });
  }
}
