import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LocationCreateRequest {
    addressLine1: string;
    addressLine2?: string;
    area: string;
    city: string;
    pincode: string;
}

export interface LocationResponse {
    id: number;
    addressLine1: string;
    addressLine2?: string;
    area: string;
    city: string;
    pincode: string;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/api/admin/locations`;

  constructor(private http: HttpClient) { }

  getAllLocations(): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(this.apiUrl);
  }

  getLocationById(id: number): Observable<LocationResponse> {
    return this.http.get<LocationResponse>(`${this.apiUrl}/${id}`);
  }

  createLocation(request: LocationCreateRequest): Observable<LocationResponse> {
    return this.http.post<LocationResponse>(this.apiUrl, request);
  }
}
