import * as Yup from 'yup';

export interface LoginValues {
  email:    string;
  password: string;
}

export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const loginInitialValues: LoginValues = {
  email:    '',
  password: '',
};
