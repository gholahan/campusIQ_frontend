import { Role, useAuthStore } from "@/features/auth";
// import Authloader from "@/shared/components/ui/AuthLoader";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ role }: { role: Role }) => {
  const location = useLocation();

  const session = useAuthStore((state) => state.session);
  const initialized = useAuthStore((state) => state.initialized);
  const metadata = session?.user.app_metadata as
    | { role?: Role; onboarding_complete?: boolean }
    | undefined;
  // const { me, isLoading } = useGetMe();

  // Do not redirect until the initial Supabase session lookup has completed.
  if (!initialized) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Prevent redirect loop
  if (
    metadata?.role === "tutor" &&
    !metadata?.onboarding_complete &&
    location.pathname !== "/tutor/onboarding"
  ) {
    return location.pathname === "/tutor/onboarding" ? null : (
      <Navigate to="/tutor/onboarding" replace />
    );
  }

  // ✅ Prevent tutor from accessing onboarding after completion
  if (
    metadata?.role === "tutor" &&
    metadata?.onboarding_complete &&
    location.pathname === "/tutor/onboarding"
  ) {
    return <Navigate to="/tutor/dashboard" replace />;
  }

  // ✅ Role protection
  if (role && metadata?.role && metadata.role !== role) {
    const destination = `/${metadata.role}/dashboard`;
    return location.pathname === destination ? null : (
      <Navigate to={destination} replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;