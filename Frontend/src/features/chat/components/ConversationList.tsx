import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Conversation, ConvoTab } from '@/features/chat/types';
import { Avatar } from '@/shared/components/ui';

interface ConversationListProps { tabs: ConvoTab[]; basePath: string; }

export function ConversationList({ tabs, basePath }: ConversationListProps) {
  const navigate    = useNavigate();
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [search, setSearch]       = useState('');

  const current     = tabs.find((t) => t.key === activeTab)?.convos ?? [];
  const filtered    = current.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()),
  );
  const totalUnread = tabs.reduce((s, t) => s + t.convos.reduce((a, c) => a + c.unread, 0), 0);
  const tabUnread   = (key: string) =>
    tabs.find((t) => t.key === key)?.convos.reduce((s, c) => s + c.unread, 0) ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-5">
        <div>
          <h1 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">Messages</h1>
          <p className="text-[var(--text2)] text-sm">Your conversations</p>
        </div>
        {totalUnread > 0 && (
          <span className="badge badge-blue text-[13px] px-3.5 py-[5px]">{totalUnread} unread</span>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl mb-3.5 border bg-[var(--bg3)] border-[var(--border)]">
        {tabs.map((t) => {
          const u = tabUnread(t.key);
          return (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setSearch(''); }}
              className={`tab-btn flex-1 flex items-center justify-center gap-2 ${activeTab === t.key ? 'active' : ''}`}
            >
              {t.label}
              {u > 0 && <span className="chat-unread">{u}</span>}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-4 ">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[var(--text3)]">🔍</span>
        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all border
                     bg-[var(--bg3)] border-[var(--border)] text-[var(--text)]
                     focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10
                     placeholder:text-[var(--text3)]"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="card overflow-hidden p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--text2)]">
            <div className="text-4xl mb-2.5">💬</div>
            <div className="font-bold mb-1 text-[var(--text)]">No conversations found</div>
            <div className="text-sm">Try a different search term</div>
          </div>
        ) : (
          filtered.map((c, i) => (
            <div
              key={c.id}
              onClick={() => navigate(`${basePath}/${c.id}`)}
              className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg3)]"
              style={{
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                background:   c.unread > 0 ? 'rgba(6,182,212,0.04)' : 'transparent',
              }}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={c.name} color={c.color} size={48} />
                {c.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 bg-[var(--cgreen)] border-[var(--bg2)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={`text-[15px] ${c.unread > 0 ? 'font-bold text-[var(--text)]' : 'font-semibold text-[var(--text)]'}`}>
                    {c.name}
                  </span>
                  <span className={`text-xs flex-shrink-0 ml-2 ${c.unread > 0 ? 'text-[var(--accent2)]' : 'text-[var(--text3)]'}`}>
                    {c.time}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className={`text-[13px] truncate ${c.unread > 0 ? 'text-[var(--text)] font-medium' : 'text-[var(--text2)]'}`}>
                    {c.preview}
                  </span>
                  {c.unread > 0 && (
                    <span className="chat-unread flex-shrink-0 flex items-center justify-center px-1.5 min-w-[20px] h-5 rounded-[10px]">
                      {c.unread}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text3)] mt-0.5">{c.role}</div>
              </div>
              <span className="text-[var(--text3)] text-lg flex-shrink-0">›</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
