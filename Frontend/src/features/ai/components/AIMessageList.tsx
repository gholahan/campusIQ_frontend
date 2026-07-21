import { useRef, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
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

  // auto-scroll to bottom on new messages only
  useEffect(() => {
    if (isLoadingMore.current) {
      isLoadingMore.current = false;
      return;
    }
    if (isFirstRender.current) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      isFirstRender.current = false;
      return;
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  // restore scroll position after older page prepends
  useEffect(() => {
    if (pageCount <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const diff = el.scrollHeight - prevScrollHeight.current;
    if (diff > 0) el.scrollTop = diff;
  }, [pageCount]);

  // track user scroll direction
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastScrollTop = el.scrollTop;
    const onScroll = () => {
      const current = el.scrollTop;
      if (current < lastScrollTop) userHasScrolledUp.current = true;
      // reset when user scrolls back near bottom
      if (el.scrollHeight - current - el.clientHeight < 100) userHasScrolledUp.current = false;
      lastScrollTop = current;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // intersection observer — only fires after user has scrolled up
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
    <div ref={scrollRef} className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-3">

        <div ref={topSentinelRef} />

        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 size={18} className="animate-spin text-[var(--text3)]" />
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-1 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={14} />
              </div>
            )}
            <div
              className={`text-[15px] leading-7 text-[var(--text)] ${
                m.role === 'user'
                  ? 'max-w-[70%] rounded-2xl px-3 py-1 bg-[var(--bg2)] border border-[var(--border)]'
                  : 'flex-1 pt-1'
              }`}
            >
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeHighlight, rehypeKatex]}
                >
                  {normalizeLatex(m.content)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} />
            </div>
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
