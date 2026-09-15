import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Plus,
  FileText,
  X,
  Loader2,
} from "lucide-react";

import { uploadDocument } from "@/features/document/useFileUpload";
import {
  useGetDocumentStatus,
  useUploadDocument,
} from "@/features/document/useDocumentApi";
import { DocumentStatus } from "@/features/document/types";

const MAX_AI_MESSAGE_LENGTH = 300;
const PDF_FILE_TYPE = "application/pdf";

interface Props {
  input: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: (documentId?: string) => void;
}

export function AIInput({
  input,
  loading,
  onChange,
  onSend,
}: Props) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type PendingStatus = "uploading" | "uploaded" | "failed";

  const [pendingFile, setPendingFile] = useState<{
    name: string;
    status: PendingStatus;
    file?: File;
    documentId?: string;
  } | null>(null);

  const {
    uploadDocument: uploadToApi,
    isPending: uploading,
  } = useUploadDocument();
  const pendingDocumentId = pendingFile?.documentId ?? "";
  const {
    status: pendingDocumentStatus,
    isLoading: checkingDocumentStatus,
    error: documentStatusError,
  } = useGetDocumentStatus(pendingDocumentId, !!pendingDocumentId);
  const documentStatusFailed =
    !!documentStatusError || pendingDocumentStatus === DocumentStatus.failed;
  const documentIsProcessing =
    checkingDocumentStatus ||
    pendingDocumentStatus === DocumentStatus.processing;
  const documentIsBusy =
    uploading ||
    pendingFile?.status === "uploading" ||
    documentIsProcessing;
  const composerIsBusy = loading || documentIsBusy;
  const documentIsNotReady =
    documentIsBusy || documentStatusFailed;

    async function uploadFile(file: File) {
      try {
        setPendingFile({ name: file.name, status: "uploading", file });

        const file_url = await uploadDocument(file);

        const response = await uploadToApi({
          file_name: file.name,
          file_url,
        });

        setPendingFile({ name: file.name, status: "uploaded", file, documentId: response.id });
      } catch (error) {
        console.error("Document upload failed:", error);
        setPendingFile({ name: file.name, status: "failed", file });
      }
    }


  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const isPdf =
      file.name.toLowerCase().endsWith(".pdf") &&
      (!file.type || file.type === PDF_FILE_TYPE);
    if (!isPdf) return;

    // kickoff upload (uploadFile will set `pendingFile` status)
    uploadFile(file);
  }

  // Auto-grow textarea until max-height,
  // then the textarea itself becomes scrollable.
  useEffect(() => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";

    const maxHeight = 160;

    el.style.height = `${Math.min(
      el.scrollHeight,
      maxHeight
    )}px`;
  }, [input]);

  function handleSend() {
    if (!input.trim() || composerIsBusy || documentIsNotReady) {
      return;
    }

    const docId = pendingFile?.documentId;
    onSend(docId);
    setPendingFile(null);
  }

  return (
    <div className="w-full px-3 pb-4 pt-2">
      <div className="mx-auto w-full max-w-3xl">

        {/* Composer */}
        <div
          className="
            relative
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--bg3)]
            shadow-sm
            transition
            focus-within:border-[var(--text3)]
          "
        >

          {/* File preview */}
          {pendingFile && (
            <div className="px-3 pt-3">
              <div
                className="
                  flex
                  w-fit
                  max-w-[280px]
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--bg2)]
                  px-3
                  py-2
                "
              >
                {/* File icon / spinner */}
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--bg3)]
                  "
                >
                  {documentIsBusy ? (
                    <Loader2
                      size={16}
                      className="
                        animate-spin
                        text-[var(--accent)]
                      "
                    />
                  ) : (
                    <FileText
                      size={16}
                      className="
                        text-[var(--accent)]
                      "
                    />
                  )}
                </div>

                {/* File information */}
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      text-[var(--text)]
                    "
                  >
                    {pendingFile.name}
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-[var(--text3)]
                    "
                  >
                    {pendingFile.status === "uploading"
                      ? "Uploading..."
                      : documentStatusError
                        ? "Couldn't check status"
                        : pendingDocumentStatus === DocumentStatus.failed
                          ? "Processing failed"
                          : checkingDocumentStatus
                            ? "Checking status..."
                            : pendingDocumentStatus === DocumentStatus.processing
                              ? "Processing..."
                              : "Ready to send"}
                  </p>
                </div>

                {/* Remove */}
                {pendingFile.status === "uploaded" && (
                  <button
                    type="button"
                    onClick={() => setPendingFile(null)}
                    disabled={documentIsProcessing}
                    className="
                      ml-1
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[var(--text3)]
                      transition
                      hover:bg-[var(--bg3)]
                      hover:text-[var(--text)]
                    "
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main input row */}
          <div className="flex items-end gap-2 px-3 py-3">

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Attach button */}
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={composerIsBusy}
              aria-label="Attach file"
              className="
                mb-0.5
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[var(--text2)]
                transition
                hover:bg-[var(--bg2)]
                hover:text-[var(--text)]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {composerIsBusy ? (
                <Loader2
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <Plus size={21} />
              )}
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              placeholder="Message CampusIQ AI"
              disabled={composerIsBusy}
              maxLength={MAX_AI_MESSAGE_LENGTH}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="
                max-h-40
                min-h-7
                flex-1
                resize-none
                overflow-y-auto
                bg-transparent
                py-0.5
                text-[15px]
                leading-6
                text-[var(--text)]
                outline-none
                placeholder:text-[var(--text3)]
              "
            />

            {/* Send button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={
                !input.trim() ||
                composerIsBusy ||
                documentIsNotReady
              }
              aria-label="Send message"
              className="
                mb-0.5
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[var(--text)]
                text-[var(--bg)]
                transition
                hover:opacity-80
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ArrowUp
                size={18}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="
            mt-2
            text-center
            text-[11px]
            text-[var(--text3)]
          "
        >
          CampusIQ AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}