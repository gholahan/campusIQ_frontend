import { useGetMe } from '@/features/auth/hooks/useAuthApi';
import Authloader from '@/shared/components/ui/AuthLoader';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { me, isLoading } = useGetMe();

  if (isLoading) {
    return <Authloader />;
  }

  if (me) {
    return (
      <Navigate
        to={`/${me.role}/dashboard`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;