import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserQuery, ApiResponse } from './query.service';

export interface AdminQueryReplyDto {
  status: string;
  adminResponse: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminQueryService {
  private apiUrl = '/admin/queries';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all user queries.
   * @param status Optional status to filter by
   */
  getAllQueries(status?: string): Observable<ApiResponse<UserQuery[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<UserQuery[]>>(this.apiUrl, { params });
  }

  /**
   * Replies to a specific query, updating its status and response.
   * @param queryId The ID of the query
   * @param replyDto The status and response payload
   */
  replyToQuery(queryId: number, replyDto: AdminQueryReplyDto): Observable<ApiResponse<UserQuery>> {
    return this.http.patch<ApiResponse<UserQuery>>(`${this.apiUrl}/${queryId}/reply`, replyDto);
  }
}
