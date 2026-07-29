// AcceptModal.tsx
import { useState } from 'react';
import { useAcceptSession } from '@/features/session/useSession';

interface AcceptModalProps {
  sessionId: string;
  onClose: () => void;
}

export function AcceptSessionModal({ sessionId, onClose }: AcceptModalProps) {
  const [meetLink, setMeetLink] = useState('');
  const { acceptSession, isPending } = useAcceptSession();

  const handleConfirm = async () => {
    if (!meetLink.trim()) return;
    await acceptSession({ id: sessionId, payload: { meet_link: meetLink.trim() } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-[var(--surface)] rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-display font-bold text-[var(--text)] text-lg mb-1">Accept Session</h3>
        <p className="text-sm text-[var(--text2)] mb-4">
          Paste your Google Meet link. Go to{' '}
          <a href="https://meet.new" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-bold ">
            meet.new
          </a>{' '}
          to create one instantly.
        </p>

        <input
          type="url"
          value={meetLink}
          onChange={(e) => setMeetLink(e.target.value)}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          className="input w-full mb-4 border-2 border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 py-2 px-2 rounded-lg text-[var(--text)] placeholder:text-[var(--text3)]"
        />

        <div className="flex gap-2">
          <button className="btn-secondary flex-1" onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button
            className="btn-primary flex-1"
            onClick={handleConfirm}
            disabled={isPending || !meetLink.trim()}
          >
            {isPending ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}