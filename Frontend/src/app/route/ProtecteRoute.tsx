import { Role, useAuthStore } from "@/features/auth";
import { useGetMe } from "@/features/auth/hooks/useAuthApi";
import Authloader from "@/shared/components/ui/AuthLoader";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ role }: { role: Role }) => {
  const location = useLocation();

  const { session, initialized } = useAuthStore();
  const { me, isLoading } = useGetMe();

  if (!initialized) {
    return <Authloader />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading && !me) {
    return <Authloader />;
  }

  // ✅ Prevent redirect loop
  if (
    me?.role === "tutor" &&
    !me?.onboarding_complete &&
    location.pathname !== "/tutor/onboarding"
  ) {
    return <Navigate to="/tutor/onboarding" replace />;
  }

  // ✅ Prevent tutor from accessing onboarding after completion
  if (
    me?.role === "tutor" &&
    me?.onboarding_complete &&
    location.pathname === "/tutor/onboarding"
  ) {
    return <Navigate to="/tutor/dashboard" replace />;
  }

  // ✅ Role protection
  if (role && me && me.role !== role) {
    return <Navigate to={`/${me.role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;