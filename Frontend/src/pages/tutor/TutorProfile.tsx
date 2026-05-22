import { useRef, useState } from 'react';
import { useGetTutorProfile, useUpdateTutorProfile } from '@/features/tutor/hooks/useTutorApi';
import type { AvailabilityMap, DayKey, DayValue, FullDayKey } from '@/features/tutor/types';
import { DAYS, DAY_FULL } from '@/features/tutor/constants/days';
import { PRESET_COURSES } from '@/features/tutor/constants/courses';
import { AvailabilityStep } from '@/features/tutor/components/steps/AvailabilityStep';
import { CoursesStep } from '@/features/tutor/components/steps/CourseStep';
import { Avatar } from '@/shared/components/ui';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';
import { uploadProfileImage } from '@/shared/lib/upload';
import { TutorProfileSkeleton } from '@/features/tutor/components/TutorProfileSkeleton';

const DAY_ORDER: FullDayKey[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];
const DAY_SHORT: Record<FullDayKey, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

// convert AvailabilityMap (FullDayKey → DayWindow) to DayRow shape (DayKey → DayValue)
function availabilityToDraft(map: AvailabilityMap | null): Record<DayKey, DayValue> {
  const base: Record<DayKey, DayValue> = {
    mon: { enabled: false, start: '', end: '' },
    tue: { enabled: false, start: '', end: '' },
    wed: { enabled: false, start: '', end: '' },
    thu: { enabled: false, start: '', end: '' },
    fri: { enabled: false, start: '', end: '' },
    sat: { enabled: false, start: '', end: '' },
    sun: { enabled: false, start: '', end: '' },
  };
  if (!map) return base;
  DAYS.forEach((short) => {
    const full = DAY_FULL[short];
    const w = map[full];
    if (w) base[short] = { enabled: true, start: w.start, end: w.end };
  });
  return base;
}

// convert DayRow shape back to AvailabilityMap for the API
function draftToAvailability(draft: Record<DayKey, DayValue>): AvailabilityMap {
  const result: AvailabilityMap = {};
  DAYS.forEach((short) => {
    const d = draft[short];
    if (d.enabled && d.start && d.end && d.end > d.start) {
      result[DAY_FULL[short]] = { start: d.start, end: d.end };
    }
  });
  return result;
}

