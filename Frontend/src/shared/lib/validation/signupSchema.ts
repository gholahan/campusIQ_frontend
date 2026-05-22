import * as Yup from 'yup';

export interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string
}

export const signupSchema = () =>
  Yup.object({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'Must be at least 2 characters'),

    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Must be at least 2 characters'),

    email: Yup.string()
      .required('Email is required')
      .email('Enter a valid email'),

    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Must contain at least one number'),

    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords do not match')
  });

export const signupInitialValues: SignupValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
};