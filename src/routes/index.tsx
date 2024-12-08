import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { PrivateRoute } from './private-route';
import { PublicRoute } from './public-route';
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { NotFoundPage } from '@/pages/not-found';
import { LoginPage } from '@/pages/auth/login';
import { HomePage } from '@/pages/home';
import { ProfilePage } from '@/pages/profile';
import { CalendarPage } from '@/pages/calendar';
import { ScanPage } from '@/pages/scan';

// Activities
import { AllActivityPage } from '@/pages/activities';
import { ActivityPage } from '@/pages/activities/view';
import { MyActivityPage } from '@/pages/activities/me';

// Projects
import { AllProjectPage } from '@/pages/projects';
import { ProjectPage } from '@/pages/projects/view';
import { CreateProjectPage } from '@/pages/projects/create';
import { EditProjectPage } from '@/pages/projects/edit';
import { RestoreProjectPage } from '@/pages/projects/restore';

// Locations
import { AllLocationPage } from '@/pages/locations';
import { LocationPage } from '@/pages/locations/view';
import { CreateLocationPage } from '@/pages/locations/create';
import { EditLocationPage } from '@/pages/locations/edit';

// Users
import { AllUserPage } from '@/pages/users';
import { UserPage } from '@/pages/users/view';
import { CreateUserPage } from '@/pages/users/create';
import { EditUserPage } from '@/pages/users/edit';

// Groups
import { AllGroupPage } from '@/pages/groups';
import { GroupPage } from '@/pages/groups/view';
import { CreateGroupPage } from '@/pages/groups/create';
import { EditGroupPage } from '@/pages/groups/edit';

const publicRoutes = [
  { path: ROUTES.LOGIN, element: <LoginPage /> },
];

const privateRoutes = [
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.PROFILE, element: <ProfilePage /> },
  { path: ROUTES.CALENDAR, element: <CalendarPage /> },
  { path: ROUTES.SCAN, element: <ScanPage /> },

  // Activities
  { path: ROUTES.ACTIVITY.BASE, element: <AllActivityPage /> },
  { path: ROUTES.ACTIVITY.VIEW, element: <ActivityPage /> },
  { path: ROUTES.ACTIVITY.ME, element: <MyActivityPage /> },

  // Projects
  { path: ROUTES.PROJECT.BASE, element: <AllProjectPage /> },
  { path: ROUTES.PROJECT.VIEW, element: <ProjectPage /> },
  { path: ROUTES.PROJECT.CREATE, element: <CreateProjectPage /> },
  { path: ROUTES.PROJECT.EDIT, element: <EditProjectPage /> },
  { path: ROUTES.PROJECT.RESTORE, element: <RestoreProjectPage /> },

  // Locations
  { path: ROUTES.LOCATION.BASE, element: <AllLocationPage /> },
  { path: ROUTES.LOCATION.VIEW, element: <LocationPage /> },
  { path: ROUTES.LOCATION.CREATE, element: <CreateLocationPage /> },
  { path: ROUTES.LOCATION.EDIT, element: <EditLocationPage /> },

  // Users
  { path: ROUTES.USER.BASE, element: <AllUserPage /> },
  { path: ROUTES.USER.VIEW, element: <UserPage /> },
  { path: ROUTES.USER.CREATE, element: <CreateUserPage /> },
  { path: ROUTES.USER.EDIT, element: <EditUserPage /> },

  // Groups
  { path: ROUTES.GROUP.BASE, element: <AllGroupPage /> },
  { path: ROUTES.GROUP.VIEW, element: <GroupPage /> },
  { path: ROUTES.GROUP.CREATE, element: <CreateGroupPage /> },
  { path: ROUTES.GROUP.EDIT, element: <EditGroupPage /> },
];

export function AppRoutes() {
  return (
    <BreadcrumbProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {privateRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BreadcrumbProvider>
  );
}