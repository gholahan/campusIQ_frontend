import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Props {
  input: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function AIInput({ input, loading, onChange, onSend }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '24px';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  return (
    <div className="px-2 pt-3 pb-3 bg-[var(--bg)] flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[28px] focus-within:border border text-center  bg-[var(--bg3] shadow-sm px-3 py-2 focus-within:border-[var(--accent)] transition-colors">
          <div className="flex items-center gap-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              placeholder="Message CampusIQ AI"
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                    if (input.trim() && !loading) {
                      onSend();
                    }
                }
              }}
              className="flex-1 resize-none bg-transparent outline-none border-none text-[15px] leading-6 max-h-40 min-h-[20px] overflow-y-auto text-[var(--text)] placeholder:text-[var(--text3)]"
            />
            <button
              type="button"
              onClick={onSend}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-blue-900 hover:scale-105 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-[var(--text3)] text-center mt-3">
          CampusIQ AI can make mistakes. Verify important academic answers.
        </p>
      </div>
    </div>
  );
}
