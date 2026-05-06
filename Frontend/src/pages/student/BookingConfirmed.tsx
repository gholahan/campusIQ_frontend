import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function BookingConfirmed() {
  const navigate = useNavigate();
  return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-[56px] mb-4">
        <CheckCircle
          size={56}
          strokeWidth={1.8}
          className="text-[var(--cgreen)] mb-4"
        />
      </div>
      <h2 className="font-display text-[28px] font-extrabold mb-2 text-[var(--text)]">Session Booked!</h2>
      <p className="text-[var(--text2)] mb-6">
        Your session has been confirmed. You'll receive a reminder 30 minutes before.
      </p>
      <button className="btn-primary" onClick={() => navigate('/student/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}
