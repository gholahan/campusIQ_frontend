import { Role, useAuthStore } from "@/features/auth";
import { useGetProfile } from "@/features/auth/hooks/useAuthApi";
import Authloader from "@/shared/components/ui/AuthLoader";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }: {role: Role}) => {
  const { session, initialized } = useAuthStore();
  const { user, isLoading } = useGetProfile();

  if (!initialized) return <Authloader />;

  if (!session) return <Navigate to="/login" replace />;

  if (isLoading && !user) {
    return <Authloader />;
  }

  if (role && user && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;