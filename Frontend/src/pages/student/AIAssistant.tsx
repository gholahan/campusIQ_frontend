import { useState, useEffect, useRef } from 'react';
import type { AIMessage } from '@/features/ai/types';
import { AI_MESSAGES_INIT, AI_RESPONSES, AI_FALLBACK } from '@/features/ai/data/responses';

const SUGGESTIONS = ['Explain recursion simply', 'Help with integration', 'What is Big O notation?', 'Solve a quadratic equation'];

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>(AI_MESSAGES_INIT);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text?: string) => {
    const q = text ?? input;
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput(''); setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const key = Object.keys(AI_RESPONSES).find((k) => q.toLowerCase().includes(k));
    setMessages((m) => [...m, { role: 'assistant', text: key ? AI_RESPONSES[key] : AI_FALLBACK(q) }]);
    setLoading(false);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  return (
    <div className="page-enter">
      <div className="mb-7"><h1 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">AI Academic Assistant ✦</h1><p className="text-[var(--text2)] text-sm">Ask anything about your coursework — I'm here 24/7</p></div>
      <div className="flex flex-col" style={{ height: 'calc(100dvh - 160px)' }}>
        <div className="flex items-center gap-3.5 p-4 rounded-t-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px]" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))' }}>✦</div>
          <div><div className="font-bold">CampusIQ AI</div><div className="text-xs text-[var(--cgreen)]">● Always available</div></div>
          <div className="ml-auto flex gap-2"><span className="badge badge-purple">GPT-powered</span><span className="badge badge-blue">47 questions used</span></div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderTop: 'none', borderBottom: 'none' }}>
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>
              {m.role === 'assistant' && <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))' }}>✦</div>}
              <div className="ai-msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="ai-msg assistant">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))' }}>✦</div>
              <div className="ai-msg-bubble flex gap-1.5 items-center">
                {[0,1,2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent inline-block" style={{ animation: `pulse3 1.4s ease-in-out ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="p-4 rounded-b-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: 'none' }}>
          <div className="flex gap-2 flex-wrap mb-3">{SUGGESTIONS.map((s) => <button key={s} className="ai-suggestion" onClick={() => send(s)}>{s}</button>)}</div>
          <div className="flex gap-2.5 items-center">
            <input className="flex-1 bg-[var(--bg2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text3)] focus:border-[var(--accent)] transition-colors" placeholder="Ask me anything about your coursework..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
            <button className="btn-primary px-5 py-3" onClick={() => send()}>Ask ✦</button>
          </div>
        </div>
      </div>
    </div>
  );
}
