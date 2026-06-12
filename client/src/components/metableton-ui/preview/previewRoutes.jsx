/* previewRoutes — déclare les routes preview (ré-export vers App.jsx).
   Ce fichier n'est PAS importé par App.jsx directement : il documente
   l'arbre de routes pour la relecture. Les routes sont déclarées inline
   dans DesignPreviewPage pour rester self-contained. */

import React from 'react';
import { Route } from 'react-router-dom';
import DesignPreviewPage from './DesignPreviewPage.jsx';
import HomePreview from '../home/HomePreview.jsx';
import StudentDashboardPreview from '../dashboards/StudentDashboardPreview.jsx';
import TeacherDashboardPreview from '../dashboards/TeacherDashboardPreview.jsx';

// L'arborescence effective (gérée par DesignPreviewPage) :
//
// <Route path="/design-preview"           element={<DesignPreviewPage />}>
//   index                                  → PreviewIndex
//   <Route path="home"                     element={<HomePreview />} />
//   <Route path="dashboard/student"        element={<StudentDashboardPreview />} />
//   <Route path="dashboard/teacher"        element={<TeacherDashboardPreview />} />
// </Route>

export const PREVIEW_ROUTES = [
  { path: '/design-preview/home',                 component: HomePreview },
  { path: '/design-preview/dashboard/student',    component: StudentDashboardPreview },
  { path: '/design-preview/dashboard/teacher',    component: TeacherDashboardPreview },
];

// Route principale à brancher dans App.jsx (export nommé pour réutilisation
// par les tests de composant si besoin).
export const PreviewRoot = DesignPreviewPage;
