import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ChatService, ConversationSummaryDto, ChatMessageDto } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inbox-page',
  standalone: false,
  templateUrl: './inbox-page.html',
  styleUrl: './inbox-page.css',
})
export class InboxPage implements OnInit, OnDestroy, AfterViewChecked {
  conversations: ConversationSummaryDto[] = [];
  activeConversation: ConversationSummaryDto | null = null;
  messages: ChatMessageDto[] = [];
  newMessage: string = '';
  currentUserId: number = 0;

  isLoadingConversations: boolean = false;
  isLoadingMessages: boolean = false;
  isSendingMessage: boolean = false;

  private pollingSub?: Subscription;
  private shouldScrollToBottom: boolean = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUser()?.userId || 0;
    this.loadConversations();
    this.chatService.startUnreadPolling(30000);
  }

  ngOnDestroy() {
    this.stopPolling();
    this.chatService.stopUnreadPolling();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadConversations() {
    this.isLoadingConversations = true;
    this.chatService.getConversations().subscribe({
      next: (res) => {
        this.conversations = res.data;
        this.isLoadingConversations = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load conversations', err);
        this.isLoadingConversations = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectConversation(conv: ConversationSummaryDto) {
    this.activeConversation = conv;
    this.messages = [];
    this.loadMessages(conv.connectionRequestId);
    
    this.startPolling(conv.connectionRequestId);
    
    if (conv.unreadCount > 0) {
      this.chatService.markAsRead(conv.connectionRequestId).subscribe(() => {
        conv.unreadCount = 0;
      });
    }
  }

  loadMessages(connectionRequestId: number) {
    this.isLoadingMessages = true;
    this.chatService.getMessages(connectionRequestId).subscribe({
      next: (res) => {
        this.messages = res.data;
        this.shouldScrollToBottom = true;
        this.isLoadingMessages = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.isLoadingMessages = false;
        this.cdr.detectChanges();
      }
    });
  }

  startPolling(connectionRequestId: number) {
    this.stopPolling();
    this.pollingSub = timer(3000, 3000).pipe(
      switchMap(() => this.chatService.getMessages(connectionRequestId))
    ).subscribe({
      next: (res) => {
        const currentCount = this.messages.length;
        this.messages = res.data;
        if (this.messages.length > currentCount) {
          this.shouldScrollToBottom = true;
          this.chatService.markAsRead(connectionRequestId).subscribe();
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Polling messages failed', err)
    });
  }

  stopPolling() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.activeConversation) return;

    const content = this.newMessage.trim();
    this.newMessage = '';
    const reqId = this.activeConversation.connectionRequestId;

    this.isSendingMessage = true;
    this.chatService.sendMessage(reqId, content).subscribe({
      next: (res) => {
        this.messages.push(res.data);
        this.shouldScrollToBottom = true;
        this.activeConversation!.lastMessagePreview = content;
        this.activeConversation!.lastMessageTimestamp = res.data.timestamp;
        this.isSendingMessage = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to send message', err);
        this.isSendingMessage = false;
        this.cdr.detectChanges();
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
