import * as Yup from 'yup';

export interface BookingValues {
  subject:  string;
  duration: number;
  scheduled_at:     string | null;
  notes:    string;
}

export const bookingSchema = Yup.object({
  subject: Yup.string()
    .required('Please select a subject'),
  duration: Yup.number()
    .required('Please select a duration'),
  scheduled_at: Yup.string()
  .nullable()
  .required('Please select a time slot'),
  notes: Yup.string()
    .required('Please describe what you need help with')
    .min(10, 'Please provide at least 10 characters so your tutor can prepare'),
});

export const bookingInitialValues: BookingValues = {
  subject:  '',
  duration: 1,
  scheduled_at:     null,
  notes:    '',
};
