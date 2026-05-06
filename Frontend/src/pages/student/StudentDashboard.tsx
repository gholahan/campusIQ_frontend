import { useNavigate } from 'react-router-dom';
import { TUTORS } from '@/shared/data/tutors';
import { STUDENT_TUTOR_CONVOS } from '@/features/chat/data/conversations';
import { Avatar, Stars } from '@/shared/components/ui';

const STATS = [
  { label: 'Sessions This Week', value: 2,   icon: '📅', color: 'blue',   change: '+1 from last week' },
  { label: 'AI Questions Asked', value: 47,  icon: '✦',  color: 'purple', change: '53 remaining' },
  { label: 'Hours Learned',      value: 8.5, icon: '⏱',  color: 'green',  change: '↑ 2h from last week' },
  { label: 'Active Tutors',      value: 3,   icon: '👥', color: 'orange', change: 'All responding' },
];
const SESSIONS = [
  { title: 'Data Structures — Amara Osei', sub: 'Binary Trees & Recursion', time: 'Today, 4:00 PM', c: 'var(--cgreen)' },
  { title: 'Calculus II — Chisom Nwosu',   sub: 'Integration by Parts',     time: 'Thu, 11:00 AM',  c: 'var(--accent)' },
];

export function StudentDashboard() {
  const navigate = useNavigate();
  return (
    <div className="page-enter">
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Good morning, Sam! 👋</h1>
        <p className="text-[var(--text2)] text-sm">You have 2 sessions scheduled this week</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {STATS.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="text-[22px] mb-3">{s.icon}</div>
            <div className="font-display text-[28px] font-extrabold mb-1 text-[var(--text)]">{s.value}</div>
            <div className="text-[13px] text-[var(--text2)]">{s.label}</div>
            <div className="text-[12px] mt-1.5 text-[var(--cgreen)]">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-[17px] text-[var(--text)]">Recommended Tutors</h2>
        <button className="btn-ghost text-[13px]" onClick={() => navigate('/student/tutors')}>View all →</button>
      </div>
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
        {TUTORS.slice(0, 4).map((t) => (
          <div key={t.id} className="tutor-card cursor-pointer" onClick={() => navigate(`/student/tutors/${t.id}`)}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={t.name} color={t.color} initials={t.initials} size={42} />
              <div className="flex-1">
                <div className="font-bold text-[15px] text-[var(--text)]">{t.name}</div>
                <div className="flex items-center gap-1 text-[13px]"><Stars rating={t.rating} /><span className="text-[var(--text2)]">{t.rating}</span></div>
              </div>
              {t.online && <span className="badge badge-green">● Online</span>}
            </div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {t.courses.map((c) => <span key={c} className="badge badge-blue">{c}</span>)}
            </div>
            <div className="flex gap-4 text-[12px] text-[var(--text3)] mb-3"><span>📚 {t.sessions} sessions</span><span>⭐ {t.reviews} reviews</span></div>
            <button className="btn-primary w-full justify-center text-[13px]">Request Session</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-[17px] text-[var(--text)]">Upcoming Sessions</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {SESSIONS.map((s, i) => (
              <div className="session-card flex items-center min-h-[64px] overflow-hidden">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{s.title}</div>
                  <div className="text-[12px] text-[var(--text2)] truncate">{s.sub}</div>
                </div>
                <div className="text-[12px] text-[var(--text3)] shrink-0">
                  {s.time}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-[17px] text-[var(--text)]">Recent Chats</h2>
            <button className="btn-ghost text-[13px]" onClick={() => navigate('/student/chat')}>Open Chat →</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {STUDENT_TUTOR_CONVOS.slice(0, 3).map((c) => (
              <div key={c.id} className="session-card cursor-pointer overflow-hidden" onClick={() => navigate('/student/chat')}>
                <div className="relative">
                  <Avatar name={c.name} color={c.color} size={36} />
                  {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 bg-[var(--cgreen)] border-[var(--surface)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[var(--text)]">{c.name}</div>
                  <div className="text-[12px] text-[var(--text2)] truncate">{c.preview}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[12px] text-[var(--text3)]">{c.time}</div>
                  {c.unread > 0 && <span className="chat-unread mt-1 inline-block">{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
