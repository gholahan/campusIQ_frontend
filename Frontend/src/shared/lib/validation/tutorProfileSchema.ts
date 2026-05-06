import * as Yup from 'yup';

export interface TutorProfileValues {
  firstName:  string;
  lastName:   string;
  email:      string;
  hourlyRate: number | '';
  bio:        string;
}

export const tutorProfileSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'Must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),
  hourlyRate: Yup.number()
    .typeError('Hourly rate must be a number')
    .required('Hourly rate is required')
    .min(5,   'Minimum rate is $5/hr')
    .max(200, 'Maximum rate is $200/hr'),
  bio: Yup.string()
    .required('Bio is required')
    .min(20, 'Bio must be at least 20 characters')
    .max(500, 'Bio must be under 500 characters'),
});

export const tutorProfileInitialValues: TutorProfileValues = {
  firstName:  'Amara',
  lastName:   'Osei',
  email:      'amara@university.edu',
  hourlyRate: 15,
  bio:        'PhD student in Computer Science. Love breaking down complex algorithms into digestible concepts.',
};
