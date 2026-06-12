/* DashboardPreviewToolbar — barre de prévisualisation placée AU-DESSUS du dashboard.
   Plus de bouton "← retour app" en position fixed qui chevauchait le contenu.
   Cette barre est rendue par DesignPreviewPage (et non par DashboardShell),
   pour que le dashboard lui-même reste propre, comme s'il était une vraie page. */
import React from 'react';
import { Link } from 'react-router-dom';
import MetabletonBadge from '../../primitives/MetabletonBadge.jsx';

export default function DashboardPreviewToolbar({ label, children }) {
  return (
    <div
      className="metableton-preview-toolbar"
      style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '12px 20px',
        marginBottom: '24px',
        background: 'var(--mt-surface)',
        border: '1px solid var(--mt-border)',
        borderRadius: 'var(--mt-radius-md)',
        fontFamily: 'var(--mt-font-mono)',
        fontSize: '11px',
        letterSpacing: '0.08em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to="/design-preview"
          style={{
            color: 'var(--mt-fg)',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          ← index
        </Link>
        <span style={{ color: 'var(--mt-muted)' }}>·</span>
        <MetabletonBadge variant="cyan">preview</MetabletonBadge>
        {label && (
          <span
            style={{
              color: 'var(--mt-muted)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        )}
      </div>
      <Link
        to="/"
        style={{
          color: 'var(--mt-cyan)',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}
      >
        retour app →
      </Link>
    </div>
  );
}
