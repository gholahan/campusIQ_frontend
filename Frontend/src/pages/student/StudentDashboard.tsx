import { useGetProfile } from '@/features/auth/hooks/useAuthApi';
import { STUDENT_TUTOR_CONVOS } from '@/features/chat/data/conversations';
import { STATS } from '@/features/student/constants';
import { useDashboardStats } from '@/features/student/useStudentApi';
import { useGetStudentSessions } from '@/features/session/useSession';
import { Avatar } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';
import { StatCard } from './StatsCard';

function formatSessionSlot(scheduled_at?: { day: string; start: string; end: string }) {
  if (!scheduled_at) return 'TBD';
  return `${scheduled_at.day} · ${scheduled_at.start}–${scheduled_at.end}`;
}

function getSessionSortKey(session: { scheduled_at?: { day: string }; created_at: string }) {
  if (session.scheduled_at?.day) {
    const parsed = Date.parse(session.scheduled_at.day);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const fallback = Date.parse(session.created_at);
  return Number.isNaN(fallback) ? Number.POSITIVE_INFINITY : fallback;
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useGetProfile();
  const { stats } = useDashboardStats(user?.id);
  const { sessions = [] } = useGetStudentSessions();

  const summarySessions = stats?.sessions.this_week ?? 0;

  const upcomingSessions = sessions
    .filter((session) => ['pending', 'accepted'].includes(session.status))
    .sort((a, b) => getSessionSortKey(a) - getSessionSortKey(b))
    .slice(0, 3);

  const cards = STATS.map((stat) => {
    const value =
      stat.metric === 'sessions' ? stats?.sessions.this_week ?? '—'
      : stat.metric === 'ai' ? stats?.ai.questions_this_week ?? '—'
      : stat.metric === 'learning' ? stats?.learning.hours_this_week ?? '—'
      : stat.metric === 'tutors' ? stats?.tutors.active_this_week ?? '—'
      : '—';
    const delta = stat.showDelta ? stats?.sessions.delta : undefined;
    return { ...stat, value, delta };
  });

  return (
    <div className="page-enter px-3 sm:px-0">
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <h1 className="font-display text-[20px] sm:text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">
          Good morning, {user?.first_name}! 👋
        </h1>
        <p className="text-[var(--text2)] text-xs sm:text-sm">
          You have {summarySessions} sessions scheduled this week
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-7">
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

      {/* Recommended Tutors */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)]">
          Recommended Tutors
        </h2>
        <button className="btn-ghost text-[12px] sm:text-[13px]" onClick={() => navigate('/student/tutors')}>
          View all →
        </button>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Sessions */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)]">
              Upcoming Sessions
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {upcomingSessions.length === 0 ? (
              <div className="session-card flex items-center min-h-[60px] sm:min-h-[64px]">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[var(--text)]">No upcoming sessions</div>
                  <div className="text-[11px] sm:text-[12px] text-[var(--text2)]">
                    Check back once your booking is confirmed.
                  </div>
                </div>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="session-card flex items-center gap-3 min-h-[60px] sm:min-h-[64px]">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">
                      {session.subject} — {session.tutor.full_name}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-[var(--text2)] truncate">
                      {formatSessionSlot(session.scheduled_at)}
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-[var(--text3)] shrink-0 capitalize">
                    {session.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Chats */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)]">
              Recent Chats
            </h2>
            <button className="btn-ghost text-[12px] sm:text-[13px]" onClick={() => navigate('/student/chat')}>
              Open Chat →
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {STUDENT_TUTOR_CONVOS.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="session-card cursor-pointer flex items-center gap-3"
                onClick={() => navigate('/student/chat')}
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={c.name} color={c.color} size={34} />
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 bg-[var(--cgreen)] border-[var(--surface)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm text-[var(--text)] truncate">{c.name}</div>
                  <div className="text-[11px] sm:text-[12px] text-[var(--text2)] truncate">{c.preview}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] sm:text-[12px] text-[var(--text3)]">{c.time}</div>
                  {c.unread > 0 && (
                    <span className="chat-unread mt-1 inline-block">{c.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
