import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronDown, Loader2 } from "lucide-react";
import { Avatar } from "@/shared/components/ui";
import { AcceptSessionModal } from '@/features/tutor/components/AcceptSessionModal';
import { useGetTutorSessions, useDeclineSession } from "@/features/session/useSession";
import type { SessionRead, SessionStatus } from "@/features/session/types";

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

const STATUS_OPTIONS: { label: string; value: SessionStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Declined", value: "declined" },
  { label: "No Show", value: "no_show" },
];

type TutorSessionCardProps = {
  session: SessionRead;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  isDeclining: boolean;
};

function TutorSessionCard({
  session,
  onAccept,
  onDecline,
  isDeclining,
}: TutorSessionCardProps) {
  const slot = session.scheduled_at
    ? `${session.scheduled_at.day} • ${session.scheduled_at.start}–${session.scheduled_at.end}`
    : "Not scheduled";
  const navigate = useNavigate();
  return (
    <div onClick={() =>navigate(`/tutor/sessions/${session.id}`)} className="card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 transition-colors hover:bg-[var(--surface2)]">
      <div className="flex items-start gap-3">
        <Avatar
          name={session?.student?.full_name}
          imageUrl={session?.student?.profile_picture_url}
          size={40}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[var(--text)] truncate">
              {session?.student?.full_name}
            </h3>

            <span
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[session.status]}`}
            >
              {session.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-sm font-medium text-[var(--text)] mt-1">
            {session.subject}
          </p>

          <p className="text-sm text-[var(--text2)] mt-1">{slot}</p>

          {session.notes && (
            <p className="text-sm text-[var(--text3)] mt-2 line-clamp-2">
              {session.notes}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-[var(--text2)]">
          {session.duration} hr • ${session.cost}
        </div>

        {session.status === "pending" ? (
          <div className="flex gap-2">
            <button
              className="btn-primary px-4 py-2 text-sm"
              onClick={() => onAccept(session.id)}
            >
              Accept
            </button>

            <button
              className="btn-secondary px-4 py-2 text-sm"
              disabled={isDeclining}
              onClick={() => onDecline(session.id)}
            >
              Decline
            </button>
          </div>
        ) : (
          <p className="text-xs text-[var(--text3)]">
            Booked{" "}
            {new Date(session.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TutorSessions() {
  const navigate = useNavigate();

  const [status, setStatus] = useState<SessionStatus | "">("");
  const [acceptingSessionId, setAcceptingSessionId] = useState<string | null>(
    null
  );

  const { sessions = [], isLoading, error } = useGetTutorSessions(
    status ? { status } : {}
  );

  const { mutate: declineSession, isPending: isDeclining } = useDeclineSession();

  if (isLoading) {
    return (
      <div className="flex  items-center justify-center ">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--text)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter text-[var(--cred)]">
        Failed to load sessions.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[780px] mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-8 pb-24">
      <h1 className="font-display text-[26px] font-extrabold mb-2 text-[var(--text)]">
        Tutor Sessions
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-[var(--text2)]">
          {sessions.length > 0
            ? `${sessions.length} session${sessions.length > 1 ? "s" : ""}`
            : "Manage your tutoring requests"}
        </p>

        <div className="relative">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as SessionStatus | "")
            }
            className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none"
          />
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <CalendarDays
            size={40}
            className="text-[var(--text3)]"
          />

          <p className="font-semibold text-[var(--text)]">
            {status
              ? `No ${status.replace("_", " ")} sessions`
              : "No sessions yet"}
          </p>

          <p className="text-sm text-[var(--text2)]">
            {status
              ? "Try another filter."
              : "Session requests will appear here."}
          </p>

          {!status && (
            <button
              className="btn-primary mt-2"
              onClick={() => navigate("/tutor/dashboard")}
            >
              Back to Dashboard
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <TutorSessionCard
              key={session.id}
              session={session}
              onAccept={setAcceptingSessionId}
              onDecline={(id) => declineSession(id)}
              isDeclining={isDeclining}
            />
          ))}
        </div>
      )}

      {acceptingSessionId && (
        <AcceptSessionModal
          sessionId={acceptingSessionId}
          onClose={() => setAcceptingSessionId(null)}
        />
      )}
    </div>
  );
}