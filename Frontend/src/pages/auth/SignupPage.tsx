import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import type { Role } from '@/shared/types';

import { signupSchema, signupInitialValues } from '@/shared/lib/validation/signupSchema';

import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';
import { useAuthStore } from '@/features/auth/authStore';
import { FcGoogle } from 'react-icons/fc';
import { GraduationCap, BookOpen } from 'lucide-react';
import { useSyncUser } from '@/features/auth/hooks/useAuthApi';
import { queryClient } from '@/lib/react-query';
import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi';
export const PENDING_ROLE_KEY = 'campusiq_pending_role';

export function SignupPage() {
  const { syncUserAsync } = useSyncUser();
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuthStore();
  const [authError, setAuthError] = useState<string>('');
  const [roleError, setRoleError] = useState<string>('');
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setRoleError('');
    localStorage.setItem(PENDING_ROLE_KEY, r);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: signupInitialValues,
    validationSchema: signupSchema(),

    onSubmit: async (values) => {
      if (!role) {
        setRoleError('Please select a role before continuing.');
        return;
      }

      try {
        const res = await signUp(values.email, values.password);
        console.log('res:', res);

        // cancel any /me or /profile queries that fired the moment the
        // token was set — the user doesn't exist in the backend yet
        await queryClient.cancelQueries({ queryKey: ["me"] });
        await queryClient.cancelQueries({ queryKey: ["profile"] });
        queryClient.removeQueries({ queryKey: ["me"] });
        queryClient.removeQueries({ queryKey: ["profile"] });

        const syncedUser = await syncUserAsync({
          role,
          first_name: values.firstName,
          last_name: values.lastName,
        });

        // now the user exists — let queries run fresh
        await queryClient.invalidateQueries({ queryKey: ["me"] });

        localStorage.removeItem(PENDING_ROLE_KEY);
        navigate(`/${syncedUser.role}/dashboard`);
      } catch (err: any) {
        setAuthError(err.message || 'Signup failed');
      }
    },
  });

  const err = (f: keyof typeof formik.errors) =>
    formik.touched[f] ? formik.errors[f] : undefined;

  const lbl = 'block text-[13px] font-medium text-[var(--text2)] mb-1.5';

  const handleGoogleSignIn = () => {
    if (!role) {
      setRoleError('Please select a role before continuing with Google.');
      return;
    }
    signInWithGoogle();
  };

  // if (status === 'verification_pending') {
  //   return <div>Check your email to verify your account.</div>;
  // }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-6 overflow-hidden">
      <div
        className="
          w-full max-w-md
          rounded-[28px]
          border border-[var(--border)]
          bg-[var(--surface)]
          shadow-sm
          max-h-[92dvh]
          flex flex-col
        "
      >
        {/* SCROLL AREA */}
        <div className="overflow-y-auto px-5 sm:px-6 py-6">

          {/* HEADER */}
          <div className="mb-6">
            <div
              className="
                w-11 h-11 rounded-2xl
                border border-[var(--border)]
                bg-[var(--bg2)]
                flex items-center justify-center
                mb-4
              "
            >
              <GraduationCap size={22} className="text-[var(--text)]" />
            </div>

            <h1 className="text-[28px] font-bold tracking-[-1px] text-[var(--text)] mb-1">
              Create account
            </h1>
            <p className="text-sm text-[var(--text2)]">
              Join CampusIQ and start learning smarter.
            </p>
          </div>

          {/* ROLE PICKER */}
          <div className="mb-6">
            <p className="text-[13px] font-medium text-[var(--text2)] mb-2">Continue as</p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { r: 'student', label: 'Student', icon: GraduationCap },
                { r: 'tutor',   label: 'Tutor',   icon: BookOpen },
              ].map(({ r, label, icon: Icon }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r as Role)}
                  className={`
                    rounded-2xl border p-4 text-left transition-all
                    ${
                      role === r
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                        : 'border-[var(--border)] bg-[var(--bg2)] hover:bg-[var(--bg3)]'
                    }
                  `}
                >
                  <div
                    className="
                      w-9 h-9 rounded-xl
                      border border-[var(--border)]
                      bg-[var(--surface)]
                      flex items-center justify-center
                      mb-3
                    "
                  >
                    <Icon size={18} />
                  </div>
                  <div className="text-sm font-semibold text-[var(--text)]">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={formik.handleSubmit}>

            {/* NAMES */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={lbl}>First Name</label>
                <input
                  className={fieldClass(formik.touched.firstName, formik.errors.firstName)}
                  {...formik.getFieldProps('firstName')}
                />
                <FieldError message={err('firstName')} />
              </div>

              <div>
                <label className={lbl}>Last Name</label>
                <input
                  className={fieldClass(formik.touched.lastName, formik.errors.lastName)}
                  {...formik.getFieldProps('lastName')}
                />
                <FieldError message={err('lastName')} />
              </div>
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className={lbl}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={fieldClass(formik.touched.email, formik.errors.email)}
                {...formik.getFieldProps('email')}
              />
              <FieldError message={err('email')} />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className={lbl}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  className={fieldClass(formik.touched.password, formik.errors.password)}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <PiEyeSlashLight size={18} /> : <PiEyeLight size={18} />}
                </button>
              </div>
              <FieldError message={err('password')} />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-4">
              <label className={lbl}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  className={fieldClass(formik.touched.confirmPassword, formik.errors.confirmPassword)}
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <PiEyeSlashLight size={18} /> : <PiEyeLight size={18} />}
                </button>
              </div>
              <FieldError message={err('confirmPassword')} />
            </div>

            {/* AUTH ERROR */}
            {authError && (
              <div className="mb-4 text-red-500 text-sm">{authError}</div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="
                btn-primary w-full justify-center py-3
                text-[15px] font-bold disabled:opacity-50
                transition-colors disabled:cursor-not-allowed
              "
            >
              {formik.isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
          {roleError && (
              <p className="mt-2 text-sm text-red-500">{roleError}</p>
            )}

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--text3)]">or</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="
              w-full h-12 rounded-2xl
              border border-[var(--border)]
              bg-[var(--bg2)] hover:bg-[var(--bg3)]
              transition-colors
              flex items-center justify-center gap-3
              text-sm font-medium text-[var(--text)]
            "
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* TERMS */}
          <p className="text-center text-[12px] leading-6 text-[var(--text3)] mt-5">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-[var(--accent)] hover:underline">
              Terms of Service
            </a>
          </p>

          {/* LOGIN LINK */}
          <div className="text-center text-sm text-[var(--text2)] mt-5">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[var(--accent2)] font-semibold hover:underline"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}