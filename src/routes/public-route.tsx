import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/auth-layout';

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}