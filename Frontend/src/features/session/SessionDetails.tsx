import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  DollarSign,
  Loader2,
  Video,
} from "lucide-react";

import { Avatar } from "@/shared/components/ui";
import {
  useGetSession,
  useStartSession,
  useEndSession,
  useCancelSession,
  useDeclineSession,
} from "@/features/session/useSession";
import { AcceptSessionModal } from "@/features/tutor/components/AcceptSessionModal";
import type { Role } from "../auth";

const STATUS_STYLES = {
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
} as const;

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 text-[var(--text3)] shrink-0" />

      <div className="flex-1 flex items-center justify-between gap-6">
        <p className="text-sm text-[var(--text2)]">{label}</p>
        <div className="text-right text-[var(--text)] font-medium">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function SessionDetails({
  role,
}: {
  role: Role;
}) {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const { session, isLoading } = useGetSession(sessionId!);

  const { startSession, isPending: isStarting } = useStartSession();
  const { endSession, isPending: isEnding } = useEndSession();
  const { cancelSession, isPending: isCancelling } = useCancelSession();
  const { declineSession, isPending: isDeclining } = useDeclineSession();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--text)]" />
      </div>
    )
  }

  if (!session) {
    return <div className="page-enter">Session not found.</div>;
  }

  const isTutor = role === "tutor";
  const otherUser = isTutor ? session.student : session.tutor;

  const hasActions =
    (isTutor &&
      ["pending", "accepted", "in_progress"].includes(session.status)) ||
    (!isTutor &&
      (session.status === "pending" ||
        (["accepted", "in_progress"].includes(session.status) &&
          session.meet_link)));

  return (
    <div className="page-enter min-h-screen w-full max-w-4xl mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-8 pb-24 flex flex-col gap-5 bg-[var(--bg)] text-[var(--text)]">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 self-start rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text2)] transition-colors hover:bg-[var(--surface2)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}

      <div className="card p-6 sm:p-7">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-4">

            <Avatar
              name={otherUser?.full_name}
              imageUrl={otherUser?.profile_picture_url}
              size={64}
            />

            <div>

              <h1 className="font-display text-2xl font-bold text-[var(--text)]">
                {session.subject}
              </h1>

              <p className="mt-1 text-[var(--text2)]">
                {isTutor ? "Student" : "Tutor"} • {otherUser?.full_name}
              </p>

            </div>

          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm capitalize ${STATUS_STYLES[session.status]}`}
          >
            {session.status.replace("_", " ")}
          </span>

        </div>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Details */}

        <div className="card p-5 sm:p-6 space-y-5">

          <h2 className="font-semibold text-[var(--text)]">
            Session Details
          </h2>

          <InfoRow
            icon={CalendarDays}
            label="Date"
            value={session.scheduled_at.day}
          />

          <InfoRow
            icon={Clock3}
            label="Time"
            value={`${session.scheduled_at.start} – ${session.scheduled_at.end}`}
          />

          <InfoRow
            icon={BookOpen}
            label="Duration"
            value={`${session.duration} hour${session.duration > 1 ? "s" : ""}`}
          />

          <InfoRow
            icon={DollarSign}
            label="Cost"
            value={`$${session.cost}`}
          />

        </div>
        {/* Notes */}
        <div className="card p-5 sm:p-6">

          <h2 className="mb-5 font-semibold text-[var(--text)]">
            Notes
          </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text2)]">
                {session.notes || "No additional notes were provided."}
              </p>
          </div>

        {/* Meeting */}

        <div className="card p-5 sm:p-6">

          <h2 className="mb-5 font-semibold text-[var(--text)]">
            Meeting
          </h2>

          {session.meet_link ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-[var(--surface)] p-2">
                  <Video size={18} className="text-[var(--accent)]" />
                </div>

                <div className="flex-1">

                  <p className="font-medium text-[var(--text)]">
                    Google Meet
                  </p>

                  <p className="text-sm text-[var(--text2)]">
                    Join the online tutoring session.
                  </p>

                </div>

              </div>

              <a
                href={session.meet_link}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-5 inline-flex"
              >
                Join Meeting
              </a>

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-5 text-center">

              <Video
                size={22}
                className="mx-auto mb-3 text-[var(--text3)]"
              />

              <p className="font-medium text-[var(--text)]">
                No meeting link yet
              </p>

              <p className="mt-1 text-sm text-[var(--text2)]">
                {isTutor
                  ? "Add one when accepting the session."
                  : "Your tutor will provide a meeting link after accepting."}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* Actions */}

      {hasActions && (
        <div className="card p-5 sm:p-6">

          <h2 className="mb-2 font-semibold text-[var(--text)]">
            Actions
          </h2>

          <p className="mb-5 text-sm text-[var(--text2)]">
            {isTutor && session.status === "pending" &&
              "Respond to this booking request."}

            {isTutor && session.status === "accepted" &&
              "Start the tutoring session when you're ready."}

            {isTutor && session.status === "in_progress" &&
              "End the session after it has concluded."}

            {!isTutor && session.status === "pending" &&
              "You may cancel this request before it is accepted."}

            {!isTutor &&
              ["accepted", "in_progress"].includes(session.status) &&
              "Join the meeting when it's time."}
          </p>

          <div className="flex flex-wrap gap-3">

            {isTutor && session.status === "pending" && (
              <>
                <button
                  className="btn-primary"
                  onClick={() => setShowAcceptModal(true)}
                >
                  Accept Request
                </button>

                <button
                  className="btn-secondary"
                  disabled={isDeclining}
                  onClick={() => declineSession(session.id)}
                >
                  {isDeclining ? "Declining..." : "Decline"}
                </button>
              </>
            )}

            {isTutor && session.status === "accepted" && (
              <button
                className="btn-primary"
                disabled={isStarting}
                onClick={() => startSession(session.id)}
              >
                {isStarting ? "Starting..." : "Start Session"}
              </button>
            )}

            {isTutor && session.status === "in_progress" && (
              <button
                className="btn-primary"
                disabled={isEnding}
                onClick={() => endSession(session.id)}
              >
                {isEnding ? "Ending..." : "Mark Completed"}
              </button>
            )}

            {!isTutor && session.status === "pending" && (
              <button
                className="btn-secondary"
                disabled={isCancelling}
                onClick={() => cancelSession(session.id)}
              >
                {isCancelling ? "Cancelling..." : "Cancel Request"}
              </button>
            )}

            {!isTutor &&
              ["accepted", "in_progress"].includes(session.status) &&
              session.meet_link && (
                <a
                  href={session.meet_link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Join Session
                </a>
              )}

            {!isTutor && session.status === "in_progress" && (
              <button
                className="btn-secondary"
                disabled={isEnding}
                onClick={() => endSession(session.id)}
              >
                {isEnding ? "Ending..." : "End Session"}
              </button>
            )}

          </div>

        </div>
      )}

      {showAcceptModal && (
        <AcceptSessionModal
          sessionId={session.id}
          onClose={() => setShowAcceptModal(false)}
        />
      )}

    </div>
  );
}