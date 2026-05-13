import { useGetProfile } from '@/features/auth/hooks/useAuthApi';
import Authloader from '@/shared/components/ui/AuthLoader';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { user, isLoading } = useGetProfile();

  if (isLoading) {
    return <Authloader />;
  }

  if (user) {
    return (
      <Navigate
        to={`/${user.role}/dashboard`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;