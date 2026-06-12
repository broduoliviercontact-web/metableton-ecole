/* DesignPreviewPage — racine preview.
   - importe tokens.css (uniquement ici, jamais dans main.jsx)
   - encapsule tout dans <div className="metableton-theme"> pour scoper
   - sous-router interne : /home, /dashboard/student, /dashboard/teacher
*/
import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import HomePreview from '../home/HomePreview.jsx';
import StudentDashboardPreview from '../dashboards/StudentDashboardPreview.jsx';
import TeacherDashboardPreview from '../dashboards/TeacherDashboardPreview.jsx';
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
      <span
        style={{
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'var(--mt-green)',
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

function BackToProdLink() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '14px',
        right: '14px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--mt-border)',
        borderRadius: 'var(--mt-radius-sm)',
        padding: '6px 10px',
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
        }}
      >
        ← retour app
      </Link>
    </div>
  );
}

export default function DesignPreviewPage() {
  return (
    <div className="metableton-theme">
      <BackToProdLink />
      <Routes>
        <Route index element={<PreviewIndex />} />
        <Route path="home" element={<HomePreview />} />
        <Route path="dashboard/student" element={<StudentDashboardPreview />} />
        <Route path="dashboard/teacher" element={<TeacherDashboardPreview />} />
        <Route path="*" element={<NotFoundInPreview />} />
        {/* Pas de fallback prod, on reste dans le sandbox */}
        <Route path="prod" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
