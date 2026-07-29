import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Stars } from '@/shared/components/ui';
import { useGetTutorProfile } from '@/features/tutor/hooks/useTutorApi';
import { useGetTutorSessions, useAcceptSession, useDeclineSession } from '@/features/session/useSession';
import { AcceptSessionModal } from '@/features/tutor/components/AcceptSessionModal';

export function TutorDashboard() {
  const { sessions: pendingSessions } = useGetTutorSessions({ status: 'pending' });
  const { declineSession, isPending: isDeclining } = useDeclineSession();
  const [acceptingSessionId, setAcceptingSessionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { tutor } = useGetTutorProfile();

  return (
    <div className="page-enter">
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">
          Tutor Dashboard
        </h1>
        <p className="text-[var(--text2)] text-sm">
          Welcome back, {tutor?.full_name}. Here's your activity overview.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Sessions This Week', value: 8, icon: '📅', color: 'blue', change: '↑ 2 from last week' },
          { label: 'Pending Requests', value: pendingSessions.length, icon: '📨', color: 'orange', change: `${pendingSessions.length} awaiting response` },
          { label: 'Total Earnings', value: '$240', icon: '💰', color: 'green', change: '↑ $40 this week' },
          { label: 'Rating', value: tutor?.average_rating ?? '—', icon: '⭐', color: 'purple', change: `From ${tutor?.total_sessions ?? 0} sessions` },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="text-[22px] mb-3">{s.icon}</div>
            <div className="font-display text-[28px] font-extrabold mb-1">{s.value}</div>
            <div className="text-[13px] text-[var(--text2)]">{s.label}</div>
            <div className="text-[12px] mt-1.5 text-[var(--cgreen)]">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-[17px] text-[var(--text)]">📨 Incoming Requests</h2>
            <span className="badge badge-orange">{pendingSessions.length} new</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {pendingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="session-card flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4">
                <Avatar name={session.tutor.full_name} size={38} />

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[var(--text)] truncate">
                    {session.tutor.full_name}
                  </div>
                  <div className="text-xs text-[var(--text2)] mt-0.5 truncate">{session.subject}</div>
                  {session.notes && (
                    <div className="text-xs text-[var(--text3)] mt-0.5 line-clamp-1">{session.notes}</div>
                  )}
                  <div className="text-[11px] text-[var(--text3)] mt-0.5">
                    {session.scheduled_at.day} • {session.scheduled_at.start}
                  </div>
                </div>

                <div className="flex sm:flex-col flex-row gap-2 w-full sm:w-auto">
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
            ))}
          </div>
        </div>
      </div>
      {/* Modal lives outside the map */}
      {acceptingSessionId && (
        <AcceptSessionModal
          sessionId={acceptingSessionId}
          onClose={() => setAcceptingSessionId(null)}
        />
      )}


                              {/* view all sessions button */}
      <div className='flex items-center justify-center'>
         <button
          className="btn-secondary mt-6 text-[13px]"
          onClick={()=>{navigate('/tutor/sessions')}}
        >
          View all Sessions
        </button>
      </div>


      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-[17px] text-[var(--text)]">Profile Summary</h2>
          <button className="btn-secondary text-[13px]" onClick={() => navigate('/tutor/profile')}>
            Edit Profile →
          </button>
        </div>
        <div className="profile-hero">
          <Avatar name={tutor?.full_name ?? ''} color="var(--accent)" size={72} />
          <div className="flex-1">
            <div className="font-display text-xl font-extrabold mb-1 text-[var(--text)]">
              {tutor?.full_name}
            </div>
            <div className="flex items-center gap-2 text-[15px]">
              <Stars rating={tutor?.average_rating ?? 0} />
              <strong>{tutor?.average_rating ?? 0}</strong>
              <span className="text-[var(--text2)]">· {tutor?.total_sessions ?? 0} sessions</span>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-2.5">
              {['Data Structures', 'Algorithms', 'CS Foundations'].map((c) => (
                <span key={c} className="badge badge-blue">{c}</span>
              ))}
            </div>
            <p className="text-sm text-[var(--text2)] mt-2">{tutor?.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}