import { LandingPage } from '@/pages/LandingPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminModeration } from '@/pages/admin/AdminModeration';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AuthCallback } from '@/pages/auth/AuthCallback';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AIAssistant } from '@/pages/student/AIAssistant';
import BookedSessions from '@/pages/student/BookedSessions';
import { BookingConfirmed } from '@/pages/student/BookingConfirmed';
import { BookingPage } from '@/pages/student/BookingPage';
import { StudentChat } from '@/pages/student/StudentChat';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { TutorProfileView } from '@/pages/student/TutorProfileView';
import { TutorSearch } from '@/pages/student/TutorSearch';
import { TutorChat } from '@/pages/tutor/TutorChat';
import { TutorDashboard } from '@/pages/tutor/TutorDashboard';
import { TutorProfileEdit } from '@/pages/tutor/TutorProfileEdit';
import TutorProfileForm from '@/pages/tutor/TutorProfileForm';
import { AppShell } from '@/shared/components/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './route/ProtecteRoute';
import PublicRoute from './route/PublicRoute';

export function AppRoutes() {
  return (
    <Routes>

      {/* ───────── PUBLIC ───────── */}
      <Route element={<PublicRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="auth/callback"
            element={<AuthCallback />}
          />
        </Route>
      </Route>

      {/* ───────── STUDENT ───────── */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<AppShell role="student" />}>
          <Route
            path="student/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="student/tutors"
            element={<TutorSearch />}
          />

          <Route
            path="student/tutors/:tutorId"
            element={<TutorProfileView />}
          />

          <Route
            path="student/booking/:tutorId"
            element={<BookingPage />}
          />

          <Route
            path="student/booking/confirmed"
            element={<BookingConfirmed />}
          />

          <Route
            path="student/chat"
            element={<StudentChat />}
          />

          <Route
            path="student/chat/:convoId"
            element={<StudentChat />}
          />

          <Route
            path="student/ai"
            element={<AIAssistant />}
          />

          <Route
            path="student/booking"
            element={<BookedSessions />}
          />
        </Route>
      </Route>

      {/* ───────── TUTOR ───────── */}
      <Route element={<ProtectedRoute role="tutor" />}>
        <Route element={<AppShell role="tutor" />}>
          <Route
            path="tutor/dashboard"
            element={<TutorDashboard />}
          />

          <Route
            path="tutor/onboarding"
            element={<TutorProfileForm/>}
          />

          <Route
            path="tutor/profile"
            element={<TutorProfileEdit />}
          />

          <Route
            path="tutor/chat"
            element={<TutorChat />}
          />

          <Route
            path="tutor/chat/:convoId"
            element={<TutorChat />}
          />
        </Route>
      </Route>

      {/* ───────── ADMIN ───────── */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppShell role="admin" />}>
          <Route
            path="admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="admin/moderation"
            element={<AdminModeration />}
          />
        </Route>
      </Route>

      {/* ───────── FALLBACK ───────── */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
