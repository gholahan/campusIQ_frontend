import { Navigate, Outlet } from 'react-router-dom';
import { Role, useAuthStore } from '@/features/auth';

const PublicRoute = () => {
  const session = useAuthStore((state) => state.session);
  const initialized = useAuthStore((state) => state.initialized);
  // const { me, isLoading } = useGetMe();

  if (!initialized) {
    return null;
  }

  const metadata = session?.user.app_metadata as
    | { role?: Role; onboarding_complete?: boolean }
    | undefined;

  if (session && metadata?.role) {
    const destination = metadata.role === 'tutor' && !metadata.onboarding_complete
        ? '/tutor/onboarding'
        : `/${metadata.role}/dashboard`;
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;