import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Conversation, ChatMessage } from '@/features/chat/types';
import { THREAD_MESSAGES } from '@/features/chat/data/conversations';
import { Avatar } from '@/shared/components/ui';

interface ChatWindowProps { convo: Conversation; backPath: string; }

const AUTO_REPLIES = [
  "That's a great point!",
  'Sure, let me explain step by step.',
  'Good question — the key is...',
  "Absolutely, let's work through this.",
];

export function ChatWindow({ convo, backPath }: ChatWindowProps) {
  const navigate = useNavigate();
  const init: ChatMessage[] = THREAD_MESSAGES[convo.id] ?? [
    { id: 1, from: 'other', text: 'Hey! How can I help?', time: 'Just now' },
  ];
  const [messages, setMessages] = useState<ChatMessage[]>(init);
  const [input, setInput]       = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: m.length + 1, from: 'me', text: input, time: 'Now' }]);
    setInput('');
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setMessages((m) => [...m, { id: m.length + 1, from: 'other', text: reply, time: 'Now' }]);
    }, 1100);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="page-enter flex flex-col" style={{ height: 'calc(100dvh - 100px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 mb-0 flex-shrink-0 border-b border-[var(--border)]">
        <button
          onClick={() => navigate(backPath)}
          className="btn-ghost px-2.5 text-[18px]"
        >←</button>
        <div className="relative">
          <Avatar name={convo.name} color={convo.color} size={40} />
          {convo.online && (
            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-[var(--cgreen)] border-[var(--bg)]" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold text-[15px] text-[var(--text)]">{convo.name}</div>
          <div className={`text-xs ${convo.online ? 'text-[var(--cgreen)]' : 'text-[var(--text3)]'}`}>
            {convo.online ? '● Online' : '⚫ Offline'} · {convo.role}
          </div>
        </div>
        <div className="flex gap-1.5">
          <button className="btn-ghost text-[13px] px-3 py-1.5">📅</button>
          <button className="btn-ghost text-[13px] px-3 py-1.5">📎</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2.5 bg-[var(--bg3)]/30">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.from === 'me' ? 'sent' : 'received'}`}>
            {m.from === 'other' && <Avatar name={convo.name} color={convo.color} size={30} />}
            <div>
              <div className="msg-bubble">{m.text}</div>
              <div className="text-[11px] text-[var(--text3)] mt-1 text-right">{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2.5 items-end pt-3 flex-shrink-0 border-t border-[var(--border)]">
        <button className="btn-ghost p-2 text-base">📎</button>
        <textarea
          className="chat-input"
          rows={1}
          placeholder={`Message ${convo.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button className="btn-primary px-4 py-2.5" onClick={send}>Send</button>
      </div>
    </div>
  );
}
