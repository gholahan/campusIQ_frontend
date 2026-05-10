import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TUTORS } from '@/shared/data/tutors';
import { Avatar, Stars } from '@/shared/components/ui';
import { Search } from 'lucide-react';
import { Dropdown } from '@/shared/components/ui/DropDown';

const CHIPS = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Engineering'];

export function TutorSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('All');
  const [rating, setRating] = useState('Any Rating');
  const [price, setPrice] = useState('Any Price');
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

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 pb-0">
  <div
    className="
      flex flex-col gap-3
      md:flex-row md:items-start
    "
  >
    {/* Search */}
    <div
      className="
        flex items-center gap-3
        rounded-xl
        border border-[var(--border)]
        bg-[var(--bg2)]
        px-3 py-3
        flex-1 min-w-0
      "
    >
      <Search
        size={18}
        className="text-[var(--text3)] shrink-0"
      />

      <input
        className="
          flex-1 min-w-0
          bg-transparent
          border-none
          outline-none
          text-sm
          text-[var(--text)]
          placeholder:text-[var(--text3)]
        "
        placeholder="Search tutors, courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* Filters */}
    <div
      className="
        flex gap-2
        w-full md:w-auto
      "
    >
      <div className="flex-1 md:w-[170px]">
        <Dropdown
          label=""
          value={rating}
          onChange={setRating}
          options={[
            'Any Rating',
            '4.5+',
            '4.8+',
          ]}
        />
      </div>

      <div className="flex-1 md:w-[170px]">
        <Dropdown
          label=""
          value={price}
          onChange={setPrice}
          options={[
            'Any Price',
            'Under ₦5k/hr',
            '₦5k–10k/hr',
          ]}
        />
      </div>
    </div>
  </div>
</div>

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1"
>
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
