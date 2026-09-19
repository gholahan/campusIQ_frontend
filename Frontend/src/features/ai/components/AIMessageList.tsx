import { useRef, useEffect, useState, useCallback } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import type { AIMessage } from '@/features/ai/types';
import { AiChatRole } from '@/features/ai/enums';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import DocumentCard from '@/features/document/components/DocumentCard';

function normalizeLatex(content: string): string {
  return content
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => `$$${m}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, m) => `$${m}$`);
}

interface AIMessageListProps {
  messages: AIMessage[];
  loading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  pageCount: number;
  onLoadMore: () => void;
}

export function AIMessageList({ messages, loading, hasNextPage, isFetchingNextPage, pageCount, onLoadMore }: AIMessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeight = useRef(0);
  const isFirstRender = useRef(true);
  const isLoadingMore = useRef(false);
  const userHasScrolledUp = useRef(false);
  const isAutoScrolling = useRef(false);
  const prevMessageCount = useRef(0);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    isAutoScrolling.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    userHasScrolledUp.current = false;
    setShowScrollToBottom(false);
  }, []);

  // Wait for the initial message fetch before scrolling to the latest message.
  useEffect(() => {
    if (isFirstRender.current) {
      if (!messages.length) return;

      const el = scrollRef.current;
      const frame = requestAnimationFrame(() => {
        if (el) el.scrollTop = el.scrollHeight;
        isFirstRender.current = false;
        prevMessageCount.current = messages.length;
      });
      return () => cancelAnimationFrame(frame);
    }

    // Track if a new message arrived while user was scrolled up
    if (messages.length > prevMessageCount.current) {
      const el = scrollRef.current;
      if (el) {
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
        if (!isNearBottom) {
          userHasScrolledUp.current = true;
          setShowScrollToBottom(true);
        }
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages.length]);

  // Handle loading state changes (AI typing indicator)
  useEffect(() => {
    if (loading && messages.length > prevMessageCount.current) {
      // New user message appeared, don't auto-scroll
      return;
    }
  }, [loading, messages.length]);

  // Auto-scroll when loading finishes (AI finished responding)
  useEffect(() => {
    if (!loading && prevMessageCount.current > 0 && messages.length > prevMessageCount.current) {
      // AI response just arrived — only auto-scroll if user is near bottom
      const el = scrollRef.current;
      if (el) {
        const wasNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
        if (wasNearBottom) {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
          userHasScrolledUp.current = false;
          setShowScrollToBottom(false);
        }
      }
    }
    prevMessageCount.current = messages.length;
  }, [loading, messages.length]);

  // Pagination
  useEffect(() => {
    if (pageCount <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const diff = el.scrollHeight - prevScrollHeight.current;
    if (diff > 0) el.scrollTop = diff;
  }, [pageCount]);

  // Scroll listener to track user position and show/hide button
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
      if (isNearBottom) {
        userHasScrolledUp.current = false;
        setShowScrollToBottom(false);
        isAutoScrolling.current = false;
      } else if (isAutoScrolling.current) {
        return;
      } else {
        userHasScrolledUp.current = true;
        setShowScrollToBottom(true);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for pagination
  useEffect(() => {
    const node = topSentinelRef.current;
    const container = scrollRef.current;
    if (!node || !container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && userHasScrolledUp.current) {
          prevScrollHeight.current = container.scrollHeight;
          isLoadingMore.current = true;
          onLoadMore();
        }
      },
      { root: container, threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!messages.length && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 tracking-[-1px] text-[var(--text)]">
          How can I help you today?
        </h1>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden">
      <div className="max-w-3xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-8 flex flex-col gap-2 sm:gap-3">

        <div ref={topSentinelRef} />

        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 size={18} className="animate-spin text-[var(--text3)]" />
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'items-start'}`}>
            <div
              className={`text-[14px] sm:text-[15px] leading-7 text-[var(--text)] min-w-0 ${
                m.role === 'user'
                  ? 'max-w-[88%] sm:max-w-[70%] rounded-xl px-3 bg-[var(--surface2)] border border-[var(--border)]'
                  : 'flex-1 pt-1'
              }`}
            >
              {m.role === AiChatRole.User && m.document_id && (
                <DocumentCard documentId={m.document_id} />
              )}
              <div className="prose max-w-none break-words
                prose-p:text-[var(--text)] prose-headings:text-[var(--text)]
                prose-strong:text-[var(--text)] prose-em:text-[var(--text)]
                prose-li:text-[var(--text)] prose-blockquote:text-[var(--text2)]
                prose-code:text-[var(--accent)] prose-pre:text-[var(--text)]
                prose-th:text-[var(--text)] prose-td:text-[var(--text)]
                prose-a:text-[var(--accent)] hover:prose-a:text-[var(--accent2)]
                prose-p:my-3 prose-ul:my-3 prose-ol:my-3
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-pre:rounded-xl"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                  components={{
                    table({ children, ...props }) {
                      return (
                        <div className="my-4 w-full overflow-x-auto">
                          <table {...props} className="w-full border-collapse border border-[var(--border)] text-xs sm:text-sm">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    pre({ children, ...props }) {
                      return (
                        <div className="my-5 w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface2)]">
                          <pre {...props} className="p-3 sm:p-5 text-[13px] sm:text-[14px] leading-6 whitespace-pre">
                            {children}
                          </pre>
                        </div>
                      );
                    },
                    td({ children, ...props }) {
                      return (
                        <td {...props} className="border border-[var(--border)] px-2 sm:px-4 py-2 sm:py-3 text-[var(--text)] align-top">
                          {children}
                        </td>
                      );
                    },
                    th({ children, ...props }) {
                      return (
                        <th {...props} className="border border-[var(--border)] bg-[var(--surface2)] px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-[var(--text)]">
                          {children}
                        </th>
                      );
                    },
                  }}
                >
                  {normalizeLatex(m.content)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-start">
            <div className="flex gap-1 items-center pt-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-[var(--text3)] animate-pulse" />
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="
            fixed bottom-20 left-1/2 -translate-x-1/2
            z-50 flex items-center gap-2
            max-w-[calc(100vw-2rem)] px-3 sm:px-4 py-2 sm:py-2.5 rounded-full
            bg-(--surface) border border-(--border)
            shadow-lg text-xs sm:text-sm font-medium text-(--text2) whitespace-nowrap
            cursor-pointer
            hover:bg-(--bg3) hover:text-(--text) transition-all
            animate-in slide-in-from-bottom-2 fade-in duration-200
          "
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={16} />
          New messages
        </button>
      )}
    </div>
  );
}
