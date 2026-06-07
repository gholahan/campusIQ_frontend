import { useGetProfile } from '@/features/auth/hooks/useAuthApi';
import { STUDENT_TUTOR_CONVOS } from '@/features/chat/data/conversations';
import { STATS } from '@/features/student/constants';
import { useDashboardStats } from '@/features/student/useStudentApi';
import { Avatar } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';
import { StatCard } from './StatsCard';

const SESSIONS = [
  { title: 'Data Structures — Amara Osei', sub: 'Binary Trees & Recursion', time: 'Today, 4:00 PM', c: 'var(--cgreen)' },
  { title: 'Calculus II — Chisom Nwosu',   sub: 'Integration by Parts',     time: 'Thu, 11:00 AM',  c: 'var(--accent)' },
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useGetProfile();
  const { stats } = useDashboardStats(user?.id);

  const summarySessions = stats?.sessions.this_week ?? 0;

  const cards = STATS.map((stat) => {
    const value =
      stat.metric === 'sessions'
        ? stats?.sessions.this_week ?? '—'
        : stat.metric === 'ai'
        ? stats?.ai.questions_this_week ?? '—'
        : stat.metric === 'learning'
        ? stats?.learning.hours_this_week ?? '—'
        : stat.metric === 'tutors'
        ? stats?.tutors.active_this_week ?? '—'
        : '—';

    const delta = stat.showDelta ? stats?.sessions.delta : undefined;

    return {
      ...stat,
      value,
      delta,
    };
  });

  return (
    <div className="page-enter">
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Good morning! {user?.first_name} 👋</h1>
        <p className="text-[var(--text2)] text-sm">You have {summarySessions} sessions scheduled this week</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {cards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            icon={stat.icon}
            color={stat.color}
            value={stat.value}
            delta={stat.delta}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-[17px] text-[var(--text)]">Recommended Tutors</h2>
        <button className="btn-ghost text-[13px]" onClick={() => navigate('/student/tutors')}>View all →</button>
      </div>
      {/* <TutorGrid tutors={}/> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-[17px] text-[var(--text)]">Upcoming Sessions</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {SESSIONS.map((s, i) => (
              <div key={i} className="session-card flex items-center min-h-[64px] overflow-hidden">
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
