import { useAuthStore } from '@/features/auth/authStore';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';
import { loginInitialValues, loginSchema } from '@/shared/lib/validation/loginSchema';
import type { Role } from '@/shared/types';
import { useFormik } from 'formik';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { get_user_profile } from '@/features/auth/api/authApi';
import {queryClient} from '@/lib/react-query'


const DASHBOARD: Record<Role, string> = {
  student: '/student/dashboard', tutor: '/tutor/dashboard', admin: '/admin/dashboard',
};

export function LoginPage() {
  const {signIn, signInWithGoogle} = useAuthStore()
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string>('');

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
    setAuthError("");

    try {
      await signIn(values.email, values.password);

      const profile = await get_user_profile();
      console.log(profile)

      queryClient.setQueryData(["profile"], profile);

      navigate(DASHBOARD[profile.role]);
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
    }
  },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 page-enter bg-(--bg)">
      <div className="card p-10 w-full max-w-md">
        <div className="text-center mb-7">
          <div
            className="
              w-12 h-12 mx-auto mb-4
              rounded-2xl
              border border-(--border)
              bg-(--bg2)
              flex items-center justify-center
            "
          >
            <Sparkles
              size={20}
              className="text-[var(--accent2)]"
            />
          </div>
          <h2 className="font-display text-[26px] font-extrabold mb-1 text-(--text)">Welcome back</h2>
          <p className="text-(--text2) text-sm">Sign in to continue your learning journey</p>
        </div>
        
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-(--text2) mb-1.5">Email or Username</label>
          <input type="email" placeholder="amara@gmail.com" className={fieldClass(formik.touched.email, formik.errors.email)} {...formik.getFieldProps('email')} />
          <FieldError message={formik.touched.email ? formik.errors.email : undefined} />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-(--text2) mb-1.5">Password</label>
          <input type="password" placeholder="Your password" className={fieldClass(formik.touched.password, formik.errors.password)} {...formik.getFieldProps('password')} />
          <FieldError message={formik.touched.password ? formik.errors.password : undefined} />
        </div>

        {authError && <div className="mb-4 text-red-500 text-sm">{authError}</div>}

        <div className="flex justify-end mb-5">
          <span className="text-[13px] text-(--accent2) cursor-pointer font-medium">Forgot password?</span>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="
            btn-primary
            w-full justify-center
            py-3
            text-[15px]
            font-bold
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {formik.isSubmitting
            ? "Signing In..."
            : "Sign In →"}
        </button>

      </form>

        <div className="auth-divider"><span className="text-xs text-(--text3)">or</span></div>

        <button
        onClick={signInWithGoogle}
        type="button"
        className="btn-secondary w-full justify-center mb-4"
        >
          <FcGoogle size={18} />
          Continue with Google   
        </button>

        <div className="text-center text-[13px] text-(--text2)">
          Don't have an account?{' '}
          <span className="text-(--accent2) cursor-pointer font-semibold" onClick={() => navigate('/signup')}>Sign up</span>
        </div>
      </div>
    </div>
  );
}
