import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { PrivateRoute } from './private-route';
import { PublicRoute } from './public-route';
import { LoginPage } from '@/pages/auth/login';
import { DashboardPage } from '@/pages/dashboard';
import { ProfilePage } from '@/pages/profile';
import { NotFoundPage } from '@/pages/not-found';
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";

export function AppRoutes() {
  return (
    <BreadcrumbProvider>
    <Routes>
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BreadcrumbProvider>
  );
}