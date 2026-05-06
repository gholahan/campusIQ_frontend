import { useNavigate, useParams } from 'react-router-dom';
import { TUTORS } from '@/shared/data/tutors';
import { Avatar, Stars } from '@/shared/components/ui';

const REVIEWS = [
  { name: 'Tunde B.',  text: 'Explained binary trees so clearly. Highly recommend!', rating: 5, color: 'var(--accent)' },
  { name: 'Adaeze N.', text: 'Very patient and thorough. Helped me pass my exam!',   rating: 5, color: 'var(--cgreen)' },
  { name: 'Emeka O.',  text: 'Great teacher. Always on time and well-prepared.',      rating: 4, color: 'var(--cpurple)' },
];

export function TutorProfileView() {
  const navigate = useNavigate();
  const { tutorId } = useParams<{ tutorId: string }>();
  const tutor = TUTORS.find((t) => t.id === Number(tutorId));
  if (!tutor) return (
    <div className="text-center py-16 text-[var(--text2)]">
      Tutor not found.{' '}<span className="text-[var(--accent2)] cursor-pointer" onClick={() => navigate('/student/tutors')}>Go back</span>
    </div>
  );
  return (
    <div className="page-enter">
      <button className="btn-ghost mb-5" onClick={() => navigate('/student/tutors')}>← Back to search</button>
      <div className="grid gap-6 tutor-profile-grid">
        <div>
          <div className="profile-hero">
            <Avatar name={tutor.name} color={tutor.color} initials={tutor.initials} size={80} />
            <div className="flex-1">
              <div className="font-display text-2xl font-extrabold mb-1 text-[var(--text)]">{tutor.name}</div>
              <div className="flex items-center gap-2 text-[15px]"><Stars rating={tutor.rating} /><strong>{tutor.rating}</strong><span className="text-[var(--text2)]">({tutor.reviews} reviews)</span></div>
              <p className="text-[var(--text2)] text-sm mt-2.5 leading-relaxed">{tutor.bio}</p>
              <div className="flex gap-4 flex-wrap mt-3">
                {[`📚 ${tutor.sessions} sessions`, `💰 $${tutor.hourly}/hr`, tutor.online ? '🟢 Online now' : '⚫ Offline'].map((m) => (
                  <span key={m} className="flex items-center gap-1.5 text-[13px] text-[var(--text2)]">{m}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="card p-5 mb-4">
            <h3 className="font-display font-bold mb-3 text-[var(--text)]">Courses Taught</h3>
            <div className="flex gap-2 flex-wrap">{tutor.courses.map((c) => <span key={c} className="badge badge-purple" style={{ fontSize: 13, padding: '5px 14px' }}>{c}</span>)}</div>
          </div>
          <div className="card p-5">
            <h3 className="font-display font-bold mb-3.5 text-[var(--text)]">Student Reviews</h3>
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <div className="flex gap-2.5 items-center mb-2">
                  <Avatar name={r.name} color={r.color} size={30} />
                  <div><div className="font-semibold text-[13px]">{r.name}</div><div className="text-xs"><Stars rating={r.rating} /></div></div>
                </div>
                <p className="text-[13px] text-[var(--text2)]">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card p-5 sticky top-5">
            <h3 className="font-display font-bold mb-4 text-[var(--text)]">Book a Session</h3>
            <div className="font-display text-2xl font-extrabold text-[var(--accent2)] mb-1">${tutor.hourly}<span className="text-sm font-normal text-[var(--text2)]">/hour</span></div>
            <div className="mb-4">
              <div className="text-[13px] font-semibold mb-2 text-[var(--text2)]">Available Slots</div>
              {tutor.available.map((a) => (
                <div key={a} className="flex items-center gap-1.5 text-[13px] p-2 rounded-lg mb-1.5" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  <span className="text-[var(--cgreen)]">●</span> {a}
                </div>
              ))}
            </div>
            <button className="btn-primary w-full justify-center mb-2" onClick={() => navigate(`/student/booking/${tutor.id}`)}>Request Session</button>
            <button className="btn-secondary w-full justify-center" onClick={() => navigate('/student/chat')}>💬 Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
