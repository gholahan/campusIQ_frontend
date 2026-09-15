import type { AiChatRole } from "./enums";

export interface PaginatedAIMessages {
  messages: AIMessage[];
  next_cursor: string | null;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: AiChatRole;
  content: string;
  document_id: string | null;
  created_at: string;
}

export interface AIMessageRequest {
  message: string;
  document_id: string | null;
}

export interface AIMessageResponse {
  message: string;
  response: string;
  document_id: string | null;
}

export interface ConversationRead {
  id: string;
  created_at: string;
}

export interface AICreditRead {
  user_id: string;
  used_today: number;
  daily_limit: number;
  last_reset: string;
}
