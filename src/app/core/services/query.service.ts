import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserQueryRequestDto {
  queryType: string;
  subject: string;
  description: string;
}

export interface UserQuery {
  id: number;
  queryType: string;
  status: string;
  subject: string;
  description: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private apiUrl = `${environment.apiUrl}/queries`;

  constructor(private http: HttpClient) { }

  /**
   * Submit a new support query to the platform admins.
   * @param requestDto The query details containing type, subject, and description
   * @returns An observable of the API response containing the created query
   */
  submitQuery(requestDto: UserQueryRequestDto): Observable<ApiResponse<UserQuery>> {
    return this.http.post<ApiResponse<UserQuery>>(this.apiUrl, requestDto);
  }

  /**
   * Get a query by its ID.
   * @param id The query ID
   * @returns An observable of the API response containing the query
   */
  getQueryById(id: number): Observable<ApiResponse<UserQuery>> {
    return this.http.get<ApiResponse<UserQuery>>(`${this.apiUrl}/${id}`);
  }
}
