import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layout/page-layout';
import { useMemo } from 'react';

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  const shouldRedirect = useMemo(() => !isAuthenticated && !isLoading, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading spinner if available
  }

  if (shouldRedirect) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}