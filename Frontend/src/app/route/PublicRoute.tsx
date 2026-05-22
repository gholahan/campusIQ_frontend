import { useGetMe } from '@/features/auth/hooks/useAuthApi';
import Authloader from '@/shared/components/ui/AuthLoader';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { me, isLoading } = useGetMe();

  if (isLoading) {
    return <Authloader />;
  }

  if (me) {
    const destination =
      me.role === 'tutor' && !me.onboarding_complete
        ? '/tutor/onboarding'
        : `/${me.role}/dashboard`;
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;