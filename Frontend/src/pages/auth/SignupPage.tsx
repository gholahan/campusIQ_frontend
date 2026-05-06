import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import type { Role } from '@/shared/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { signupSchema, signupInitialValues } from '@/shared/lib/validation/signupSchema';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('student');
  const isTutor = role === 'tutor';

  const formik = useFormik({
    initialValues: signupInitialValues,
    validationSchema: signupSchema(isTutor),
    onSubmit: (values) => {
      console.log('[Signup] submitted:', { role, ...values });
      login(role);
      navigate(isTutor ? '/tutor/dashboard' : '/student/dashboard');
    },
  });

  const err = (f: keyof typeof formik.errors) => formik.touched[f] ? formik.errors[f] : undefined;
  const lbl = 'block text-[13px] font-semibold text-[var(--text2)] mb-1.5';

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 page-enter bg-[var(--bg)]">
      <div className="card p-10 w-full max-w-md">
        <h2 className=" text-[26px] font-extrabold mb-1 text-red-500">Create your account</h2>
        <p className="text-[var(--text2)] text-sm mb-6">Join CampusIQ and start learning smarter</p>

        <p className="text-[13px] font-semibold text-[var(--text2)] mb-2">I am a...</p>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {([{ r: 'student', icon: '🎓', label: 'Student' }, { r: 'tutor', icon: '📚', label: 'Tutor' }] as { r: Role; icon: string; label: string }[]).map(({ r, icon, label }) => (
            <div key={r} className={`role-option${role === r ? ' selected' : ''}`} onClick={() => { setRole(r); formik.resetForm(); }}>
              <div className="text-2xl mb-1.5">{icon}</div>
              <div className="text-[13px] font-semibold text-(--text)">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-0">
          <div className="mb-4">
            <label className={lbl}>First Name</label>
            <input placeholder="Amara" className={fieldClass(formik.touched.firstName, formik.errors.firstName)} {...formik.getFieldProps('firstName')} />
            <FieldError message={err('firstName')} />
          </div>
          <div className="mb-4">
            <label className={lbl}>Last Name</label>
            <input placeholder="Osei" className={fieldClass(formik.touched.lastName, formik.errors.lastName)} {...formik.getFieldProps('lastName')} />
            <FieldError message={err('lastName')} />
          </div>
        </div>
        <div className="mb-4">
          <label className={lbl}>University Email</label>
          <input type="email" placeholder="you@university.edu" className={fieldClass(formik.touched.email, formik.errors.email)} {...formik.getFieldProps('email')} />
          <FieldError message={err('email')} />
        </div>
        <div className="mb-4">
          <label className={lbl}>Student / Staff ID</label>
          <input placeholder="U2024001" className={fieldClass(formik.touched.staffId, formik.errors.staffId)} {...formik.getFieldProps('staffId')} />
          <FieldError message={err('staffId')} />
        </div>
        <div className="mb-4">
          <label className={lbl}>Password</label>
          <input type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" className={fieldClass(formik.touched.password, formik.errors.password)} {...formik.getFieldProps('password')} />
          <FieldError message={err('password')} />
        </div>
        <div className="mb-4">
          <label className={lbl}>Confirm Password</label>
          <input type="password" placeholder="Repeat your password" className={fieldClass(formik.touched.confirmPassword, formik.errors.confirmPassword)} {...formik.getFieldProps('confirmPassword')} />
          <FieldError message={err('confirmPassword')} />
        </div>
        {isTutor && (
          <div className="mb-4">
            <label className={lbl}>Courses You Teach</label>
            <input placeholder="e.g. Data Structures, Algorithms" className={fieldClass(formik.touched.courses, formik.errors.courses)} {...formik.getFieldProps('courses')} />
            <FieldError message={err('courses')} />
          </div>
        )}

        <button type="button" className="btn-primary w-full justify-center py-3 text-[15px] font-bold mt-2" onClick={() => formik.handleSubmit()}>
          Create Account →
        </button>
        <div className="text-center text-[13px] text-[var(--text2)] mt-4">
          Already have an account?{' '}
          <span className="text-[var(--accent2)] cursor-pointer font-semibold" onClick={() => navigate('/login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
}
