import { TutorProfileViewSkeleton } from '@/features/tutor/components/TutorProfileViewSkeleton';
import { useCreateSession } from '@/features/tutor/hooks/useBooking';
import { useGetTutorById } from '@/features/tutor/hooks/useTutorApi';
import { Avatar, FieldError } from '@/shared/components/ui';
import { Dropdown } from '@/shared/components/ui/DropDown';
import { fieldClass } from '@/shared/lib/fieldClass';
import { bookingInitialValues, bookingSchema } from '@/shared/lib/validation/bookingSchema';
import { useFormik } from 'formik';

import { useNavigate, useParams } from 'react-router-dom';

const KEYS = ['Tutor', 'Duration', 'Slot', 'Cost', 'Total'] as const;

// Convert availability map to displayable slots with day info
function buildSlots(availability: Record<string, { start: string; end: string }> | null): Array<{ day: string; display: string }> {
  if (!availability) return [];
  return Object.entries(availability).map(
    ([day, w]) => ({
      day,
      display: `${day.slice(0, 3)} ${w.start}–${w.end}`
    })
  );
}

export function BookingPage() {
  const navigate = useNavigate();
  const { tutorId } = useParams<{ tutorId: string }>();
  const { tutor, isLoading, error } = useGetTutorById(tutorId ?? '')
  const { createSession, isPending } = useCreateSession();
  const slots = buildSlots(tutor?.availability ?? null);
  const courses = tutor?.courses.map((c) => c.name) ?? [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...bookingInitialValues, subject: courses[0] ?? '' },
    validationSchema: bookingSchema,
    onSubmit: async (values) => {
      const selectedAvailability = values.scheduled_at && tutor?.availability?.[values.scheduled_at];
      const cost = Number(tutor?.hourly_rate ?? 0) * Number(values.duration ?? 0);
      
      const payload = {
        tutor_id: tutorId!,
        subject: values.subject,
        duration: values.duration,
        cost,
        scheduled_at: selectedAvailability ? { day: values.scheduled_at, ...selectedAvailability } : null,
        notes: values.notes,
      };
      
      await createSession(payload);
      navigate('/student/booking/confirmed');
    },
  });

  if (isLoading) return <TutorProfileViewSkeleton />;
  if (error || !tutorId) return <div>Failed to load tutor</div>;
  if (!tutor) return <div>No tutor found</div>;

  const err = (field: keyof typeof formik.errors) =>
    formik.touched[field] ? (formik.errors[field] as string | undefined) : undefined;
  

  const selectedSlotDisplay = slots.find(
    s => s.day === formik.values.scheduled_at
  )?.display ?? "—";

  const summary: Record<(typeof KEYS)[number], string> = {
  Tutor: tutor.full_name,
  Duration: formik.values.duration === 1 ? '1 hour' : `${formik.values.duration} hours`,
  Slot: formik.values.scheduled_at !== null ? selectedSlotDisplay : "—",
  Cost: `$${Number(tutor.hourly_rate ?? 0)}/hr`,
  Total: `$${Number(tutor.hourly_rate ?? 0) * (Number(formik.values.duration) ?? 0)}`
  };

  return (
    <div className="page-enter max-w-[600px]">
      <button className="btn-ghost mb-5" onClick={() => navigate(`/student/tutors/${tutorId}`)}>
        ← Back to Profile
      </button>
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">Book a Session</h1>
        <p className="text-[var(--text2)] text-sm">Confirm your booking details</p>
      </div>

      <div className="card p-7">
        {/* Tutor info strip */}
        <div className="flex gap-3 items-center mb-6 p-3.5 rounded-[10px]" style={{ background: 'var(--bg3)' }}>
          <Avatar name={tutor.full_name} imageUrl={tutor.profile_picture_url} size={46} />
          <div>
            <div className="font-bold">{tutor.full_name}</div>
            <div className="text-[13px] text-[var(--text2)]">{courses.join(', ')}</div>
            <div className="text-[13px] text-[var(--accent2)] mt-0.5">${Number(tutor.hourly_rate ?? 0)}/hr</div>
          </div>
        </div>

        <Dropdown
          label="Subject / Topic"
          value={formik.values.subject}
          options={courses}
          error={formik.touched.subject ? formik.errors.subject : undefined}
          touched={formik.touched.subject}
          placeholder="Select a subject"
          onChange={(v) => formik.setFieldValue('subject', v)}
        />

        <Dropdown
          label="Session Duration"
          value={String(formik.values.duration)}
          options={[
            { label: '1 hour', value: '1' },
            { label: '1.5 hours', value: '1.5' },
            { label: '2 hours', value: '2' },
          ]}
          error={formik.touched.duration ? (formik.errors.duration as string | undefined) : undefined}
          touched={formik.touched.duration}
          placeholder="Select a duration"
          onChange={(v) => formik.setFieldValue('duration', Number(v))}
        />

        {/* Time slot grid */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Select Time Slot</label>
          {slots.length === 0 ? (
            <p className="text-sm text-[var(--text2)]">No availability set by this tutor.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {slots.map(({ day, display }) => (
                <div
                  key={day}
                  className={`time-slot${formik.values.scheduled_at === day ? ' selected' : ''}`}
                  onClick={() => formik.setFieldValue('scheduled_at', day)}
                >
                  {display}
                </div>
              ))}
            </div>
          )}
          <FieldError message={formik.touched.scheduled_at ? (formik.errors.scheduled_at as string | undefined) : undefined} />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">
            What do you need help with?
          </label>
          <textarea
            rows={3}
            placeholder="Describe what you're struggling with (min 10 characters)..."
            className={fieldClass(formik.touched.notes, formik.errors.notes)}
            {...formik.getFieldProps('notes')}
          />
          <FieldError message={err('notes')} />
        </div>

        {/* Summary */}
        <div className="p-3.5 rounded-[10px] mb-5" style={{ background: 'var(--bg3)' }}>
          <div className="font-bold mb-2.5">Session Summary</div>
          {KEYS.map((k) => (
            <div key={k} className="flex justify-between text-sm mb-1.5">
              <span className="text-[var(--text2)]">{k}</span>
              <span className="font-semibold">{summary[k]}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={isPending}
          className="btn-primary w-full justify-center py-3 text-[15px] font-bold disabled:opacity-60"
          onClick={() => formik.handleSubmit()}
        >
          {isPending ? 'Booking…' : 'Confirm Booking →'}
        </button>
      </div>
    </div>
  );
}
