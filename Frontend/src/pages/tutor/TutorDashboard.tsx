import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Stars, StatCard } from '@/shared/components/ui';
import { useGetTutorProfile } from '@/features/tutor/hooks/useTutorApi';
import { useGetTutorSessions, useDeclineSession } from '@/features/session/useSession';
import { AcceptSessionModal } from '@/features/tutor/components/AcceptSessionModal';
import { CalendarDays, Video, ArrowRight, BookOpen } from 'lucide-react';

function formatSessionSlot(scheduled_at?: { day: string; start: string; end: string } | null) {
  if (!scheduled_at?.day) return 'Schedule TBD';
  return `${scheduled_at.day} · ${scheduled_at.start}–${scheduled_at.end}`;
}

export function TutorDashboard() {
  const navigate = useNavigate();
  const { tutor } = useGetTutorProfile();
  const { sessions = [] } = useGetTutorSessions();
  const { declineSession, isPending: isDeclining } = useDeclineSession();
  const [acceptingSessionId, setAcceptingSessionId] = useState<string | null>(null);

  const pendingSessions = sessions.filter((s) => s.status === 'pending');
  const upcomingSessions = sessions.filter((s) => ['accepted', 'in_progress'].includes(s.status));

  const stats = [
    {
      label: 'Sessions Completed',
      value: tutor?.total_sessions ?? sessions.filter((s) => s.status === 'completed').length,
      icon: '📅',
      color: 'blue',
      subtext: `${upcomingSessions.length} upcoming scheduled`,
    },
    {
      label: 'Pending Requests',
      value: pendingSessions.length,
      icon: '📨',
      color: 'orange',
      subtext: `${pendingSessions.length} awaiting your response`,
    },
    {
      label: 'Hourly Rate',
      value: tutor?.hourly_rate ? `$${tutor.hourly_rate}` : '$30',
      icon: '💰',
      color: 'green',
      subtext: 'Current standard rate',
    },
    {
      label: 'Average Rating',
      value: tutor?.average_rating ? Number(tutor.average_rating).toFixed(1) : '5.0',
      icon: '⭐',
      color: 'purple',
      subtext: `From ${tutor?.review_count ?? tutor?.total_sessions ?? 0} reviews`,
    },
  ];

  return (
    <div className="page-enter px-3 sm:px-0">
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <h1 className="font-display text-[20px] sm:text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">
          Tutor Dashboard
        </h1>
        <p className="text-[var(--text2)] text-xs sm:text-sm">
          Welcome back, {tutor?.full_name || 'Tutor'}. Here is your tutoring activity overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            subtext={s.subtext}
          />
        ))}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* Column 1: Incoming Requests */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)] flex items-center gap-2">
              <span>📨</span>
              <span>Incoming Requests</span>
            </h2>
            <span className="badge badge-orange font-bold text-[11px]">
              {pendingSessions.length} new
            </span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {pendingSessions.length === 0 ? (
              <div className="session-card min-h-[140px] flex flex-col items-center justify-center text-center p-6 gap-1 flex-1">
                <div className="w-9 h-9 rounded-full bg-[var(--cgreen)]/10 text-[var(--cgreen)] flex items-center justify-center text-lg font-bold mb-1">
                  ✓
                </div>
                <div className="font-semibold text-sm text-[var(--text)]">You're all caught up</div>
                <div className="text-xs text-[var(--text2)] max-w-xs">
                  New student booking requests will appear here for you to accept or reschedule.
                </div>
              </div>
            ) : (
              pendingSessions.slice(0, 4).map((session) => {
                const studentName = session.student?.full_name || session.tutor?.full_name || 'Student';
                return (
                  <div
                    key={session.id}
                    className="session-card flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 transition-all duration-150"
                  >
                    <Avatar name={studentName} size={38} />

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs sm:text-sm text-[var(--text)] truncate">
                        {studentName}
                      </div>
                      <div className="text-xs text-[var(--text2)] mt-0.5 truncate font-medium">
                        {session.subject}
                      </div>
                      {session.notes && (
                        <div className="text-xs text-[var(--text3)] mt-0.5 line-clamp-1 italic">
                          "{session.notes}"
                        </div>
                      )}
                      <div className="text-[11px] text-[var(--text3)] mt-1">
                        {formatSessionSlot(session.scheduled_at)}
                      </div>
                    </div>

                    <div className="flex sm:flex-col flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        className="btn-primary text-xs px-3 py-1.5 flex-1 sm:flex-none"
                        onClick={() => setAcceptingSessionId(session.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-secondary text-xs px-3 py-1.5 flex-1 sm:flex-none"
                        disabled={isDeclining}
                        onClick={() => declineSession(session.id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Upcoming Schedule */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)] flex items-center gap-2">
              <CalendarDays size={18} className="text-[var(--accent)]" />
              <span>Upcoming Schedule</span>
            </h2>
            <button
              className="btn-ghost text-[12px] sm:text-[13px] cursor-pointer"
              onClick={() => navigate('/tutor/sessions')}
            >
              View all →
            </button>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {upcomingSessions.length === 0 ? (
              <div className="session-card min-h-[140px] flex flex-col items-center justify-center text-center p-6 gap-1 flex-1">
                <div className="w-9 h-9 rounded-full bg-[var(--surface2)] text-[var(--text3)] flex items-center justify-center mb-1">
                  <CalendarDays size={18} />
                </div>
                <div className="font-semibold text-sm text-[var(--text)]">No upcoming sessions</div>
                <div className="text-xs text-[var(--text2)] max-w-xs">
                  Accepted sessions will appear here with instant join links.
                </div>
              </div>
            ) : (
              upcomingSessions.slice(0, 4).map((session) => {
                const studentName = session.student?.full_name || session.tutor?.full_name || 'Student';
                return (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/tutor/sessions/${session.id}`)}
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
                        {studentName} · {formatSessionSlot(session.scheduled_at)}
                      </div>
                    </div>

                    {session.meet_link ? (
                      <a
                        href={session.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-primary text-xs px-2.5 py-1.5 flex items-center gap-1 shrink-0"
                      >
                        <Video size={13} />
                        <span>Join</span>
                      </a>
                    ) : (
                      <span className="badge badge-blue text-[11px] shrink-0 capitalize">
                        {session.status}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary Hero */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-display font-bold text-[15px] sm:text-[17px] text-[var(--text)]">
            Profile Summary
          </h2>
          <button
            className="btn-secondary text-[12px] sm:text-[13px] flex items-center gap-1 cursor-pointer"
            onClick={() => navigate('/tutor/profile')}
          >
            <span>Edit Profile</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="profile-hero p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row gap-5 items-start">
          <Avatar name={tutor?.full_name ?? ''} color="var(--accent)" size={68} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text)]">
                {tutor?.full_name || 'Tutor Name'}
              </h3>
              {tutor?.title && (
                <span className="text-xs text-[var(--text3)] font-medium">
                  · {tutor.title}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm mb-2.5">
              <Stars rating={Number(tutor?.average_rating ?? 5)} />
              <strong className="font-bold text-[var(--text)]">
                {Number(tutor?.average_rating ?? 5).toFixed(1)}
              </strong>
              <span className="text-[var(--text2)]">
                · {tutor?.total_sessions ?? 0} sessions completed
              </span>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-3">
              {tutor?.courses && tutor.courses.length > 0 ? (
                tutor.courses.map((c) => (
                  <span key={c.id || c.name} className="badge badge-blue text-xs">
                    {c.name}
                  </span>
                ))
              ) : (
                ['Computer Science', 'Data Structures', 'Algorithms'].map((c) => (
                  <span key={c} className="badge badge-blue text-xs">
                    {c}
                  </span>
                ))
              )}
            </div>

            <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed line-clamp-3">
              {tutor?.bio || 'No bio provided yet. Add your teaching style and subjects in your profile to help students find you.'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal for accepting session */}
      {acceptingSessionId && (
        <AcceptSessionModal
          sessionId={acceptingSessionId}
          onClose={() => setAcceptingSessionId(null)}
        />
      )}
    </div>
  );
}
