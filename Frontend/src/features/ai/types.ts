export interface PaginatedAIMessages {
  messages: AIMessage[];
  next_cursor: string | null;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface AIMessageRequest {
  message: string;
}

export interface AIMessageResponse {
  response: string;
}
