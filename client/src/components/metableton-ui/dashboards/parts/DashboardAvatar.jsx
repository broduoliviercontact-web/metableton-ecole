/* DashboardAvatar — initiales + gradient orange → vert.
   Tailles : 'default' (36px, sidebar) | 'small' (24px, table). */
import React from 'react';

export default function DashboardAvatar({ initials, size = 'default', style }) {
  const isSmall = size === 'small';
  return (
    <div
      className="metableton-avatar"
      style={{
        width: isSmall ? '24px' : '36px',
        height: isSmall ? '24px' : '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--mt-orange), var(--mt-green))',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700,
        fontSize: isSmall ? '10px' : '13px',
        color: '#111',
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
