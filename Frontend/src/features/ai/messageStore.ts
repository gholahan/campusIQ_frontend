import { create } from "zustand";
import type { AIMessage } from "./types";
import { sendMessage as apiSend } from "./aiApi";
import { AiChatRole } from "./enums";

interface AIMessageStore {
  messages: AIMessage[];
  conversationId: string | null;
  loading: boolean;
  sendMessage: (text: string, documentId?: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAIStore = create<AIMessageStore>((set, get) => ({
  messages: [],
  conversationId: null,
  loading: false,

  sendMessage: async (text, documentId?) => {
    const tempId = crypto.randomUUID();
    const userMsg: AIMessage = {
      id: tempId,
      conversation_id: get().conversationId ?? "",
      role: AiChatRole.User,
      content: text,
      document_id: documentId ?? null,
      created_at: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], loading: true }));

    try {
      const { response, conversation_id, document_id } = await apiSend(text, documentId);
      set((s) => ({
        conversationId: conversation_id,
        messages: [
          ...s.messages,
          {
            id: crypto.randomUUID(),
            conversation_id,
            role: AiChatRole.Assistant,
            content: response,
            document_id,
            created_at: new Date().toISOString(),
          },
        ],
      }));
    } catch {
      set((s) => ({
        messages: [
          ...s.messages,
          {
            id: crypto.randomUUID(),
            conversation_id: get().conversationId ?? "",
            role: AiChatRole.Assistant,
            content: "Something went wrong. Please try again.",
            document_id: null,
            created_at: new Date().toISOString(),
          },
        ],
      }));
    } finally {
      set({ loading: false });
    }
  },

  clearMessages: () => set({ messages: [], conversationId: null }),
}));
