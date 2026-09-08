import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatResponse } from '../models/ai-chat.models';

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/ai'; // Update accordingly

  getChatMenu(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chat-menu`);
  }

  openChat(chatId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/chat/${chatId}`);
  }

  sendMessage(chatId: string | null, prompt: string, nextGenSummary: string, isNewChat: boolean): Observable<ChatResponse> {
    const payload = {
      prompt: prompt,
      next_gen_summary: nextGenSummary,
      new_chat: isNewChat
    };
    const url = chatId ? `${this.baseUrl}/chat/${chatId}` : `${this.baseUrl}/chat`;
    return this.http.post<ChatResponse>(url, payload);
  }
}
