import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import type { Role } from '@/shared/types';

import {
  signupSchema,
  signupInitialValues,
} from '@/shared/lib/validation/signupSchema';

import { FieldError } from '@/shared/components/ui';
import { fieldClass } from '@/shared/lib/fieldClass';

import { useAuthStore } from '@/features/auth/authStore';

import { FcGoogle } from 'react-icons/fc';
import { GraduationCap, BookOpen } from 'lucide-react';

export function SignupPage() {
  const { signUp, signInWithGoogle } = useAuthStore();

  const navigate = useNavigate();

  const [role, setRole] =
    useState<Role>('student');

  const isTutor = role === 'tutor';

  const formik = useFormik({
    initialValues: signupInitialValues,

    validationSchema:
      signupSchema(isTutor),

    onSubmit: async (values) => {
      console.log('[Signup] submitted:', {
        role,
        ...values,
      });

      await signUp(
        values.email,
        values.confirmPassword
      );

      navigate(
        isTutor
          ? '/tutor/dashboard'
          : '/student/dashboard'
      );
    },
  });

  const err = (
    f: keyof typeof formik.errors
  ) =>
    formik.touched[f]
      ? formik.errors[f]
      : undefined;

  const lbl =
    'block text-[13px] font-medium text-[var(--text2)] mb-1.5';

  return (
    <div
      className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-6
overflow-hidden
      "
    >
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
          {/* TOP */}
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
              <GraduationCap
                size={22}
                className="text-[var(--text)]"
              />
            </div>

            <h1
              className="
                text-[28px]
                font-bold
                tracking-[-1px]
                text-[var(--text)]
                mb-1
              "
            >
              Create account
            </h1>

            <p
              className="
                text-sm
                text-[var(--text2)]
              "
            >
              Join CampusIQ and start
              learning smarter.
            </p>
          </div>

          {/* ROLE */}
          <div className="mb-6">
            <p
              className="
                text-[13px]
                font-medium
                text-[var(--text2)]
                mb-2
              "
            >
              Continue as
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  r: 'student',
                  label: 'Student',
                  icon: GraduationCap,
                },
                {
                  r: 'tutor',
                  label: 'Tutor',
                  icon: BookOpen,
                },
              ].map(
                ({
                  r,
                  label,
                  icon: Icon,
                }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r as Role);
                      formik.resetForm();
                    }}
                    className={`
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition-all

                      ${
                        role === r
                          ? `
                            border-[var(--accent)]
                            bg-[var(--accent)]/10
                          `
                          : `
                            border-[var(--border)]
                            bg-[var(--bg2)]
                            hover:bg-[var(--bg3)]
                          `
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

                    <div
                      className="
                        text-sm
                        font-semibold
                        text-[var(--text)]
                      "
                    >
                      {label}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={formik.handleSubmit}
          >
            {/* NAMES */}
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-4">
                <label className={lbl}>
                  First Name
                </label>

                <input
                  placeholder="Amara"
                  className={fieldClass(
                    formik.touched.firstName,
                    formik.errors.firstName
                  )}
                  {...formik.getFieldProps(
                    'firstName'
                  )}
                />

                <FieldError
                  message={err('firstName')}
                />
              </div>

              <div className="mb-4">
                <label className={lbl}>
                  Last Name
                </label>

                <input
                  placeholder="Osei"
                  className={fieldClass(
                    formik.touched.lastName,
                    formik.errors.lastName
                  )}
                  {...formik.getFieldProps(
                    'lastName'
                  )}
                />

                <FieldError
                  message={err('lastName')}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className={lbl}>
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className={fieldClass(
                  formik.touched.email,
                  formik.errors.email
                )}
                {...formik.getFieldProps(
                  'email'
                )}
              />

              <FieldError
                message={err('email')}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className={lbl}>
                Password
              </label>

              <input
                type="password"
                placeholder="Minimum 8 characters"
                className={fieldClass(
                  formik.touched.password,
                  formik.errors.password
                )}
                {...formik.getFieldProps(
                  'password'
                )}
              />

              <FieldError
                message={err('password')}
              />
            </div>

            {/* CONFIRM */}
            <div className="mb-4">
              <label className={lbl}>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Repeat password"
                className={fieldClass(
                  formik.touched
                    .confirmPassword,
                  formik.errors
                    .confirmPassword
                )}
                {...formik.getFieldProps(
                  'confirmPassword'
                )}
              />

              <FieldError
                message={err(
                  'confirmPassword'
                )}
              />
            </div>

            {/* TUTOR */}
            {isTutor && (
              <div className="mb-4">
                <label className={lbl}>
                  Courses You Teach
                </label>

                <input
                  placeholder="Data Structures, Algorithms... seprated by comma"
                  className={fieldClass(
                    formik.touched.courses,
                    formik.errors.courses
                  )}
                  {...formik.getFieldProps(
                    'courses'
                  )}
                />

                <FieldError
                  message={err('courses')}
                />
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="
                btn-primary
                w-full justify-center
                py-3
                text-[15px]
                font-semibold
                mt-2
              "
            >
              Create Account
            </button>
          </form>

          {/* DIVIDER */}
          <div
            className="
              flex items-center gap-3
              my-5
            "
          >
            <div className="h-px flex-1 bg-[var(--border)]" />

            <span
              className="
                text-xs
                text-[var(--text3)]
              "
            >
              or
            </span>

            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {/* GOOGLE */}
          <button
            onClick={signInWithGoogle}
            type="button"
            className="
              w-full
              h-12
              rounded-2xl
              border border-[var(--border)]
              bg-[var(--bg2)]
              hover:bg-[var(--bg3)]
              transition-colors

              flex items-center justify-center gap-3

              text-sm
              font-medium
              text-[var(--text)]
            "
          >
            <FcGoogle size={20} />

            Continue with Google
          </button>

          {/* TERMS */}
          <p
            className="
              text-center
              text-[12px]
              leading-6
              text-[var(--text3)]
              mt-5
            "
          >
            By continuing, you agree to
            our{' '}
            <a
              href="/terms"
              className="
                text-[var(--accent)]
                hover:underline
              "
            >
              Terms of Service
            </a>
          </p>

          {/* LOGIN */}
          <div
            className="
              text-center
              text-sm
              text-[var(--text2)]
              mt-5
            "
          >
            Already have an account?{' '}

            <button
              onClick={() =>
                navigate('/login')
              }
              className="
                text-[var(--accent2)]
                font-semibold
                hover:underline
              "
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}