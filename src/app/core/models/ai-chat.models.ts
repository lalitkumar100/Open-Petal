export interface AiText {
  introMessage?: string;
  outroMessage?: string;
  toCanvas?: string;
}

export interface Dataset {
  label: string;
  rows: number;
  columns: number;
  data: Record<string, any>[];
}

export interface ChatResponse {
  chatId: string;
  title: string;
  aiText?: AiText;
  fromDatabase?: Dataset[];
  canvas: boolean;
  nextGenSummary?: string;
  intentExplanation?: string;
}

export interface ChatMessageItem {
  id: string;
  userQuery: string;
  response: ChatResponse | null;
  error?: boolean; // Marks failed requests to avoid silent UI freezes
}
