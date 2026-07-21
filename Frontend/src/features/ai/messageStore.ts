import { create } from "zustand";
import type { AIMessage } from "./types";
import { sendMessage as apiSend } from "./aiApi";

interface AIMessageStore {
  messages: AIMessage[];
  conversationId: string | null;
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAIStore = create<AIMessageStore>((set, get) => ({
  messages: [],
  conversationId: null,
  loading: false,

  sendMessage: async (text) => {
    const tempId = crypto.randomUUID();
    const userMsg: AIMessage = {
      id: tempId,
      conversation_id: get().conversationId ?? "",
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], loading: true }));

    try {
      const { response, conversation_id } = await apiSend(text);
      set((s) => ({
        conversationId: conversation_id,
        messages: [
          ...s.messages,
          {
            id: crypto.randomUUID(),
            conversation_id,
            role: "assistant",
            content: response,
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
            role: "assistant",
            content: "Something went wrong. Please try again.",
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
