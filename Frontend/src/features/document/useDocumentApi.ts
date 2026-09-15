import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  uploadDocument,
  getDocument,
  getDocumentStatus,
  getConversationDocuments,
  deleteDocument,
} from "./documentApi";
import { DocumentStatus } from "./types";

import type {
  UploadDocumentRequest,
  DocumentResponse,
  DocumentStatusResponse,
} from "./types";

export const useUploadDocument = () => {
  const qc = useQueryClient();
  const mutation = useMutation<DocumentResponse, Error, UploadDocumentRequest>({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["conversation-documents", data.conversation_id] });
    },
  });
  return { ...mutation, uploadDocument: mutation.mutateAsync };
};

export const useGetDocumentById = (documentId: string) => {
  const { data, isLoading, error } = useQuery<DocumentResponse, Error>({
    queryKey: ["document", documentId],
    queryFn: () => getDocument(documentId),
    enabled: !!documentId,
  });
  return { document: data, isLoading, error };
};

export const useGetDocumentStatus = (documentId: string, enabled = true) => {
  const { data, isLoading, error } = useQuery<DocumentStatusResponse, Error>({
    queryKey: ["document-status", documentId],
    queryFn: () => getDocumentStatus(documentId),
    enabled: enabled && !!documentId,
    refetchInterval: (query) =>
      query.state.data?.status === DocumentStatus.processing ? 2000 : false,
  });

  return { status: data?.status, isLoading, error };
};

export const useGetConversationDocuments = (conversationId: string) => {
  const { data, isLoading, error } = useQuery<DocumentResponse[], Error>({
    queryKey: ["conversation-documents", conversationId],
    queryFn: () => getConversationDocuments(conversationId),
    enabled: !!conversationId,
  });
  return { documents: data ?? [], isLoading, error };
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  const mutation = useMutation<void, Error, string>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversation-documents"] });
    },
  });
  return { ...mutation, deleteDocument: mutation.mutateAsync };
};
