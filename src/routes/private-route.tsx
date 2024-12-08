import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layout/page-layout';

export function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}