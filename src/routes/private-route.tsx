import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layout/page-layout';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  const shouldRedirect = useMemo(() => !isAuthenticated && !isLoading, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-12 h-12 animate-spin' />
      </div>
    );
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