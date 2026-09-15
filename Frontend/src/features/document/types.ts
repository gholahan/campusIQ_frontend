export enum DocumentStatus {
  processing = "processing",
  ready = "ready",
  failed = "failed",
}

export interface DocumentStatusResponse {
  status: DocumentStatus;
}

export interface UploadDocumentRequest {
  file_name: string;
  file_url: string;
}

export interface DocumentResponse {
  id: string;
  conversation_id?: string | null;
  file_name: string;
  file_url: string;
  status: DocumentStatus;
  page_count?: number | null;
  created_at: string;
}