import axios from "axios";
import { useAuthStore } from "../auth";
import type {
  UploadDocumentRequest,
  DocumentResponse,
  DocumentStatusResponse,
} from "./types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined");
}

const docApi = axios.create({
  baseURL: `${BASE_URL}/documents`,
  headers: {
    "Content-Type": "application/json",
  },
});

docApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const uploadDocument = async (
  payload: UploadDocumentRequest
): Promise<DocumentResponse> => {
  const { data } = await docApi.post<DocumentResponse>("/", payload);

  return data;
};

export const getDocument = async (
  documentId: string
): Promise<DocumentResponse> => {
  const { data } = await docApi.get<DocumentResponse>(
    `/${documentId}`
  );

  return data;
};

export const getDocumentStatus = async (
  documentId: string
): Promise<DocumentStatusResponse> => {
  const { data } = await docApi.get<DocumentStatusResponse>(
    `/${documentId}/status`
  );

  return data;
};

export const getConversationDocuments = async (
  conversationId: string
): Promise<DocumentResponse[]> => {
  const { data } = await docApi.get<DocumentResponse[]>(
    `/conversation/${conversationId}`
  );

  return data;
};

export const deleteDocument = async (
  documentId: string
): Promise<void> => {
  await docApi.delete(`/${documentId}`);
};