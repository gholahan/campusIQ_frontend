import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TUTORS } from '@/shared/data/tutors';
import { Avatar, Stars } from '@/shared/components/ui';
import { Search } from 'lucide-react';

const CHIPS = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Engineering'];

export function TutorSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('All');
  const filtered = TUTORS.filter((t) => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase()) || t.courses.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const mc = active === 'All' || t.courses.some((c) => c.toLowerCase().includes(active.toLowerCase()));
    return ms && mc;
  });

  return (
    <div className="page-enter">
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Find a Tutor</h1>
        <p className="text-[var(--text2)] text-sm">Browse {TUTORS.length} expert tutors across all subjects</p>
      </div>

      <div className="flex gap-3 items-center p-3 mb-6 rounded-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <span className="text-lg text-[var(--text3)]"><Search size={18} /></span>
        <input
          className="flex-1 bg-transparent border-none text-sm text-[var(--text)] focus:outline-none placeholder:text-[var(--text3)]"
          placeholder="Search by name, course, or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input" style={{ width: 'auto', padding: '8px 12px', borderRadius: 8 }}>
          <option>Any Rating</option><option>4.5+</option><option>4.8+</option>
        </select>
        <select className="form-input" style={{ width: 'auto', padding: '8px 12px', borderRadius: 8 }}>
          <option>Any Price</option><option>Under ₦5k/hr</option><option>₦5k–10k/hr</option>
        </select>
      </div>

      <div className="filter-chips flex gap-2 mb-5">
        {CHIPS.map((c) => (
          <button key={c} className={`chip${active === c ? ' active' : ''}`} onClick={() => setActive(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text2)]">
          <div className="text-5xl mb-3"><Search size={18}/></div>
          <div className="text-lg font-bold mb-2 text-[var(--text)]">No tutors found</div>
          <div>Try adjusting your search or filters</div>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
          {filtered.map((t) => (
            <div key={t.id} className="tutor-card cursor-pointer" onClick={() => navigate(`/student/tutors/${t.id}`)}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={t.name} color={t.color} initials={t.initials} size={46} />
                <div>
                  <div className="font-bold text-[15px] text-[var(--text)]">{t.name}</div>
                  <div className="flex items-center gap-1 text-[13px]"><Stars rating={t.rating} /><span className="text-[var(--text2)] text-xs">{t.rating} ({t.reviews})</span></div>
                  {t.online ? <span className="text-[11px] text-[var(--cgreen)]">● Online now</span> : <span className="text-[11px] text-[var(--text3)]">⚫ Offline</span>}
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {t.courses.map((c) => <span key={c} className="badge badge-blue">{c}</span>)}
              </div>
              <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-3">{t.bio.slice(0, 80)}...</p>
              <div className="flex gap-4 text-[12px] text-[var(--text3)] mb-3"><span>📚 {t.sessions} sessions</span><span>💰 ${t.hourly}/hr</span></div>
              <button className="btn-primary w-full justify-center text-[13px] mt-2">View Profile</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
