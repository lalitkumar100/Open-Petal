import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  authId?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
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

  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${environment.apiVersion}/user/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${environment.apiVersion}/user/profile`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${environment.apiVersion}/user/change-password`, data);
  }
}
