import { LandingPage } from '@/pages/LandingPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminModeration } from '@/pages/admin/AdminModeration';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AuthCallback } from '@/pages/auth/AuthCallback';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AIAssistant } from '@/pages/ai/AIAssistant';
import BookedSessions from '@/pages/student/BookedSessions';
import { SessionConfirmed } from '@/pages/student/SessionConfirmed';
import { SessionBookingPage } from '@/pages/student/SessionBookingPage';
import TutorSessions  from '@/pages/tutor/TutorSession';
import { StudentChat } from '@/pages/student/StudentChat';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { TutorProfileView } from '@/pages/student/TutorProfileView';
import { TutorSearch } from '@/pages/student/TutorSearch';
import { TutorChat } from '@/pages/tutor/TutorChat';
import { TutorDashboard } from '@/pages/tutor/TutorDashboard';
import { TutorProfileEdit } from '@/pages/tutor/TutorProfile';
import TutorProfileForm from '@/pages/tutor/TutorProfileForm';
import { AppShell } from '@/shared/components/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Route/ProtectedRoute';
import PublicRoute from './Route/PublicRoute';
import SessionDetails from '@/features/session/SessionDetails';

export function AppRoutes() {
  return (
    <Routes>

      <Route path="auth/callback" element={<AuthCallback />} />

      {/* ───────── PUBLIC ───────── */}
      <Route element={<PublicRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
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
            element={<SessionBookingPage/>}
          />

          <Route
            path="student/booking/confirmed"
            element={<SessionConfirmed />}
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
            path="student/sessions"
            element={<BookedSessions/>}
            />
            
           <Route
            path="/student/sessions/:sessionId"
            element={<SessionDetails role="student" />}
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

          <Route
            path="tutor/sessions"
            element={<TutorSessions />}
          />
          <Route
            path="/tutor/sessions/:sessionId"
            element={<SessionDetails role="tutor" />}
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
