import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchTutors } from '@/features/tutor/hooks/useTutorApi';
import { PRESET_COURSES } from '@/features/tutor/constants/courses';
import { Avatar, Stars } from '@/shared/components/ui';
import { Search, X, SlidersHorizontal, Wifi } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTutorPrefetch } from '@/features/tutor/hooks/useTutorApi';

const COURSE_CHIPS = ['All', ...PRESET_COURSES];

const RATING_OPTIONS = [
  { label: 'Any Rating', value: undefined },
  { label: '3.0+', value: 3.0 },
  { label: '4.0+', value: 4.0 },
  { label: '4.5+', value: 4.5 },
  { label: '4.8+', value: 4.8 },
];

const PRICE_OPTIONS = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under $5', min: undefined, max: 5 },
  { label: '$5–$10', min: 5, max: 10},
  { label: '$10–$20', min: 10, max: 20},
  { label: '$20+', min: 20, max: undefined },
];

const SORT_OPTIONS = [
  { label: 'Relevance', order_by: undefined, order_dir: undefined },
  { label: 'Top Rated', order_by: 'average_rating' as const, order_dir: 'desc' as const },
  { label: 'Price: Low', order_by: 'hourly_rate' as const, order_dir: 'asc' as const },
  { label: 'Price: High', order_by: 'hourly_rate' as const, order_dir: 'desc' as const },
];

export function TutorSearch() {
  const navigate = useNavigate();
  const{prefetchTutor, cancelPrefetch} = useTutorPrefetch();
  const [search, setSearch] = useState('');
  const [activeCourse, setActiveCourse] = useState('All');
  const [ratingIdx, setRatingIdx] = useState(0);
  const [priceIdx, setPriceIdx] = useState(0);
  const [sortIdx, setSortIdx] = useState(0);
  const [onlineOnly, setOnlineOnly] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const price = PRICE_OPTIONS[priceIdx];
  const sort = SORT_OPTIONS[sortIdx];

  const { tutors, total, isLoading, isFetching } = useSearchTutors({
    q: debouncedSearch || undefined,
    course: activeCourse === 'All' ? undefined : activeCourse,
    min_rating: RATING_OPTIONS[ratingIdx].value,
    min_rate: price.min,
    max_rate: price.max,
    is_online: onlineOnly,
    order_by: sort.order_by,
    order_dir: sort.order_dir,
  });

  const loading = isLoading || isFetching;

  const activeFilterCount = [
    ratingIdx > 0,
    priceIdx > 0,
    sortIdx > 0,
    onlineOnly,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch('');
    setActiveCourse('All');
    setRatingIdx(0);
    setPriceIdx(0);
    setSortIdx(0);
    setOnlineOnly(false);
  };

  const hasAnyFilter = activeFilterCount > 0 || activeCourse !== 'All' || search !== '';

  return (
    <div className="page-enter">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">
          Find a Tutor
        </h1>
        <p className="text-[var(--text2)] text-sm">
          {loading ? 'Searching…' : `${total} tutor${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* ── Main search bar ── */}
      <div className="relative mb-3">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none" />
        <input
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm placeholder:text-[var(--text3)] placeholder:text-xs focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
          placeholder="Search by tutor name, subject, or keyword…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">

        {/* Toggle filters */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[13px] font-medium transition-all ${
            showFilters || activeFilterCount > 0
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent2)]'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text2)] hover:border-[var(--border2)]'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 bg-[var(--accent)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Online only toggle */}
        <button
          onClick={() => setOnlineOnly(o => !o)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[13px] font-medium transition-all ${
            onlineOnly
              ? 'border-[var(--cgreen)]/40 bg-[var(--cgreen)]/10 text-[var(--cgreen)]'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text2)] hover:border-[var(--border2)]'
          }`}
        >
          <Wifi size={14} />
          Online now
        </button>

        {/* Sort pills */}
        <div className="flex gap-1.5 ml-auto">
          {SORT_OPTIONS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSortIdx(i)}
              className={`px-3 py-2 rounded-xl border text-[12px] font-medium transition-all ${
                sortIdx === i
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent2)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text3)] hover:text-[var(--text2)]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Clear all */}
        {hasAnyFilter && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[12px] text-[var(--text3)] hover:text-[var(--cred)] transition-colors ml-1"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* ── Expanded filters panel ── */}
      {showFilters && (
        <div className="mb-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] grid grid-cols-2 gap-4 sm:grid-cols-2">
          {/* Rating */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text3)] mb-2">Min Rating</p>
            <div className="flex flex-wrap gap-1.5">
              {RATING_OPTIONS.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setRatingIdx(i)}
                  className={`px-2.5 py-1 rounded-lg border text-[12px] font-medium transition-all ${
                    ratingIdx === i
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent2)]'
                      : 'border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text3)] mb-2">Price Range (per hour)</p>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_OPTIONS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setPriceIdx(i)}
                  className={`px-2.5 py-1 rounded-lg border text-[12px] font-medium transition-all ${
                    priceIdx === i
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent2)]'
                      : 'border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Course chips — full PRESET_COURSES list ── */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {COURSE_CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCourse(c)}
            className={`chip shrink-0${activeCourse === c ? ' active' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tutor-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="skeleton w-[46px] h-[46px] rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
              <div className="skeleton h-3 w-full rounded mb-2" />
              <div className="skeleton h-3 w-5/6 rounded mb-4" />
              <div className="skeleton h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-20 text-[var(--text2)]">
          <div className="mb-4">
            <Search size={44} className="mx-auto text-[var(--text3)]" />
          </div>
          <div className="text-lg font-bold mb-2 text-[var(--text)]">No tutors found</div>
          <p className="text-sm mb-4">Try adjusting your search or filters</p>
          {hasAnyFilter && (
            <button onClick={clearAll} className="btn-secondary text-[13px]">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
          {tutors.map((t) => (
            <div
              key={t.user_id}
              onMouseEnter={() => prefetchTutor(t.user_id)}
              onMouseLeave={() => cancelPrefetch(t.user_id)}
              onClick={() => navigate(`/student/tutors/${t.user_id}`)}
              className="tutor-card cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={t.full_name} imageUrl={t.profile_picture_url} size={46} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] text-[var(--text)] truncate">{t.full_name}</div>
                  <div className="flex items-center gap-1 text-[13px]">
                    <Stars rating={Number(t.average_rating) || 0} />
                    <span className="text-[var(--text2)] text-xs">
                      {Number(t.average_rating).toFixed(1)} ({t.review_count})
                    </span>
                  </div>
                  {t.is_online
                    ? <span className="text-[11px] text-[var(--cgreen)]">● Online</span>
                    : <span className="text-[11px] text-[var(--text3)]">⚫ Offline</span>
                  }
                </div>
                <div
                  className="shrink-0 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#EEEDFE', color: '#3C3489' }}
                >
                  ${Number(t.hourly_rate).toLocaleString()}/hr
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap mb-3">
                {(t.courses ?? []).slice(0, 3).map((c) => (
                  <span key={c.id} className="badge badge-blue">{c.name}</span>
                ))}
              </div>

              <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-3 line-clamp-2">
                {t.bio || 'No bio provided.'}
              </p>

              <div className="flex items-center justify-between text-[12px] text-[var(--text3)]">
                <span>📚 {t.total_sessions} sessions</span>
                <button className="btn-primary text-[12px] py-1.5 px-3">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
