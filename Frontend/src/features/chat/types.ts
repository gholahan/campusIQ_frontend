export interface ChatMessage {
  id: number;
  from: 'tutor' | 'student' | 'me' | 'other';
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  color: string;
  role: string;
  online: boolean;
  time: string;
  unread: number;
  preview: string;
}

export interface ConvoTab {
  key: string;
  label: string;
  convos: Conversation[];
}
