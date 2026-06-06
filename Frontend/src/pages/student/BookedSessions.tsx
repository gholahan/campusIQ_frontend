import { useGetSessions } from '@/features/tutor/hooks/useBooking';
import type { SessionRead } from '@/features/tutor/types';
import { Avatar } from '@/shared/components/ui';
import { CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  declined: 'bg-red-100 text-red-700',
  no_show: 'bg-gray-100 text-gray-500',
};

function SessionCard({ s }: { s: SessionRead }) {
  const slot =
    s.scheduled_at
      ? `${s.scheduled_at.day} ${s.scheduled_at.start}–${s.scheduled_at.end}`
      : '—';

  return (
    <div className="card p-4 flex flex-col gap-2">
      {/* Tutor row */}
      <div className="flex items-center gap-2.5">
        <Avatar
          name={s.tutor.full_name}
          imageUrl={s.tutor.profile_picture_url}
          size={36}
        />

        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-[var(--text)] truncate">
            {s.tutor.full_name}
          </div>

          <div className="text-xs text-[var(--text2)]">
            {slot}
          </div>
        </div>

        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${
            STATUS_STYLES[s.status] ?? 'bg-gray-100 text-gray-500'
          }`}
        >
          {s.status}
        </span>
      </div>

      {/* Subject + meta */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[var(--text)]">
          {s.subject}
        </span>

        <div className="flex gap-3 text-[var(--text2)]">
          <span>{s.duration}h</span>
          <span>${s.cost}</span>
        </div>
      </div>

      {s.notes && (
        <p className="text-xs text-[var(--text3)] line-clamp-2">
          {s.notes}
        </p>
      )}

      <p className="text-[11px] text-[var(--text3)]">
        Booked {new Date(s.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  );
}

const BookedSessions = () => {
  const { sessions = [], isLoading, error } = useGetSessions();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="page-enter">Loading…</div>;
  }

  if (error) {
    return <div className="page-enter">Failed to load sessions</div>;
  }

  return (
    <div className="page-enter max-w-[600px]">
      <h1 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">
        My Sessions
      </h1>

      <p className="text-[var(--text2)] text-sm mb-6">
        {sessions.length > 0 ? `${sessions.length} session${sessions.length > 1 ? 's' : ''} total` : 'Your tutoring session history'}
      </p>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <CalendarDays size={40} className="text-[var(--text3)]" />

          <p className="font-bold text-[var(--text)]">
            No sessions yet
          </p>

          <p className="text-sm text-[var(--text2)]">
            Your booked sessions will appear here.
          </p>

          <button
            className="btn-primary mt-2"
            onClick={() => navigate('/student/tutors')}
          >
            Find a Tutor
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedSessions;