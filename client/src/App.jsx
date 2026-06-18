import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DesignPreviewPage from './components/metableton-ui/preview/DesignPreviewPage.jsx';
import BetaInvitePage from './pages/BetaInvitePage.jsx';
import AdminBetaInvitationsPage from './pages/dashboard/AdminBetaInvitationsPage.jsx';
import StudentDashboardPage from './pages/dashboard/StudentDashboardPage.jsx';
import TeacherDashboardPage from './pages/dashboard/TeacherDashboardPage.jsx';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage.jsx';
import AdminCoursesPage from './pages/dashboard/AdminCoursesPage.jsx';
import CourseFormPage from './pages/dashboard/CourseFormPage.jsx';
import UserProfilePage from './pages/dashboard/UserProfilePage.jsx';
import HomePageV2 from './pages/HomePageV2.jsx';

const isDev = import.meta.env.DEV;

export default function App() {
  return (
    <Routes>
      {/* Public pages — Header + Footer */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePageV2 />} />
        {isDev && (
          <>
            <Route path="home-legacy" element={<HomePage />} />
            <Route path="home-v2" element={<HomePageV2 />} />
          </>
        )}
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:courseId" element={<CourseDetailPage />} />
        {/* Beta invitation acceptance page - public route */}
        <Route path="beta/invite/:token" element={<BetaInvitePage />} />
      </Route>

      {/* Dashboard pages — Dashboard layout + role-gated routes */}
      <Route path="dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        {/* Student dashboard — accessible by student, teacher, admin */}
        <Route
          index
          element={
            <RequireAuth allow="student">
              <StudentDashboardPage />
            </RequireAuth>
          }
        />
        {/* Teacher dashboard — accessible by teacher, admin */}
        <Route
          path="teacher"
          element={
            <RequireAuth allow="teacher">
              <TeacherDashboardPage />
            </RequireAuth>
          }
        />
        {/* Teacher: create new course */}
        <Route
          path="teacher/courses/new"
          element={
            <RequireAuth allow="teacher">
              <CourseFormPage mode="create" />
            </RequireAuth>
          }
        />
        {/* Teacher: edit existing course */}
        <Route
          path="teacher/courses/:courseId/edit"
          element={
            <RequireAuth allow="teacher">
              <CourseFormPage mode="edit" />
            </RequireAuth>
          }
        />
        {/* Admin dashboard — accessible by admin only */}
        <Route
          path="admin"
          element={
            <RequireAuth allow="admin">
              <AdminDashboardPage />
            </RequireAuth>
          }
        />
        {/* Admin: courses overview */}
        <Route
          path="admin/courses"
          element={
            <RequireAuth allow="admin">
              <AdminCoursesPage />
            </RequireAuth>
          }
        />
        {/* Admin: beta invitations */}
        <Route
          path="admin/beta-invitations"
          element={
            <RequireAuth allow="admin">
              <AdminBetaInvitationsPage />
            </RequireAuth>
          }
        />
        {/* User profile — accessible by all authenticated roles */}
        <Route
          path="profile"
          element={
            <RequireAuth>
              <UserProfilePage />
            </RequireAuth>
          }
        />
      </Route>

      {/* 404 — outside layouts for a clean error page */}
      <Route path="*" element={<NotFoundPage />} />

      {/* Isolated Open Design preview — sandbox, no auth, no API, no prod impact (DEV only) */}
      {isDev && <Route path="/design-preview/*" element={<DesignPreviewPage />} />}
    </Routes>
  );
}
