/* DashboardPanel — carte générique (titre + contenu). Utilise MetabletonCard en interne. */
import React from 'react';
import MetabletonCard from '../../primitives/MetabletonCard.jsx';

export default function DashboardPanel({
  title,
  actions,
  padding = 20,
  hover = false,
  children,
}) {
  return (
    <MetabletonCard padding={padding} hover={hover}>
      {(title || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            gap: '12px',
          }}
        >
          {title && (
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{title}</div>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </MetabletonCard>
  );
}
