import { useGetProfile } from '@/features/auth/hooks/useAuthApi';
import { STATS } from '@/features/student/constants';
import { useDashboardStats } from '@/features/student/useStudentApi';
import { useGetStudentSessions } from '@/features/session/useSession';
import TutorGrid from '@/features/tutor/components/TutorGrid';
import { useSearchTutors } from '@/features/tutor/hooks/useTutorApi';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/shared/components/ui';
import { Sparkles, CalendarDays, Search, ArrowRight, BookOpen } from 'lucide-react';

function formatSessionSlot(scheduled_at?: { day: string; start: string; end: string }) {
  if (!scheduled_at) return 'TBD';
  return `${scheduled_at.day} · ${scheduled_at.start}–${scheduled_at.end}`;
}

function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getSessionSortKey(session: { scheduled_at?: { day: string }; created_at: string }) {
  if (session.scheduled_at?.day) {
    const parsed = Date.parse(session.scheduled_at.day);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const fallback = Date.parse(session.created_at);
  return Number.isNaN(fallback) ? Number.POSITIVE_INFINITY : fallback;
}

const STATUS_BADGES: Record<string, string> = {
  pending: 'badge-orange',
  accepted: 'badge-blue',
  in_progress: 'badge-purple',
  completed: 'badge-green',
  cancelled: 'text-[var(--cred)] bg-[var(--cred)]/10',
  declined: 'text-[var(--cred)] bg-[var(--cred)]/10',
};

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useGetProfile();
  const { stats } = useDashboardStats(user?.id);
  const { sessions = [] } = useGetStudentSessions();
  const { tutors, isLoading: tutorsLoading } = useSearchTutors({
    order_by: 'average_rating',
    order_dir: 'desc',
    limit: 3,
  });

  const summarySessions = stats?.sessions.this_week ?? 0;
  const greeting = getTimeGreeting();
  const aiQuestionsThisWeek = stats?.ai.questions_this_week ?? 0;
  const aiCreditsPercent = Math.min((aiQuestionsThisWeek / 30) * 100, 100);

  const upcomingSessions = sessions
    .filter((session) => ['pending', 'accepted'].includes(session.status))
    .sort((a, b) => getSessionSortKey(a) - getSessionSortKey(b))
    .slice(0, 3);

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
    return { ...stat, value, delta };
  });

  return (
    <div className="page-enter px-3 sm:px-0">
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <h1 className="font-display text-[20px] sm:text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">
          {greeting}, {user?.first_name || 'Student'}! 👋
        </h1>
        <p className="text-[var(--text2)] text-xs sm:text-sm">
          You have {summarySessions} session{summarySessions === 1 ? '' : 's'} scheduled this week
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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

      {/* Recommended Tutors Section */}
      <div className="mb-7 sm:mb-9">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)]">
              Recommended Tutors
            </h2>
            <p className="text-xs text-[var(--text2)] hidden sm:block">
              Top-rated subject experts ready for 1-on-1 guidance
            </p>
          </div>
          <button
            className="btn-ghost text-[12px] sm:text-[13px] flex items-center gap-1 cursor-pointer"
            onClick={() => navigate('/student/tutors')}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {tutorsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="tutor-card h-48 animate-pulse bg-[var(--surface2)]" />
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <TutorGrid tutors={tutors} />
        ) : (
          <div className="session-card flex flex-col items-start gap-3 py-6">
            <div>
              <div className="font-semibold text-sm text-[var(--text)]">No tutors available yet</div>
              <div className="text-xs text-[var(--text2)] mt-1">
                Try browsing the tutor directory to find your next study partner.
              </div>
            </div>
            <button className="btn-secondary text-xs" onClick={() => navigate('/student/tutors')}>
              Browse tutors
            </button>
          </div>
        )}
      </div>

      {/* Bottom 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Column 1: Upcoming Sessions */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)] flex items-center gap-2">
              <CalendarDays size={18} className="text-[var(--accent)]" />
              <span>Upcoming Sessions</span>
            </h2>
            <button
              className="btn-ghost text-[12px] sm:text-[13px] cursor-pointer"
              onClick={() => navigate('/student/sessions')}
            >
              View all →
            </button>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {upcomingSessions.length === 0 ? (
              <div className="session-card flex flex-col items-center justify-center text-center py-8 px-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[var(--text3)] mb-2">
                  <CalendarDays size={20} />
                </div>
                <div className="font-semibold text-sm text-[var(--text)]">No upcoming sessions</div>
                <div className="text-xs text-[var(--text2)] max-w-xs mt-1 mb-3">
                  Book a session with a tutor to prepare for upcoming exams or assignments.
                </div>
                <button
                  className="btn-secondary text-xs px-3 py-1.5"
                  onClick={() => navigate('/student/tutors')}
                >
                  Find a Tutor
                </button>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/student/sessions/${session.id}`)}
                  className="session-card flex items-center gap-3 p-3.5 transition-all duration-150 hover:bg-[var(--surface2)] cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-sm shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm text-[var(--text)] truncate">
                      {session.subject}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-[var(--text2)] truncate">
                      {session.tutor.full_name} · {formatSessionSlot(session.scheduled_at)}
                    </div>
                  </div>
                  <span
                    className={`badge ${STATUS_BADGES[session.status] || 'badge-blue'} text-[11px] shrink-0 capitalize`}
                  >
                    {session.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: AI Study Companion & Quick Hub */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)] flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--accent)]" />
              <span>AI Study Companion</span>
            </h2>
            <button
              className="btn-ghost text-[12px] sm:text-[13px] cursor-pointer"
              onClick={() => navigate('/student/ai')}
            >
              Open AI →
            </button>
          </div>

          <div className="session-card flex flex-col justify-between p-4 sm:p-5 flex-1 relative overflow-hidden bg-gradient-to-br from-[var(--surface)] to-[var(--surface2)]">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text)] mb-1">
                    Instant Homework & Concept Help
                  </h3>
                  <p className="text-xs text-[var(--text2)] leading-relaxed">
                    Ask CampusIQ AI anything from complex algorithms to debugging and study summaries.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
              </div>

              {/* Credit usage bar */}
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-[var(--text2)]">Weekly AI Questions</span>
                  <span className="text-[var(--text)] font-bold">
                    {aiQuestionsThisWeek} <span className="text-[var(--text3)] font-normal">/ 30 used</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface2)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] transition-all duration-300"
                    style={{ width: `${aiCreditsPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
                onClick={() => navigate('/student/ai')}
              >
                <Sparkles size={13} />
                <span>Ask AI Tutor</span>
              </button>
              <button
                className="btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
                onClick={() => navigate('/student/tutors')}
              >
                <Search size={13} />
                <span>Find a Tutor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
