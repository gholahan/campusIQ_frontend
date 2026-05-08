import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/shared/components/layout';

import { LandingPage }       from '@/pages/LandingPage';
import { LoginPage }         from '@/pages/auth/LoginPage';
import { SignupPage }        from '@/pages/auth/SignupPage';
import { StudentDashboard }  from '@/pages/student/StudentDashboard';
import { TutorSearch }       from '@/pages/student/TutorSearch';
import { TutorProfileView }  from '@/pages/student/TutorProfileView';
import { BookingPage }       from '@/pages/student/BookingPage';
import { BookingConfirmed }  from '@/pages/student/BookingConfirmed';
import { StudentChat }       from '@/pages/student/StudentChat';
import { AIAssistant }       from '@/pages/student/AIAssistant';
import { TutorDashboard }    from '@/pages/tutor/TutorDashboard';
import { TutorProfileEdit }  from '@/pages/tutor/TutorProfileEdit';
import { TutorChat }         from '@/pages/tutor/TutorChat';
import { AdminDashboard }    from '@/pages/admin/AdminDashboard';
import { AdminUsers }        from '@/pages/admin/AdminUsers';
import { AdminModeration }   from '@/pages/admin/AdminModeration';
import { AuthCallback } from '@/pages/auth/AuthCallback';

export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<AppShell />}>
        <Route index         element={<LandingPage />} />
        <Route path="login"  element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>
      
      {/* ── Student ── */}
      <Route element={<AppShell role="student" />}>
        <Route path="student/dashboard"         element={<StudentDashboard />} />
        <Route path="student/tutors"            element={<TutorSearch />} />
        <Route path="student/tutors/:tutorId"   element={<TutorProfileView />} />
        <Route path="student/booking/:tutorId"  element={<BookingPage />} />
        <Route path="student/booking/confirmed" element={<BookingConfirmed />} />
        <Route path="student/chat"              element={<StudentChat />} />
        <Route path="student/chat/:convoId"     element={<StudentChat />} />
        <Route path="student/ai"                element={<AIAssistant />} />
      </Route>

      {/* ── Tutor ── */}
      <Route element={<AppShell role="tutor" />}>
        <Route path="tutor/dashboard"     element={<TutorDashboard />} />
        <Route path="tutor/profile"       element={<TutorProfileEdit />} />
        <Route path="tutor/chat"          element={<TutorChat />} />
        <Route path="tutor/chat/:convoId" element={<TutorChat />} />
      </Route>

      {/* ── Admin ── */}
      <Route element={<AppShell role="admin" />}>
        <Route path="admin/dashboard"  element={<AdminDashboard />} />
        <Route path="admin/users"      element={<AdminUsers />} />
        <Route path="admin/moderation" element={<AdminModeration />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
