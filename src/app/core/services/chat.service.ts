import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ConversationSummaryDto {
  connectionRequestId: number;
  partnerId: number;
  partnerName: string;
  partnerInitials: string;
  lastMessagePreview: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface ChatMessageDto {
  id: number;
  connectionRequestId: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/v1/chat`;
  
  public unreadCount$ = new BehaviorSubject<number>(0);
  private unreadPollingSub?: Subscription;

  constructor(private http: HttpClient) {}

  getConversations(): Observable<{data: ConversationSummaryDto[]}> {
    return this.http.get<{data: ConversationSummaryDto[]}>(`${this.apiUrl}/conversations`);
  }

  getMessages(connectionRequestId: number): Observable<{data: ChatMessageDto[]}> {
    return this.http.get<{data: ChatMessageDto[]}>(`${this.apiUrl}/${connectionRequestId}/messages`);
  }

  sendMessage(connectionRequestId: number, content: string): Observable<{data: ChatMessageDto}> {
    return this.http.post<{data: ChatMessageDto}>(`${this.apiUrl}/${connectionRequestId}/send`, { content });
  }

  markAsRead(connectionRequestId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${connectionRequestId}/read`, {}).pipe(
      tap(() => this.updateUnreadCount())
    );
  }

  getUnreadCount(): Observable<{data: {totalUnread: number}}> {
    return this.http.get<{data: {totalUnread: number}}>(`${this.apiUrl}/unread-count`);
  }

  updateUnreadCount() {
    this.getUnreadCount().subscribe({
      next: (res) => this.unreadCount$.next(res.data.totalUnread),
      error: (err) => console.error('Failed to get unread count', err)
    });
  }

  startUnreadPolling(intervalMs: number = 30000) {
    if (!this.unreadPollingSub) {
      this.updateUnreadCount(); // Initial fetch
      this.unreadPollingSub = timer(intervalMs, intervalMs).pipe(
        switchMap(() => this.getUnreadCount())
      ).subscribe({
        next: (res) => this.unreadCount$.next(res.data.totalUnread),
        error: (err) => console.error('Polling unread count failed', err)
      });
    }
  }

  stopUnreadPolling() {
    if (this.unreadPollingSub) {
      this.unreadPollingSub.unsubscribe();
      this.unreadPollingSub = undefined;
    }
  }
}
