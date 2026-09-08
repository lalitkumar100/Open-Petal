import { Component, ViewChild, ElementRef, inject, signal, DestroyRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MarkdownModule } from 'ngx-markdown';
import { AiChatService } from '../../core/services/ai-chat.service';
import { ChatMessageItem, ChatResponse, Dataset } from '../../core/models/ai-chat.models';
import { FilterTablesPipe } from '../../core/pipes/filter-tables.pipe';
import { SmallTableComponent } from '../small-table/small-table.component';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule, FilterTablesPipe, SmallTableComponent],
  templateUrl: './chat-panel.component.html'
})
export class ChatPanelComponent implements OnInit {
  private chatService = inject(AiChatService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  // Loaders
  isLoadingMenu = signal<boolean>(false);
  isLoadingHistory = signal<boolean>(false);

  // State using Angular Signals
  chatMenu = signal<any[]>([]);
  chatHistory = signal<ChatMessageItem[]>([]);
  chatId = signal<string | null>(null);
  chatTitle = signal<string>('+ New Chat');
  memory = signal<string>('');
  isNewChat = signal<boolean>(true);
  query = signal<string>('');

  // UI / Pseudo-Streaming Signals
  isWaitingResponse = signal<boolean>(false);
  thinkingMessageId = signal<string | null>(null);
  thinkingSeconds = signal<number>(0);
  thinkingStage = signal<string>('Analyzing query...');
  
  // Canvas State Signals
  isCanvasOpen = signal<boolean>(false);
  canvasData = signal<{ markdown?: string; tables?: Dataset[] } | null>(null);

  private timerSub?: Subscription;
  private readonly stages = [
    'Analyzing user query...',
    'Evaluating RBAC and data scope...',
    'Synthesizing read-only SQL...',
    'Executing PostgreSQL pipeline...',
    'Formatting presentation...'
  ];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.fetchChatMenu();
  }

  fetchChatMenu(): void {
    this.isLoadingMenu.set(true);
    this.chatService.getChatMenu()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (menu) => {
          this.chatMenu.set(menu);
          this.isLoadingMenu.set(false);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load chat menu', err);
          this.isLoadingMenu.set(false);
          this.cdr.detectChanges();
        }
      });
  }

  startNewChat(): void {
    this.chatId.set(null);
    this.chatTitle.set('+ New Chat');
    this.chatHistory.set([]);
    this.memory.set('');
    this.isNewChat.set(true);
  }

  onChatSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedId = select.value;
    if (selectedId) {
      this.loadChat(selectedId);
    } else {
      this.startNewChat();
    }
  }

  loadChat(id: string): void {
    this.isLoadingHistory.set(true);
    this.chatService.openChat(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (historyDto) => {
          this.isLoadingHistory.set(false);
          this.chatId.set(historyDto.id);
          this.chatTitle.set(historyDto.title);
          this.isNewChat.set(false);
          
          // Map backend history to frontend state
          const mappedHistory: ChatMessageItem[] = historyDto.messages.map((m: any) => {
            const resp = m.response;
            const normalizedResponse = resp ? {
              chatId: resp.chatId || resp.chat_id,
              title: resp.title,
              aiText: resp.aiText || (resp.ai_text ? {
                introMessage: resp.ai_text.introMessage || resp.ai_text.intro_message,
                outroMessage: resp.ai_text.outroMessage || resp.ai_text.outro_message,
                toCanvas: resp.ai_text.toCanvas || resp.ai_text.to_canvas
              } : undefined),
              fromDatabase: resp.fromDatabase || resp.from_database || [],
              canvas: resp.canvas,
              nextGenSummary: resp.nextGenSummary || resp.next_gen_summary,
              intentExplanation: resp.intentExplanation || resp.intent_explanation
            } : null;

            return {
              id: crypto.randomUUID(),
              userQuery: m.userQuery || m.user_query,
              response: normalizedResponse
            };
          });
          
          this.chatHistory.set(mappedHistory);
          // Extract last memory if exists
          if (mappedHistory.length > 0 && mappedHistory[mappedHistory.length - 1].response?.nextGenSummary) {
             this.memory.set(mappedHistory[mappedHistory.length - 1].response!.nextGenSummary!);
          } else {
             this.memory.set('');
          }
          this.scrollToBottom();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoadingHistory.set(false);
          console.error('Failed to load chat history', err);
          this.cdr.detectChanges();
        }
      });
  }

  handleSend(): void {
    const q = this.query().trim();
    if (!q || this.isWaitingResponse()) return;

    const messageId = crypto.randomUUID();
    const currentQuery = q;

    // 1. Optimistic push
    this.chatHistory.update(list => [
      ...list,
      { id: messageId, userQuery: currentQuery, response: null }
    ]);
    this.query.set('');
    this.startFakeStreaming(messageId);
    this.scrollToBottom();

    // 2. Dispatch
    this.chatService.sendMessage(this.chatId(), currentQuery, this.memory(), this.isNewChat())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ChatResponse) => {
          this.stopFakeStreaming();

          if (this.isNewChat()) {
            this.chatTitle.set(response.title || 'New Chat');
            this.chatId.set(response.chatId);
            this.isNewChat.set(false);
            this.fetchChatMenu(); // Refresh menu with the new chat
          }
          this.memory.set(response.nextGenSummary || '');

          this.chatHistory.update(history =>
            history.map(item => item.id === messageId ? { ...item, response } : item)
          );
          this.scrollToBottom();
        },
        error: (err) => {
          this.stopFakeStreaming();
          console.error('Chat error:', err);
          // 3. Mark the message with an error state to avoid silent UI freezes
          this.chatHistory.update(history =>
            history.map(item => item.id === messageId ? { ...item, error: true } : item)
          );
          this.scrollToBottom();
          this.cdr.detectChanges();
        }
      });
  }

  startFakeStreaming(msgId: string): void {
    this.isWaitingResponse.set(true);
    this.thinkingMessageId.set(msgId);
    this.thinkingSeconds.set(0);
    this.thinkingStage.set(this.stages[0]);

    this.timerSub = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef)) // Prevents memory leak on unmount
      .subscribe(sec => {
        this.thinkingSeconds.set(sec + 1);
        const stageIndex = Math.min(Math.floor((sec + 1) / 2), this.stages.length - 1);
        this.thinkingStage.set(this.stages[stageIndex]);
      });
  }

  stopFakeStreaming(): void {
    this.isWaitingResponse.set(false);
    this.thinkingMessageId.set(null);
    this.timerSub?.unsubscribe();
  }

  // Canvas Handlers
  openCanvas(msg: ChatMessageItem): void {
    if (!msg.response) return;
    this.canvasData.set({
      markdown: msg.response.aiText?.toCanvas,
      tables: msg.response.fromDatabase
    });
    this.isCanvasOpen.set(true);
  }

  closeCanvas(): void {
    this.isCanvasOpen.set(false);
    this.canvasData.set(null);
  }

  exportToExcel(table: Dataset): void {
    if (!table.data || table.data.length === 0) return;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(table.data);
    const workbook: XLSX.WorkBook = {
      Sheets: { [table.label || 'Data']: worksheet },
      SheetNames: [table.label || 'Data']
    };
    XLSX.writeFile(workbook, `${table.label || 'data-export'}_${Date.now()}.xlsx`);
  }

  // Helper for Template
  hasLargeTables(datasets?: Dataset[]): boolean {
    return !!datasets && datasets.some(t => t.rows > 10 || t.columns > 5);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTo({
          top: this.scrollContainer.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 50);
  }
}
