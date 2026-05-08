import { useEffect, useRef, useState } from 'react';
import type { AIMessage } from '@/features/ai/types';

import {
  AI_MESSAGES_INIT,
  AI_RESPONSES,
  AI_FALLBACK,
} from '@/features/ai/data/responses';

import {
  ArrowUp,
  Search,
  Sparkles,
} from 'lucide-react';

const SUGGESTIONS = [
  'Explain recursion simply',
  'Help with integration',
  'What is Big O notation?',
  'Solve a quadratic equation',
];

export function AIAssistant() {
  const [messages, setMessages] =
    useState<AIMessage[]>(AI_MESSAGES_INIT);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text?: string) => {
    const q = text ?? input;

    if (!q.trim() || loading) return;

    setMessages((m) => [
      ...m,
      {
        role: 'user',
        text: q,
      },
    ]);

    setInput('');
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }

    await new Promise((r) => setTimeout(r, 900));

    const key = Object.keys(AI_RESPONSES).find((k) =>
      q.toLowerCase().includes(k)
    );

    setMessages((m) => [
      ...m,
      {
        role: 'assistant',
        text: key
          ? AI_RESPONSES[key]
          : AI_FALLBACK(q),
      },
    ]);

    setLoading(false);
  };

  // auto grow textarea
  useEffect(() => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = '24px';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  // auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  return (
    <div
      className="h-full overflow-hidden flex flex-col bg-[var(--bg)]"
    >
      {/* HEADER */}
      <header
        className="
          h-14 min-h-14
          px-4
          border-b border-[var(--border)]
          flex items-center justify-between
          flex-shrink-0
          bg-[var(--bg)]
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              w-8 h-8 rounded-xl
              flex items-center justify-center
              bg-[var(--bg2)]
              border border-[var(--border)]
            "
          >
            <Sparkles size={16} />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-[var(--text)]">
              CampusIQ AI
            </div>

            <div className="text-[11px] text-[var(--text3)]">
              Free plan
            </div>
          </div>
        </div>

        {/* Search */}
        <button
          className="
            w-9 h-9 rounded-lg
            hover:bg-[var(--bg2)]
            flex items-center justify-center
            transition-colors
          "
        >
          <Search
            size={17}
            className="text-[var(--text2)]"
          />
        </button>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {!messages.length ? (
          <div
            className="
              h-full
              flex flex-col
              items-center justify-center
              px-4
            "
          >
            <h1
              className="
                text-3xl md:text-4xl
                font-semibold
                text-center
                mb-10
                tracking-[-1px]
                text-[var(--text)]
              "
            >
              How can I help you today?
            </h1>

            {/* Suggestions */}
            <div
              className="
                w-full max-w-3xl
                grid md:grid-cols-2 gap-3
              "
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="
                    text-left p-4 rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--bg2)]
                    hover:bg-[var(--bg3)]
                    transition-colors
                  "
                >
                  <div
                    className="
                      text-sm font-medium
                      text-[var(--text)]
                    "
                  >
                    {s}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="
              max-w-3xl mx-auto
              w-full px-4 py-8
            "
          >
            <div className="flex flex-col gap-8">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`
                    flex gap-4
                    ${
                      m.role === 'user'
                        ? 'justify-end'
                        : ''
                    }
                  `}
                >
                  {/* AI Avatar */}
                  {m.role === 'assistant' && (
                    <div
                      className="
                        w-8 h-8 rounded-full
                        bg-[var(--bg2)]
                        border border-[var(--border)]
                        flex items-center justify-center
                        flex-shrink-0 mt-1
                      "
                    >
                      <Sparkles size={14} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`
                      text-[15px]
                      leading-7
                      whitespace-pre-wrap
                      text-[var(--text)]
                      ${
                        m.role === 'user'
                          ? `
                            max-w-[85%]
                            rounded-3xl
                            px-5 py-3
                            bg-[var(--bg2)]
                            border border-[var(--border)]
                          `
                          : `
                            flex-1 pt-1
                          `
                      }
                    `}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-4">
                  <div
                    className="
                      w-8 h-8 rounded-full
                      bg-[var(--bg2)]
                      border border-[var(--border)]
                      flex items-center justify-center
                      flex-shrink-0
                    "
                  >
                    <Sparkles size={14} />
                  </div>

                  <div className="flex gap-1 items-center pt-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="
                          w-2 h-2 rounded-full
                          bg-[var(--text3)]
                          animate-pulse
                        "
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div
        className="
          px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)]
          bg-[var(--bg)]
          flex-shrink-0
        "
      >
        <div className="max-w-3xl mx-auto">
          {/* Suggestions above input */}
          {!!messages.length && (
            <div className="flex gap-2 overflow-x-auto mb-3 no-scrollbar">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="
                    flex-shrink-0
                    px-3 py-1.5 rounded-full
                    text-xs
                    border border-[var(--border)]
                    bg-[var(--bg2)]
                    hover:bg-[var(--bg3)]
                    transition-colors
                  "
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input shell */}
          <div
            className="
              rounded-[28px]
              border border-[var(--border)]
              bg-[var(--bg2)]
              shadow-sm
              px-4 py-3
              focus-within:border-[var(--accent)]
              transition-colors
            "
          >
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                placeholder="Message CampusIQ AI"
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="
                  flex-1 resize-none
                  bg-transparent
                  outline-none border-none
                  text-[15px]
                  leading-6
                  max-h-40
                  min-h-[24px]
                  overflow-y-auto
                  text-[var(--text)]
                  placeholder:text-[var(--text3)]
                "
              />

              <button
                onClick={() => send()}
                disabled={
                  !input.trim() || loading
                }
                className="
                  w-9 h-9 rounded-full
                  bg-white text-black
                  flex items-center justify-center
                  flex-shrink-0
                  disabled:opacity-40
                  hover:scale-105
                  transition-all
                "
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>

          <p
            className="
              text-[11px]
              text-[var(--text3)]
              text-center
              mt-3
            "
          >
            CampusIQ AI can make mistakes.
            Verify important academic answers.
          </p>
        </div>
      </div>
    </div>
  );
}