import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { TUTORS } from '@/shared/data/tutors';
import { Avatar } from '@/shared/components/ui';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';
import { bookingSchema, bookingInitialValues } from '@/shared/lib/validation/bookingSchema';

import { Dropdown } from '@/shared/components/ui/DropDown';

const KEYS = ['Tutor', 'Duration', 'Time', 'Cost'] as const;

export function BookingPage() {
  const navigate = useNavigate();
  const { tutorId } = useParams<{ tutorId: string }>();
  const t = TUTORS.find((t) => t.id === Number(tutorId)) ?? TUTORS[0];
  const slots = [...t.available, 'Mon 8am', 'Tue 2pm', 'Fri 11am'];

  const formik = useFormik({
    initialValues: { ...bookingInitialValues, subject: t.courses[0] },
    validationSchema: bookingSchema,
    onSubmit: (values) => {
      console.log('[Booking] submitted:', {
        tutor: t.name,
        tutorId: t.id,
        ...values,
      });
      navigate('/student/booking/confirmed');
    },
  });

  const err = (field: keyof typeof formik.errors) =>
    formik.touched[field] ? (formik.errors[field] as string | undefined) : undefined;

  // Derive summary from current form values
  const summary: Record<typeof KEYS[number], string> = {
    Tutor:    t.name,
    Duration: formik.values.duration,
    Time:     formik.values.slot !== null ? (slots[formik.values.slot] ?? '—') : '—',
    Cost:     `$${t.hourly}`,
  };

  return (
    <div className="page-enter max-w-[600px]">
      <button className="btn-ghost mb-5" onClick={() => navigate(`/student/tutors/${t.id}`)}>
        ← Back to Profile
      </button>
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">Book a Session</h1>
        <p className="text-[var(--text2)] text-sm">Confirm your booking details</p>
      </div>

      <div className="card p-7">
        {/* Tutor info strip */}
        <div className="flex gap-3 items-center mb-6 p-3.5 rounded-[10px]" style={{ background: 'var(--bg3)' }}>
          <Avatar name={t.name} color={t.color} initials={t.initials} size={46} />
          <div>
            <div className="font-bold">{t.name}</div>
            <div className="text-[13px] text-[var(--text2)]">{t.courses.join(', ')}</div>
            <div className="text-[13px] text-[var(--accent2)] mt-0.5">${t.hourly}/hour</div>
          </div>
        </div>

        {/* Subject */}

        <Dropdown
          label="Subject / Topic"
          value={formik.values.subject}
          options={t.courses}
          error={formik.touched.subject ? formik.errors.subject : undefined}
          touched={formik.touched.subject}
          placeholder="Select a subject"
          onChange={(v) => formik.setFieldValue('subject', v)}
        />

        {/* Duration */}
        <Dropdown
          label="Session Duration"
          value={formik.values.duration}
          options={["1 hour", "1.5 hours", "2 hours"]}
          error={formik.touched.duration ? formik.errors.duration : undefined}
          touched={formik.touched.duration}
          placeholder="Select a duration"
          onChange={(v) => formik.setFieldValue('duration', v)}
        />

        {/* Time slot grid */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Select Time Slot</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {slots.map((a, i) => (
              <div
                key={a}
                className={`time-slot${formik.values.slot === i ? ' selected' : ''}`}
                onClick={() => formik.setFieldValue('slot', i)}
              >
                {a}
              </div>
            ))}
          </div>
          <FieldError message={formik.touched.slot ? (formik.errors.slot as string | undefined) : undefined} />
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
          className="btn-primary w-full justify-center py-3 text-[15px] font-bold"
          onClick={() => formik.handleSubmit()}
        >
          Confirm Booking →
        </button>
      </div>
    </div>
  );
}
