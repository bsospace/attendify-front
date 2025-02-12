import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { PrivateRoute } from './private-route'
import { PublicRoute } from './public-route'
import { BreadcrumbProvider } from '@/providers/breadcrumb-provider'
import { NotFoundPage } from '@/pages/not-found'
import { LoginPage } from '@/pages/auth/login'
import { HomePage } from '@/pages/home'
import { ProfilePage } from '@/pages/profile'
import { CalendarPage } from '@/pages/calendar'
import { ScanPage } from '@/pages/scan'

// Activities
import { AllActivityPage } from '@/pages/activities'
import { ActivityPage } from '@/pages/activities/view'
import { MyActivityPage } from '@/pages/activities/me'

// Projects
import { AllProjectPage } from '@/pages/projects'
import { ProjectPage } from '@/pages/projects/view'
import { CreateProjectPage } from '@/pages/projects/create'
import { EditProjectPage } from '@/pages/projects/edit'
import { RestoreProjectPage } from '@/pages/projects/restore'

// Locations
import { AllLocationPage } from '@/pages/locations'

// Users
import { AllUserPage } from '@/pages/users'
import { UserPage } from '@/pages/users/view'
import { CreateUserPage } from '@/pages/users/create'
import { EditUserPage } from '@/pages/users/edit'

// Groups
import { AllGroupPage } from '@/pages/groups'
import { GroupPage } from '@/pages/groups/view'
import Callback from '@/pages/auth/callback'
import { Announcement } from '@/pages/events/announcements'

const publicRoutes = [
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.CALLBACK, element: <Callback /> }
]

const privateRoutes = [
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.PROFILE, element: <ProfilePage /> },
  { path: ROUTES.CALENDAR, element: <CalendarPage /> },
  { path: ROUTES.SCAN, element: <ScanPage /> },
  { path: ROUTES.ANNOUNCEMENT.BASE, element: <Announcement /> },

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

  // Users
  { path: ROUTES.USER.BASE, element: <AllUserPage /> },
  { path: ROUTES.USER.VIEW, element: <UserPage /> },
  { path: ROUTES.USER.CREATE, element: <CreateUserPage /> },
  { path: ROUTES.USER.EDIT, element: <EditUserPage /> },

  // Groups
  { path: ROUTES.GROUP.BASE, element: <AllGroupPage /> },
  { path: ROUTES.GROUP.VIEW, element: <GroupPage /> },
]

export function AppRoutes () {
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
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BreadcrumbProvider>
  )
}
