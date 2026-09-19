import { useAuthStore } from '@/features/auth/authStore';
import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';
import { loginInitialValues, loginSchema } from '@/shared/lib/validation/loginSchema';
import type { Role } from '@/shared/types';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, EyeOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi';
import { get_me } from '@/features/auth/api/authApi';

const DASHBOARD: Record<Role, string> = {
  student: '/student/dashboard',
  tutor: '/tutor/dashboard',
  admin: '/admin/dashboard',
};

import { fadeUp } from '@/shared/animations/motion';

export function LoginPage() {
  const { signIn, signInWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submitting = useRef(false);

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      if (submitting.current) return;
      submitting.current = true;
      setAuthError('');
      try {
        const res = await signIn(values.email, values.password);
        const role = res.data.session?.user.app_metadata?.role as Role | undefined;
        if (role) {
          navigate(DASHBOARD[role], { replace: true });
        } else {
          const me = await get_me();
          navigate(DASHBOARD[me.role], { replace: true });
        }
      } catch (err: any) {
        setAuthError(err.message || 'Login failed');
      } finally {
        submitting.current = false;
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-(--bg)">
      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-(--accent) via-(--accent2) to-(--cpurple)">
        {/* Decorative orbs */}
        <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[300px] h-[300px] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full bg-white/5 blur-[60px]" />

        {/* Nav logo */}
        <div className="relative z-10 px-10 pt-8">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">CampusIQ</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="font-display font-extrabold text-[40px] xl:text-[52px] leading-[1.1] text-white mb-5">
              Welcome Back,<br />Student!
            </h2>
            <p className="text-white/75 text-[15px] xl:text-base leading-relaxed max-w-md">
              Sign in to continue your learning journey. Access expert tutors, AI assistance, and your personalized dashboard.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-12 space-y-5"
          >
            {[
              { icon: Mail, text: 'Smart email-based sign in' },
              { icon: Lock, text: 'Secure authentication with 2FA ready' },
              { icon: ArrowRight, text: 'Instant access to your dashboard' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.12 }}
                className="flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-white" />
                </div>
                <span className="text-white/80 text-[14px] font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom branding */}
        <div className="relative z-10 px-10 pb-8 flex items-center justify-between">
          <span className="text-white/40 text-xs">© 2026 CampusIQ</span>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 lg:px-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="card w-full max-w-[420px] p-7 sm:p-9"
        >
          {/* Header */}
          <div className="text-center mb-7">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="w-12 h-12 mx-auto mb-4 rounded-2xl border border-(--border) bg-(--bg2) flex items-center justify-center"
            >
              <Sparkles size={20} className="text-(--accent2)" />
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-display text-[24px] sm:text-[26px] font-extrabold mb-1 text-(--text)"
            >
              Welcome back
            </motion.h2>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-(--text2) text-sm"
            >
              Sign in to continue your learning journey
            </motion.p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-4"
            >
              <label className="block text-[13px] font-semibold text-(--text2) mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={fieldClass(formik.touched.email, formik.errors.email) + ' pl-10'}
                  {...formik.getFieldProps('email')}
                />
              </div>
              <FieldError message={formik.touched.email ? formik.errors.email : undefined} />
            </motion.div>

            {/* Password */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-4"
            >
              <label className="block text-[13px] font-semibold text-(--text2) mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className={fieldClass(formik.touched.password, formik.errors.password) + ' pl-10'}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text3) hover:text-(--text2) transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <PiEyeSlashLight size={18} /> : <PiEyeLight size={18} />}
                </button>
              </div>
              <FieldError message={formik.touched.password ? formik.errors.password : undefined} />
            </motion.div>

            {/* Error */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-red-500 text-sm flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-2 dark:bg-red-900/20 dark:border-red-800/40"
              >
                <EyeOff size={14} />
                {authError}
              </motion.div>
            )}

            {/* Forgot password */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex justify-end mb-5"
            >
              <span className="text-[13px] text-(--accent2) cursor-pointer font-medium hover:underline transition-colors">
                Forgot password?
              </span>
            </motion.div>

            {/* Submit */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="btn-primary w-full justify-center py-3 text-[15px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? 'Signing In...' : 'Sign In →'}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="auth-divider mt-5"
          >
            <span className="text-xs text-(--text3)">or</span>
          </motion.div>

          {/* Google */}
          <motion.button
            custom={8}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            onClick={signInWithGoogle}
            type="button"
            className="btn-secondary w-full justify-center"
          >
            <FcGoogle size={18} />
            Continue with Google
          </motion.button>

          {/* Footer */}
          <motion.div
            custom={9}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-center text-[13px] text-(--text2) mt-6"
          >
            Don't have an account?{' '}
            <span className="text-(--accent2) cursor-pointer font-semibold hover:underline" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
