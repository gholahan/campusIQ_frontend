import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import type { Role } from '@/shared/types';

import { signupSchema, signupInitialValues } from '@/shared/lib/validation/signupSchema';

import { FieldError } from '@/shared/components/ui';
import { supabase } from '@/lib/supabase';
import { fieldClass } from '@/shared/lib/fieldClass';
import { useAuthStore } from '@/features/auth/authStore';
import { FcGoogle } from 'react-icons/fc';
import { GraduationCap, BookOpen, Mail, Lock, User, ArrowRight, EyeOff } from 'lucide-react';
import { useSyncUser } from '@/features/auth/hooks/useAuthApi';
import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi';

export const PENDING_ROLE_KEY = 'campusiq_pending_role';

import { fadeUp } from '@/shared/animations/motion';

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
    if (!formik.isSubmitting) formik.resetForm();
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
        await signUp(values.email, values.password);
        let syncedUser;
        try {
          syncedUser = await syncUserAsync({
            role,
            first_name: values.firstName,
            last_name: values.lastName,
          });
          await supabase.auth.refreshSession();
        } catch (syncErr: any) {
          await supabase.auth.signOut();
          throw syncErr;
        }

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

  return (
    <div className="min-h-screen bg-(--bg) flex">
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
              <GraduationCap size={18} className="text-white" />
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
              Create Your<br />Account
            </h2>
            <p className="text-white/75 text-[15px] xl:text-base leading-relaxed max-w-md">
              Join thousands of students learning smarter. Choose your role and get started in seconds.
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
              { icon: User, text: 'Personalized learning paths' },
              { icon: Mail, text: 'Verified tutor & AI community' },
              { icon: ArrowRight, text: 'Quick onboarding in under 2 minutes' },
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
      <div className="flex-1 flex items-center justify-center px-4 py-6 lg:px-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[420px] rounded-[20px] border border-(--border) bg-(--surface) shadow-sm max-h-[92dvh] overflow-y-auto"
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-6"
            >
              <div className="w-11 h-11 rounded-2xl border border-(--border) bg-(--bg2) flex items-center justify-center mb-4">
                <GraduationCap size={22} className="text-(--text)" />
              </div>
              <h1 className="text-[26px] sm:text-[28px] font-bold tracking-[-1px] text-(--text) mb-1">
                Create account
              </h1>
              <p className="text-sm text-(--text2)">Join CampusIQ and start learning smarter.</p>
            </motion.div>

            {/* Role Picker */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-6"
            >
              <p className="text-[13px] font-medium text-(--text2) mb-2">Continue as</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { r: 'student', label: 'Student', icon: GraduationCap },
                  { r: 'tutor', label: 'Tutor', icon: BookOpen },
                ].map(({ r, label, icon: Icon }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r as Role)}
                    className={`
                      rounded-2xl border p-4 text-left transition-all
                      ${
                        role === r
                          ? 'border-(--accent) bg-(--accent)/10'
                          : 'border-(--border) bg-(--bg2) hover:bg-(--bg3)'
                      }
                    `}
                  >
                    <div className="w-9 h-9 rounded-xl border border-(--border) bg-(--surface) flex items-center justify-center mb-3">
                      <Icon size={18} />
                    </div>
                    <div className="text-sm font-semibold text-(--text)">{label}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
              {/* Names */}
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3 mb-4"
              >
                <div>
                  <label className={lbl}>First Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                    <input
                      className={fieldClass(formik.touched.firstName, formik.errors.firstName) + ' pl-10'}
                      {...formik.getFieldProps('firstName')}
                    />
                  </div>
                  <FieldError message={err('firstName')} />
                </div>
                <div>
                  <label className={lbl}>Last Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                    <input
                      className={fieldClass(formik.touched.lastName, formik.errors.lastName) + ' pl-10'}
                      {...formik.getFieldProps('lastName')}
                    />
                  </div>
                  <FieldError message={err('lastName')} />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mb-4"
              >
                <label className={lbl}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={fieldClass(formik.touched.email, formik.errors.email) + ' pl-10'}
                    {...formik.getFieldProps('email')}
                  />
                </div>
                <FieldError message={err('email')} />
              </motion.div>

              {/* Password */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mb-4"
              >
                <label className={lbl}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
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
                <FieldError message={err('password')} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mb-4"
              >
                <label className={lbl}>Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text3)" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat password"
                    className={fieldClass(formik.touched.confirmPassword, formik.errors.confirmPassword) + ' pl-10'}
                    {...formik.getFieldProps('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text3) hover:text-(--text2) transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <PiEyeSlashLight size={18} /> : <PiEyeLight size={18} />}
                  </button>
                </div>
                <FieldError message={err('confirmPassword')} />
              </motion.div>

              {/* Auth Error */}
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
                  {formik.isSubmitting ? 'Creating Account…' : 'Create Account →'}
                </button>
              </motion.div>
            </form>

            {/* Role error */}
            {roleError && (
              <p className="mt-2 text-sm text-red-500">{roleError}</p>
            )}

            {/* Divider */}
            <motion.div
              custom={7}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex items-center gap-3 my-5"
            >
              <div className="h-px flex-1 bg-(--border)" />
              <span className="text-xs text-(--text3)">or</span>
              <div className="h-px flex-1 bg-(--border)" />
            </motion.div>

            {/* Google */}
            <motion.button
              custom={8}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full h-12 rounded-2xl border border-(--border) bg-(--bg2) hover:bg-(--bg3) transition-colors flex items-center justify-center gap-3 text-sm font-medium text-(--text)"
            >
              <FcGoogle size={20} />
              Continue with Google
            </motion.button>

            {/* Terms */}
            <motion.p
              custom={9}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-center text-[12px] leading-6 text-(--text3) mt-5"
            >
              By continuing, you agree to our{' '}
              <span className="text-(--accent) cursor-pointer hover:underline">
                Terms of Service
              </span>
            </motion.p>

            {/* Login link */}
            <motion.div
              custom={10}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-center text-sm text-(--text2) mt-5"
            >
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-(--accent2) font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign in
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
