/* DashboardShell — coquille visuelle (sidebar 210px + main).
   Statique : pas de <NavLink>, pas de useAuth. */
import React from 'react';

const SIDEBAR_STYLE = {
  background: 'var(--mt-surface)',
  borderRight: '1px solid var(--mt-border)',
  padding: '22px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const NAV_ITEM_BASE = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 10px',
  borderRadius: 'var(--mt-radius-sm)',
  fontSize: '13px',
  color: 'var(--mt-muted)',
  textDecoration: 'none',
  transition: '.15s',
  cursor: 'default',
};

export default function DashboardShell({
  userInitials,
  userName,
  userRole,
  navItems,
  activeIndex = 0,
  header,
  stats,
  cards,
  versionLabel = 'METABLETON v0.4',
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
      {/* Sidebar */}
      <aside style={SIDEBAR_STYLE}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <div
            className="metableton-avatar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--mt-orange), var(--mt-green))',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#111',
              flexShrink: 0,
            }}
          >
            {userInitials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>{userName}</div>
            <div
              style={{ fontSize: '11px', color: 'var(--mt-muted)' }}
            >
              {userRole}
            </div>
          </div>
        </div>

        {navItems.map((label, i) => (
          <div
            key={label}
            style={{
              ...NAV_ITEM_BASE,
              background: i === activeIndex ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: i === activeIndex ? 'var(--mt-fg)' : 'var(--mt-muted)',
              boxShadow: i === activeIndex ? 'inset 2px 0 0 var(--mt-orange)' : 'none',
            }}
          >
            {label}
          </div>
        ))}

        <div
          className="metableton-sidebar-foot"
          style={{
            marginTop: 'auto',
            paddingTop: '14px',
            borderTop: '1px solid var(--mt-border)',
            fontSize: '11px',
            color: 'var(--mt-muted)',
            fontFamily: 'var(--mt-font-mono)',
          }}
        >
          {versionLabel}
        </div>
      </aside>

      {/* Main */}
      <div
        style={{
          padding: '26px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        }}
      >
        {header}
        {stats}
        {cards}
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
