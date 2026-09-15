import { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode,
  FileImage,
  File as FileGeneric,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useGetDocumentById } from "../useDocumentApi";
import type { DocumentResponse, DocumentStatus } from "../types";

type FileKind =
  | "pdf"
  | "docx"
  | "doc"
  | "xlsx"
  | "csv"
  | "pptx"
  | "md"
  | "txt"
  | "code"
  | "image"
  | "other";

interface DocumentCardProps {
  documentId: string;
  onOpen?: (document: DocumentResponse) => void;
  onDownload?: (document: DocumentResponse) => void;
}

const EXT_TO_KIND: Record<string, FileKind> = {
  pdf: "pdf",
  docx: "docx",
  doc: "doc",
  xlsx: "xlsx",
  xls: "xlsx",
  csv: "csv",
  pptx: "pptx",
  ppt: "pptx",
  md: "md",
  txt: "txt",
  js: "code",
  ts: "code",
  tsx: "code",
  jsx: "code",
  py: "code",
  json: "code",
  html: "code",
  css: "code",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  svg: "image",
  webp: "image",
};

const KIND_STYLES: Record<
  FileKind,
  { icon: React.ElementType; bg: string; fg: string; label: string }
> = {
  pdf: { icon: FileText, bg: "#FBE9E7", fg: "#C1440E", label: "PDF" },
  docx: { icon: FileText, bg: "#E3EDFC", fg: "#2857C6", label: "Word" },
  doc: { icon: FileText, bg: "#E3EDFC", fg: "#2857C6", label: "Word" },
  xlsx: { icon: FileSpreadsheet, bg: "#E4F5EA", fg: "#1E7B45", label: "Excel" },
  csv: { icon: FileSpreadsheet, bg: "#E4F5EA", fg: "#1E7B45", label: "CSV" },
  pptx: { icon: Presentation, bg: "#FCEBE3", fg: "#C1440E", label: "PowerPoint" },
  md: { icon: FileText, bg: "#F0EEEA", fg: "#5C5850", label: "Markdown" },
  txt: { icon: FileText, bg: "#F0EEEA", fg: "#5C5850", label: "Text" },
  code: { icon: FileCode, bg: "#EDE9FE", fg: "#6D28D9", label: "Code" },
  image: { icon: FileImage, bg: "#FEF3E0", fg: "#B7791F", label: "Image" },
  other: { icon: FileGeneric, bg: "#F0EEEA", fg: "#5C5850", label: "File" },
};

function getKind(filename: string): FileKind {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_KIND[ext] ?? "other";
}

// NOTE: adjust to match your real DocumentStatus union — inferred from
// field naming since only the response shape was given, not the enum.
const PENDING_STATUSES = new Set<DocumentStatus>(["pending", "processing"] as DocumentStatus[]);
const FAILED_STATUSES = new Set<DocumentStatus>(["failed", "error"] as DocumentStatus[]);

export default function DocumentCard({ documentId, onOpen, onDownload }: DocumentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { document, isLoading, error } = useGetDocumentById(documentId);

  if (isLoading) {
    return (
      <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-[#E8E5DE] bg-white px-3 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EEEA]">
          <Loader2 className="h-4 w-4 animate-spin text-[#8A867D]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block h-3.5 w-32 animate-pulse rounded bg-[#F0EEEA]" />
          <span className="mt-1.5 block h-3 w-20 animate-pulse rounded bg-[#F0EEEA]" />
        </span>
      </div>
    );
  }

  if (error || !document || FAILED_STATUSES.has(document.status)) {
    return (
      <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-[#F3D6D0] bg-[#FDF6F4] px-3 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBE9E7]">
          <AlertCircle className="h-4 w-4 text-[#C1440E]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-[#2B2A27]">
            {document?.file_name ?? "Document"}
          </span>
          <span className="block truncate text-[12px] text-[#B54A34]">
            {error ? "Couldn't load this file" : "Something went wrong generating this file"}
          </span>
        </span>
      </div>
    );
  }

  const kind = getKind(document.file_name);
  const { icon: Icon, bg, fg, label } = KIND_STYLES[kind];
  const isGenerating = PENDING_STATUSES.has(document.status);
  const meta = [label, document.page_count ? `${document.page_count} pages` : null]
    .filter(Boolean)
    .join(" · ");

  const handleOpen = () => {
    if (isGenerating) return;
    if (onOpen) {
      onOpen(document);
    } else {
      window.open(document.file_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(document);
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(document.file_url);
      if (!response.ok) throw new Error("Download failed");

      const blobUrl = URL.createObjectURL(await response.blob());
      const link = window.document.createElement("a");
      link.href = blobUrl;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(document.file_url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex w-full max-w-sm items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors"
      style={{
        borderColor: hovered ? "#D8D4CB" : "#E8E5DE",
        backgroundColor: hovered ? "#FAF9F6" : "#FFFFFF",
      }}
    >
      <button
        type="button"
        onClick={handleOpen}
        disabled={isGenerating}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: bg }}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: fg }} />
          ) : (
            <Icon className="h-4 w-4" style={{ color: fg }} />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-[#2B2A27]">
            {document.file_name}
          </span>
          <span className="block truncate text-[12px] text-[#8A867D]">
            {isGenerating ? "Creating..." : meta}
          </span>
        </span>
      </button>

      {!isGenerating && (
        <button
          type="button"
          aria-label={`Download ${document.file_name}`}
          onClick={handleDownload}
          disabled={isDownloading}
          className="shrink-0 rounded-md p-1.5 text-[#8A867D] transition-colors hover:bg-[#F0EEEA] hover:text-[#2B2A27]"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}