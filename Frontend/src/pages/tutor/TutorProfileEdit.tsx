import { useState } from 'react';
import { useFormik } from 'formik';
import { Avatar } from '@/shared/components/ui';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';
import { tutorProfileSchema, tutorProfileInitialValues } from '@/shared/lib/validation/tutorProfileSchema';

type Tab = 'profile' | 'courses' | 'availability';
const COURSES = ['Data Structures', 'Algorithms', 'Introduction to CS', 'Discrete Mathematics'];
const DAYS    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TutorProfileEdit() {
  const [tab, setTab] = useState<Tab>('profile');

  const formik = useFormik({
    initialValues: tutorProfileInitialValues,
    validationSchema: tutorProfileSchema,
    onSubmit: (values) => {
      console.log('[TutorProfile] submitted:', values);
    },
  });

  const err = (field: keyof typeof formik.errors) =>
    formik.touched[field] ? (formik.errors[field] as string | undefined) : undefined;

  return (
    <div className="page-enter">
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Edit Your Profile</h1>
        <p className="text-[var(--text2)] text-sm">Keep your profile up to date to attract more students</p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-[10px] mb-6 max-w-sm"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {(['profile', 'courses', 'availability'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab-btn capitalize${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card p-7 max-w-[700px]">

        {/* ── Profile tab ── */}
        {tab === 'profile' && (
          <div>
            <div className="flex gap-5 items-center mb-7">
              <Avatar name="Amara Osei" color="var(--accent)" initials="AO" size={72} />
              <div>
                <button className="btn-secondary text-[13px]" type="button">Change Photo</button>
                <div className="text-xs text-[var(--text3)] mt-1.5">JPG or PNG, max 2MB</div>
              </div>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4 mb-0">
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">First Name</label>
                <input
                  className={fieldClass(formik.touched.firstName, formik.errors.firstName)}
                  {...formik.getFieldProps('firstName')}
                />
                <FieldError message={err('firstName')} />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Last Name</label>
                <input
                  className={fieldClass(formik.touched.lastName, formik.errors.lastName)}
                  {...formik.getFieldProps('lastName')}
                />
                <FieldError message={err('lastName')} />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Email</label>
                <input
                  type="email"
                  className={fieldClass(formik.touched.email, formik.errors.email)}
                  {...formik.getFieldProps('email')}
                />
                <FieldError message={err('email')} />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Hourly Rate ($)</label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  className={fieldClass(formik.touched.hourlyRate, formik.errors.hourlyRate)}
                  {...formik.getFieldProps('hourlyRate')}
                />
                <FieldError message={err('hourlyRate')} />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">
                Bio
                <span className="text-[var(--text3)] font-normal ml-2">
                  ({String(formik.values.bio).length}/500)
                </span>
              </label>
              <textarea
                rows={4}
                className={fieldClass(formik.touched.bio, formik.errors.bio)}
                {...formik.getFieldProps('bio')}
              />
              <FieldError message={err('bio')} />
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => formik.handleSubmit()}
            >
              Save Changes
            </button>

            {/* Show success if form submitted cleanly */}
            {formik.submitCount > 0 && formik.isValid && (
              <p className="text-[13px] mt-3" style={{ color: 'var(--cgreen)' }}>
                ✓ Profile saved successfully
              </p>
            )}
          </div>
        )}

        {/* ── Courses tab (unvalidated — UI only) ── */}
        {tab === 'courses' && (
          <div>
            <p className="text-[var(--text2)] text-sm mb-5">Add courses you can tutor. Students filter by course.</p>
            {COURSES.map((c, i) => (
              <div
                key={i}
                className="flex gap-2.5 items-center p-3 rounded-[10px] mb-2"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
              >
                <span className="badge badge-blue" style={{ fontSize: 13, padding: '5px 14px' }}>{c}</span>
                <select className="form-input flex-1" style={{ padding: '6px 10px', fontSize: 13 }}>
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                  <option>Both</option>
                </select>
                <button className="btn-ghost text-[13px] px-2.5 py-1.5 text-[var(--cred)]">✕</button>
              </div>
            ))}
            <div className="flex gap-2.5 mt-4">
              <input className="form-input" placeholder="Add a new course..." />
              <button className="btn-primary">Add</button>
            </div>
          </div>
        )}

        {/* ── Availability tab (unvalidated — UI only) ── */}
        {tab === 'availability' && (
          <div>
            <p className="text-[var(--text2)] text-sm mb-5">Set your weekly availability for bookings.</p>
            {DAYS.map((day) => (
              <div key={day} className="flex gap-3 items-center mb-3">
                <div className="w-24 font-semibold text-sm">{day}</div>
                <input className="form-input w-28" type="time" defaultValue="09:00" />
                <span className="text-[var(--text3)] text-sm">to</span>
                <input className="form-input w-28" type="time" defaultValue="17:00" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={day !== 'Saturday'}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span className="text-[13px]">Available</span>
                </label>
              </div>
            ))}
            <button className="btn-primary mt-2">Save Availability</button>
          </div>
        )}
      </div>
    </div>
  );
}
