/* DashboardShell — coquille générique (sidebar 210px + main).
   - Aucune donnée hardcodée spécifique élève/prof
   - Toute la donnée vient de `profile` et `navItems` (props)
   - Le contenu principal est passé via `children`
*/
import React from 'react';
import DashboardSidebar from './parts/DashboardSidebar.jsx';

export default function DashboardShell({
  profile,
  navItems = [],
  activeIndex = 0,
  footerText = 'METABLETON v0.4',
  children,
}) {
  return (
    <div
      className="metableton-dash-frame"
      style={{
        background: 'var(--mt-bg)',
        border: '1px solid var(--mt-border)',
        borderRadius: 'var(--mt-radius-lg)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '210px 1fr',
        minHeight: '540px',
      }}
    >
      <DashboardSidebar
        profile={profile}
        navItems={navItems}
        activeIndex={activeIndex}
        footerText={footerText}
      />

      <div
        style={{
          padding: '26px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        }}
      >
        {children}
      </div>

      {/* Responsive : sidebar cachée <1024px */}
      <style>{`
        @media (max-width: 1024px) {
          .metableton-dash-frame { grid-template-columns: 1fr !important; }
          .metableton-dash-frame > aside { display: none; }
        }
      `}</style>
    </div>
  );
}
