import axios from "axios";
import { useAuthStore } from "../auth";
import type { AIMessage, PaginatedAIMessages } from "./types";
const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined");
}

const tutorApi = axios.create({
  baseURL: `${BASE_URL}/ai`,
  headers: { "Content-Type": "application/json" },
});

tutorApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function sendMessage(userText: string): Promise<{ response: string; conversation_id: string }> {
  const { data } = await tutorApi.post("/chat", { message: userText });
  return { response: data.response, conversation_id: data.conversation_id };
}

export async function get_ai_messages(cursor?: string): Promise<PaginatedAIMessages> {
  const { data } = await tutorApi.get<PaginatedAIMessages>(`conversations`, {
    params: cursor ? { cursor } : undefined,
  });
  return data;
}
