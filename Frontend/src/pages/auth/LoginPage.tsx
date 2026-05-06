import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import type { Role } from '@/shared/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, loginInitialValues } from '@/shared/lib/validation/loginSchema';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';

const ROLES: { r: Role; icon: string; label: string }[] = [
  { r: 'student', icon: '🎓', label: 'Student' },
  { r: 'tutor',   icon: '📚', label: 'Tutor' },
  { r: 'admin',   icon: '🛡️', label: 'Admin' },
];
const DASHBOARD: Record<Role, string> = {
  student: '/student/dashboard', tutor: '/tutor/dashboard', admin: '/admin/dashboard',
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('student');

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log('[Login] submitted:', { role, ...values });
      login(role);
      navigate(DASHBOARD[role]);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 page-enter bg-[var(--bg)]">
      <div className="card p-10 w-full max-w-md">
        <div className="text-center mb-7">
          <div className="text-[32px] mb-2">🎓</div>
          <h2 className="font-display text-[26px] font-extrabold mb-1 text-[var(--text)]">Welcome back</h2>
          <p className="text-[var(--text2)] text-sm">Sign in to continue your learning journey</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {ROLES.map(({ r, icon, label }) => (
            <div
              key={r}
              onClick={() => setRole(r)}
              className={`role-option${role === r ? ' selected' : ''}`}
            >
              <div className="text-2xl mb-1.5">{icon}</div>
              <div className="text-[13px] font-semibold text-[var(--text)]">{label}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Email or Username</label>
          <input type="email" placeholder="amara@gmail.com" className={fieldClass(formik.touched.email, formik.errors.email)} {...formik.getFieldProps('email')} />
          <FieldError message={formik.touched.email ? formik.errors.email : undefined} />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-[var(--text2)] mb-1.5">Password</label>
          <input type="password" placeholder="Your password" className={fieldClass(formik.touched.password, formik.errors.password)} {...formik.getFieldProps('password')} />
          <FieldError message={formik.touched.password ? formik.errors.password : undefined} />
        </div>

        <div className="flex justify-end mb-5">
          <span className="text-[13px] text-[var(--accent2)] cursor-pointer font-medium">Forgot password?</span>
        </div>

        <button type="button" className="btn-primary w-full justify-center py-3 text-[15px] font-bold" onClick={() => formik.handleSubmit()}>
          Sign In →
        </button>

        <div className="auth-divider"><span className="text-xs text-[var(--text3)]">or</span></div>

        <button type="button" className="btn-secondary w-full justify-center mb-4">Continue with Google</button>

        <div className="text-center text-[13px] text-[var(--text2)]">
          Don't have an account?{' '}
          <span className="text-[var(--accent2)] cursor-pointer font-semibold" onClick={() => navigate('/signup')}>Sign up</span>
        </div>
      </div>
    </div>
  );
}