export function TutorProfileEdit() {
  const { tutor, isLoading } = useGetTutorProfile();
  const { updateAsync, isPending } = useUpdateTutorProfile();

  const [editing, setEditing] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [draft, setDraft] = useState({ title: '', bio: '', hourly_rate: '' });
  const [draftErrors, setDraftErrors] = useState({ title: '', bio: '', hourly_rate: '' });

  // availability draft — DayKey shape for AvailabilityStep
  const [availDraft, setAvailDraft] = useState<Record<DayKey, DayValue>>(() =>
    availabilityToDraft(null)
  );
  const [availError, setAvailError] = useState<string | undefined>();

  // courses draft — string[] for CoursesStep
  const [coursesDraft, setCoursesDraft] = useState<string[]>([]);
  const [courseInput, setCourseInput] = useState('');
  const [coursesError, setCoursesError] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  if (isLoading) {
    return <TutorProfileSkeleton />;
  }
  if (!tutor) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-[var(--text3)]">
        Error loading profile
      </div>
    );
  }

  const rate = tutor.hourly_rate ? `$${Number(tutor.hourly_rate).toFixed(0)}/hr` : '—';
  const rating = tutor.average_rating ? Number(tutor.average_rating).toFixed(1) : '—';
  const activeDays = DAY_ORDER.filter((d) => tutor.availability?.[d]);
  const courses = tutor.courses ?? [];

  const startEditing = () => {
    setDraft({
      title: tutor.title ?? '',
      bio: tutor.bio ?? '',
      hourly_rate: tutor.hourly_rate ? String(Number(tutor.hourly_rate)) : '',
    });
    setDraftErrors({ title: '', bio: '', hourly_rate: '' });
    setAvailDraft(availabilityToDraft(tutor.availability ?? null));
    setAvailError(undefined);
    setCoursesDraft(courses.map((c) => c.name));
    setCoursesError(undefined);
    setSaveError(null);
    setEditing(true);
  };

  const validate = () => {
    const errors = { title: '', bio: '', hourly_rate: '' };
    let valid = true;

    if (draft.bio.trim().length < 10) {
      errors.bio = 'Bio must be at least 10 characters';
      valid = false;
    }
    const r = Number(draft.hourly_rate);
    if (!draft.hourly_rate || isNaN(r) || r < 1) {
      errors.hourly_rate = 'Enter a valid hourly rate';
      valid = false;
    }

    const hasDay = DAYS.some((d) => {
      const v = availDraft[d];
      return v.enabled && v.start && v.end && v.end > v.start;
    });
    if (!hasDay) {
      setAvailError('Set availability for at least one day');
      valid = false;
    } else {
      setAvailError(undefined);
    }

    if (coursesDraft.length === 0) {
      setCoursesError('Select at least one course');
      valid = false;
    } else {
      setCoursesError(undefined);
    }

    setDraftErrors(errors);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveError(null);
    try {
      await updateAsync({
        title: draft.title.trim() || undefined,
        bio: draft.bio.trim(),
        hourly_rate: Number(draft.hourly_rate),
        availability: draftToAvailability(availDraft),
        courses: coursesDraft,
      });
      setEditing(false);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? 'Failed to save. Please try again.');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarError('Only JPG, PNG or WebP allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be under 2MB');
      return;
    }
    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const url = await uploadProfileImage(file);
      await updateAsync({ profile_picture_url: url });
    } catch {
      setAvatarError('Upload failed. Please try again.');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  // courses helpers
  const toggleCourse = (c: string) => {
    setCoursesDraft((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const addCustomCourse = () => {
    const val = courseInput.trim();
    if (!val) return;
    const preset = PRESET_COURSES.find((p) => p.toLowerCase() === val.toLowerCase());
    const canonical = preset ?? val;
    if (!coursesDraft.some((x) => x.toLowerCase() === canonical.toLowerCase())) {
      setCoursesDraft((prev) => [...prev, canonical]);
    }
    setCourseInput('');
  };

  const removeCourse = (c: string) => {
    setCoursesDraft((prev) => prev.filter((x) => x !== c));
  };

  return (
    <div className="page-enter max-w-[720px]">

      {/* ── Header ── */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">
            My Profile
          </h1>
          <p className="text-[var(--text2)] text-sm">Your public tutor profile</p>
        </div>

        {editing ? (
          <div className="flex gap-2">
            <button
              className="btn-secondary text-[13px]"
              onClick={() => setEditing(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              className="btn-primary text-[13px] disabled:opacity-60"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button className="btn-secondary text-[13px]" onClick={startEditing}>
            Edit Profile
          </button>
        )}
      </div>

      {/* ── Identity card ── */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-5 mb-5">
          <div className="relative shrink-0">
            <Avatar name={tutor.full_name} imageUrl={tutor.profile_picture_url} size={68} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute inset-0 flex items-center justify-center rounded-[14px] bg-black/40 text-white text-[11px] font-medium opacity-0 hover:opacity-100 transition-opacity disabled:opacity-60"
            >
              {avatarUploading ? '…' : 'Change'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display text-[20px] font-bold text-[var(--text)] truncate">
                {tutor.full_name}
              </h2>
              {tutor.is_online && (
                <span className="badge badge-green text-[11px]">● Online</span>
              )}
            </div>
            {editing ? (
              <div className="mt-1.5">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. PhD student in Computer Science"
                  className={fieldClass(true, draftErrors.title)}
                />
                <FieldError message={draftErrors.title} />
              </div>
            ) : (
              <p className="text-sm text-[var(--text2)] mt-0.5">
                {tutor.title || 'No title set'}
              </p>
            )}
          </div>

          {editing ? (
            <div className="shrink-0 w-28">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text3)]">$</span>
                <input
                  type="number"
                  min={1}
                  value={draft.hourly_rate}
                  onChange={(e) => setDraft(d => ({ ...d, hourly_rate: e.target.value }))}
                  className={`${fieldClass(true, draftErrors.hourly_rate)} pl-6`}
                  placeholder="0"
                />
              </div>
              <FieldError message={draftErrors.hourly_rate} />
            </div>
          ) : (
            <div
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ background: '#EEEDFE', color: '#3C3489', border: '0.5px solid #AFA9EC' }}
            >
              {rate}
            </div>
          )}
        </div>

        {avatarError && <p className="text-[12px] text-red-400 mb-3">{avatarError}</p>}

        {editing ? (
          <div>
            <label className="block text-[13px] font-medium text-[var(--text2)] mb-1.5">
              Bio
              <span className="ml-2 text-[var(--text3)] font-normal">({draft.bio.length}/500)</span>
            </label>
            <textarea
              rows={4}
              maxLength={500}
              value={draft.bio}
              onChange={(e) => setDraft(d => ({ ...d, bio: e.target.value }))}
              className={fieldClass(true, draftErrors.bio)}
            />
            <FieldError message={draftErrors.bio} />
          </div>
        ) : (
          <p className="text-sm text-[var(--text2)] leading-relaxed">
            {tutor.bio || 'No bio provided.'}
          </p>
        )}

        {saveError && <p className="text-[12px] text-red-400 mt-3">{saveError}</p>}

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Rating', value: rating, icon: '⭐' },
            { label: 'Reviews', value: tutor.review_count, icon: '💬' },
            { label: 'Sessions', value: tutor.total_sessions, icon: '📚' },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
            >
              <div className="text-lg mb-1">{icon}</div>
              <div className="font-display text-[18px] font-bold text-[var(--text)]">{value}</div>
              <div className="text-[11px] text-[var(--text3)] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Courses ── */}
      <div className="mb-4">
        {editing ? (
          <CoursesStep
            courses={coursesDraft}
            courseInput={courseInput}
            onCourseInputChange={setCourseInput}
            onToggleCourse={toggleCourse}
            onAddCustomCourse={addCustomCourse}
            onRemoveCourse={removeCourse}
            error={coursesError}
            touched={true}
            showPresets={false}
          />
        ) : (
          <div className="card p-6">
            <h3 className="font-semibold text-[14px] text-[var(--text)] mb-3">
              Courses
              <span className="ml-2 text-[var(--text3)] font-normal text-[13px]">({courses.length})</span>
            </h3>
            {courses.length === 0 ? (
              <p className="text-sm text-[var(--text3)]">No courses added.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {courses.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium"
                    style={{ background: '#E1F5EE', border: '0.5px solid #5DCAA5', color: '#0F6E56' }}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Availability ── */}
      <div>
        {editing ? (
          <AvailabilityStep
            availability={availDraft}
            onDayChange={(day: DayKey, val: DayValue) =>
              setAvailDraft((prev) => ({ ...prev, [day]: val }))
            }
            error={availError}
            touched={availError !== undefined}
          />
        ) : (
          <div className="card p-6">
            <h3 className="font-semibold text-[14px] text-[var(--text)] mb-3">Weekly Availability</h3>
            {activeDays.length === 0 ? (
              <p className="text-sm text-[var(--text3)]">No availability set.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {activeDays.map((d) => {
                  const w = tutor.availability![d]!;
                  return (
                    <div key={d} className="flex items-center gap-3">
                      <span className="text-[12px] font-semibold text-[var(--text2)] w-8 shrink-0">
                        {DAY_SHORT[d]}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-medium"
                        style={{ background: '#EEEDFE', color: '#3C3489' }}
                      >
                        {w.start} — {w.end}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
