import { useState } from 'react';
import { useGetStudentSessions } from '@/features/session/useSession';
import type { SessionRead, SessionStatus } from '@/features/session/types';
import { Avatar } from '@/shared/components/ui';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
// import {Navigate} from "react-router-dom";

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-[var(--surface2)] text-[var(--corange)] border border-[var(--border)]",

  accepted:
    "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]",

  in_progress:
    "bg-[var(--surface2)] text-[var(--cpurple)] border border-[var(--border)]",

  completed:
    "bg-[var(--surface2)] text-[var(--cgreen)] border border-[var(--border)]",

  cancelled:
    "bg-[var(--surface2)] text-[var(--cred)] border border-[var(--border)]",

  declined:
    "bg-[var(--surface2)] text-[var(--cred)] border border-[var(--border)]",

  no_show:
    "bg-[var(--surface2)] text-[var(--text3)] border border-[var(--border)]",
};

const STATUS_OPTIONS: { label: string; value: SessionStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Declined', value: 'declined' },
  { label: 'No Show', value: 'no_show' },
];

function SessionCard({ s }: { s: SessionRead }) {
  const navigate = useNavigate();
  const slot = s.scheduled_at
    ? `${s.scheduled_at.day} ${s.scheduled_at.start}–${s.scheduled_at.end}`
    : '—';

  return (
        <div className="
        card
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-5
        transition-colors
        hover:bg-[var(--surface2)]"
        onClick={() => navigate(`/student/sessions/${s.id}`)}
       >
        <div className="flex items-center gap-2.5">
        <Avatar name={s.tutor.full_name} imageUrl={s.tutor.profile_picture_url} size={36} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-[var(--text)] truncate">{s.tutor.full_name}</div>
          <div className="text-xs text-[var(--text2)]">{slot}</div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
          {s.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[var(--text)]">{s.subject}</span>
        <div className="flex gap-3 text-[var(--text2)]">
          <span>{s.duration}h</span>
          <span>${s.cost}</span>
        </div>
      </div>
      {s.notes && <p className="text-xs text-[var(--text3)] line-clamp-2">{s.notes}</p>}
      <p className="text-[11px] text-[var(--text3)]">
        Booked {new Date(s.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  );
}

const BookedSessions = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SessionStatus | ''>('');

  const { sessions = [], isLoading, error } = useGetStudentSessions(
    status ? { status } : {}
  );

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
      <Loader2 className="h-12 w-12 animate-spin text-[var(--text)]" />
    </div>
  );
  if (error) return <div className="page-enter">Failed to load sessions</div>;

  return (
    <div className="page-enter max-w-[600px]">
      <h1 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">
        My Sessions
      </h1>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[var(--text2)] text-sm">
          {sessions.length > 0
            ? `${sessions.length} session${sessions.length > 1 ? 's' : ''}`
            : 'Your tutoring session history'}
        </p>

        {/* Dropdown */}
        <div className="relative mr-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SessionStatus | '')}
            className="
            appearance-none
            pl-3 pr-8 py-2
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            text-[var(--text)]
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent)]
            "          
            >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" />
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <CalendarDays size={40} className="text-[var(--text3)]" />
          <p className="font-bold text-[var(--text)]">
            {status ? `No ${status.replace('_', ' ')} sessions` : 'No sessions yet'}
          </p>
          <p className="text-sm text-[var(--text2)]">
            {status ? 'Try a different filter.' : 'Your booked sessions will appear here.'}
          </p>
          {!status && (
            <button className="btn-primary mt-2" onClick={() => navigate('/student/tutors')}>
              Find a Tutor
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => <SessionCard key={s.id} s={s} />)}
        </div>
      )}
    </div>
  );
};

export default BookedSessions;