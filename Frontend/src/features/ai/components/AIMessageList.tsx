import { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { AIMessage } from '@/features/ai/types';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

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

  useEffect(() => {
    if (isLoadingMore.current) { isLoadingMore.current = false; return; }
    if (isFirstRender.current) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      isFirstRender.current = false;
      return;
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  useEffect(() => {
    if (pageCount <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const diff = el.scrollHeight - prevScrollHeight.current;
    if (diff > 0) el.scrollTop = diff;
  }, [pageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastScrollTop = el.scrollTop;
    const onScroll = () => {
      const current = el.scrollTop;
      if (current < lastScrollTop) userHasScrolledUp.current = true;
      if (el.scrollHeight - current - el.clientHeight < 100) userHasScrolledUp.current = false;
      lastScrollTop = current;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

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
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10 tracking-[-1px] text-[var(--text)]">
          How can I help you today?
        </h1>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-3">

        <div ref={topSentinelRef} />

        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 size={18} className="animate-spin text-[var(--text3)]" />
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'items-start'}`}>
            {/* {m.role === 'assistant' && <AssistantAvatar />} */}
            <div
              className={`text-[15px] leading-7 text-[var(--text)] min-w-0 ${
                m.role === 'user'
                  ? 'max-w-[70%] rounded-xl px-3 bg-[var(--surface2)] border border-[var(--border)]'
                  : 'flex-1 pt-1'
              }`}
            >
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
                  rehypePlugins={[rehypeHighlight, rehypeKatex]}
                  components={{
                    table({ children, ...props }) {
                      return (
                        <div className="my-4 w-full overflow-x-auto">
                          <table {...props} className="w-full border-collapse border border-[var(--border)] text-sm">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    pre({ children, ...props }) {
                      return (
                        <div className="my-5 w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface2)]">
                          <pre {...props} className="p-5 text-[14px] leading-6 whitespace-pre">
                            {children}
                          </pre>
                        </div>
                      );
                    },
                    td({ children, ...props }) {
                      return (
                        <td {...props} className="border border-[var(--border)] px-4 py-3 text-[var(--text)] align-top">
                          {children}
                        </td>
                      );
                    },
                    th({ children, ...props }) {
                      return (
                        <th {...props} className="border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-left font-medium text-[var(--text)]">
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
    </div>
  );
}