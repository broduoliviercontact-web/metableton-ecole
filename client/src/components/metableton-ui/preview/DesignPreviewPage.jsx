/* DesignPreviewPage — racine preview.
   - importe tokens.css (uniquement ici, jamais dans main.jsx)
   - encapsule tout dans <div className="metableton-theme"> pour scoper
   - sous-router interne : /home, /dashboard/student, /dashboard/teacher
   - la DashboardPreviewToolbar est rendue au-dessus des routes dashboard,
     PAS en position fixed (corrige le chevauchement avec "+ Nouveau devoir"
     et "Niveau 4 — Intermédiaire").
*/
import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import HomePreview from '../home/HomePreview.jsx';
import StudentDashboardPreview from '../dashboards/StudentDashboardPreview.jsx';
import TeacherDashboardPreview from '../dashboards/TeacherDashboardPreview.jsx';
import DashboardPreviewToolbar from '../dashboards/parts/DashboardPreviewToolbar.jsx';
import MetabletonButton from '../primitives/MetabletonButton.jsx';
import '../tokens.css';

function PreviewIndex() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '60px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'flex-start',
        width: 'min(900px, 92vw)',
        margin: '0 auto',
      }}
    >
      <PreviewHeader />
      <span
        style={{
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'var(--mt-green)',
        }}
      >
        Sandbox — Open Design preview
      </span>
      <h1
        style={{
          fontFamily: 'var(--mt-font-display)',
          fontSize: 'clamp(28px, 3.2vw, 40px)',
          letterSpacing: '-0.03em',
          color: 'var(--mt-fg)',
          fontWeight: 800,
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Choisis une vue à inspecter
      </h1>
      <p
        style={{
          color: 'var(--mt-muted)',
          fontSize: '15px',
          maxWidth: '60ch',
          lineHeight: 1.6,
        }}
      >
        Cette page est isolée du code de production. Aucun composant de cette
        preview n'est consommé par l'app existante. Aucun appel API, aucune
        dépendance ajoutée.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
        <Link to="/design-preview/home" style={{ textDecoration: 'none' }}>
          <MetabletonButton variant="primary">Voir la home</MetabletonButton>
        </Link>
        <Link to="/design-preview/dashboard/student" style={{ textDecoration: 'none' }}>
          <MetabletonButton variant="primaryOrange">
            Dashboard élève
          </MetabletonButton>
        </Link>
        <Link to="/design-preview/dashboard/teacher" style={{ textDecoration: 'none' }}>
          <MetabletonButton>Dashboard professeur</MetabletonButton>
        </Link>
      </div>

      <div
        style={{
          marginTop: '32px',
          padding: '20px 24px',
          background: 'var(--mt-surface)',
          border: '1px solid var(--mt-border)',
          borderRadius: 'var(--mt-radius-md)',
          maxWidth: '60ch',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mt-font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--mt-muted)',
            marginBottom: '8px',
          }}
        >
          Convention
        </div>
        <p style={{ color: 'var(--mt-muted)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
          Tout ce qui s'affiche ici est scopé sous{' '}
          <code style={{ color: 'var(--mt-cyan)' }}>.metableton-theme</code> via{' '}
          <code style={{ color: 'var(--mt-cyan)' }}>tokens.css</code>. Les variables{' '}
          <code style={{ color: 'var(--mt-cyan)' }}>--mt-*</code> ne peuvent pas
          polluer l'app de production.
        </p>
      </div>
    </div>
  );
}

function PreviewHeader() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--mt-border)',
      }}
    >
      <Link
        to="/"
        style={{
          color: 'var(--mt-fg)',
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '11px',
          textDecoration: 'none',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        ← retour app
      </Link>
      <span
        style={{
          color: 'var(--mt-muted)',
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        /design-preview
      </span>
    </div>
  );
}

function HomePreviewWithHeader() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '24px 0',
      }}
    >
      <div style={{ width: 'min(1280px, 92vw)', margin: '0 auto 16px' }}>
        <PreviewHeader />
      </div>
      <HomePreview />
    </div>
  );
}

function StudentDashboardWithToolbar() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '32px 0',
      }}
    >
      <div style={{ width: 'min(1200px, 92vw)', margin: '0 auto' }}>
        <DashboardPreviewToolbar label="Student dashboard" />
        <StudentDashboardPreview />
      </div>
    </div>
  );
}

function TeacherDashboardWithToolbar() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '32px 0',
      }}
    >
      <div style={{ width: 'min(1200px, 92vw)', margin: '0 auto' }}>
        <DashboardPreviewToolbar label="Teacher dashboard" />
        <TeacherDashboardPreview />
      </div>
    </div>
  );
}

function NotFoundInPreview() {
  const location = useLocation();
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '60px 0',
        width: 'min(900px, 92vw)',
        margin: '0 auto',
        color: 'var(--mt-fg)',
      }}
    >
      <PreviewHeader />
      <span
        style={{
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'var(--mt-green)',
          display: 'inline-block',
          marginTop: '24px',
        }}
      >
        Preview — 404
      </span>
      <h1
        style={{
          fontFamily: 'var(--mt-font-display)',
          fontSize: '28px',
          letterSpacing: '-0.03em',
          color: 'var(--mt-fg)',
          fontWeight: 800,
          marginTop: '12px',
        }}
      >
        Route preview inconnue : {location.pathname}
      </h1>
      <p style={{ color: 'var(--mt-muted)', marginTop: '12px' }}>
        <Link to="/design-preview" style={{ color: 'var(--mt-cyan)' }}>
          Retour à l'index
        </Link>
      </p>
    </div>
  );
}

export default function DesignPreviewPage() {
  return (
    <div className="metableton-theme">
      <Routes>
        <Route index element={<PreviewIndex />} />
        <Route path="home" element={<HomePreviewWithHeader />} />
        <Route path="dashboard/student" element={<StudentDashboardWithToolbar />} />
        <Route path="dashboard/teacher" element={<TeacherDashboardWithToolbar />} />
        <Route path="*" element={<NotFoundInPreview />} />
        <Route path="prod" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
