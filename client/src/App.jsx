import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import StudentDashboardPage from './pages/dashboard/StudentDashboardPage.jsx';
import TeacherDashboardPage from './pages/dashboard/TeacherDashboardPage.jsx';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public pages — Header + Footer */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:courseId" element={<CourseDetailPage />} />
      </Route>

      {/* Dashboard pages — Dashboard layout (role-based routing comes later) */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="teacher" element={<TeacherDashboardPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
      </Route>

      {/* 404 — outside layouts for a clean error page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
