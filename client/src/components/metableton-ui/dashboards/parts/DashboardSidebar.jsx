/* DashboardSidebar — avatar + nom + rôle + nav items + footer. */
import React from 'react';
import DashboardAvatar from './DashboardAvatar.jsx';

export default function DashboardSidebar({
  profile,
  navItems = [],
  activeIndex = 0,
  footerText = 'METABLETON v0.4',
}) {
  return (
    <aside
      style={{
        background: 'var(--mt-surface)',
        borderRight: '1px solid var(--mt-border)',
        padding: '22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {profile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <DashboardAvatar initials={profile.initials} size="default" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>{profile.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--mt-muted)' }}>{profile.role}</div>
          </div>
        </div>
      )}

      {navItems.map((item, i) => {
        const label = typeof item === 'string' ? item : item.label;
        const isActive = i === activeIndex;
        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 10px',
              borderRadius: 'var(--mt-radius-sm)',
              fontSize: '13px',
              color: isActive ? 'var(--mt-fg)' : 'var(--mt-muted)',
              background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
              boxShadow: isActive ? 'inset 2px 0 0 var(--mt-orange)' : 'none',
              transition: '.15s',
              cursor: 'default',
            }}
          >
            {label}
          </div>
        );
      })}

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
        {footerText}
      </div>
    </aside>
  );
}
