/* DashboardStatCard — 1 stat (label + value + delta vert). */
import React from 'react';

export default function DashboardStatCard({ label, value, change, accent = 'green' }) {
  return (
    <div
      style={{
        background: 'var(--mt-surface)',
        border: '1px solid var(--mt-border)',
        borderRadius: 'var(--mt-radius-md)',
        padding: '18px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: 'var(--mt-muted)',
          marginBottom: '8px',
          fontFamily: 'var(--mt-font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '26px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--mt-fg)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: accent === 'green' ? 'var(--mt-green)' : 'var(--mt-muted)',
          marginTop: '6px',
          fontFamily: 'var(--mt-font-mono)',
        }}
      >
        {change}
      </div>
    </div>
  );
}
