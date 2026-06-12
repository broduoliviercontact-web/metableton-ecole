/* MetabletonButton — autonome, importe zéro depuis client/src/components/ui */
import React from 'react';

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid var(--mt-border)',
  background: 'var(--mt-surface)',
  color: 'var(--mt-fg)',
  padding: '10px 20px',
  borderRadius: 'var(--mt-radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--mt-font-body)',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'transform .12s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease',
};

const VARIANTS = {
  // Bouton par défaut (secondary)
  secondary: {},

  // Primary cyan (home / Spectrum)
  primary: {
    background: 'var(--mt-cyan)',
    color: '#0a0a0f',
    borderColor: 'var(--mt-cyan)',
  },

  // Primary orange (dashboards / Ableton)
  primaryOrange: {
    background: 'var(--mt-orange)',
    color: 'oklch(16% 0.02 50)',
    borderColor: 'var(--mt-orange)',
    fontWeight: 700,
  },

  // Petit bouton utilisé dans le header dashboard
  small: {
    padding: '8px 14px',
    fontSize: '12px',
  },
};

export default function MetabletonButton({
  children,
  variant = 'secondary',
  size = 'md',
  as: Tag = 'button',
  style,
  className,
  ...rest
}) {
  const merged = {
    ...BASE,
    ...(VARIANTS[variant] || {}),
    ...(size === 'sm' ? VARIANTS.small : {}),
    ...style,
  };

  // Hover géré en CSS via :hover inline (style prop) pour rester self-contained
  return (
    <Tag
      className={`metableton-button ${className || ''}`}
      style={merged}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = 'var(--mt-orange-deep)';
          e.currentTarget.style.borderColor = 'var(--mt-orange-deep)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,220,200,0.28)';
        } else if (variant === 'primaryOrange') {
          e.currentTarget.style.background = 'oklch(60% 0.17 50)';
          e.currentTarget.style.borderColor = 'oklch(60% 0.17 50)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(230,100,40,0.25)';
        } else {
          e.currentTarget.style.background = 'var(--mt-raised)';
          e.currentTarget.style.borderColor = 'var(--mt-muted)';
        }
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        if (variant === 'primary') {
          e.currentTarget.style.background = 'var(--mt-cyan)';
          e.currentTarget.style.borderColor = 'var(--mt-cyan)';
        } else if (variant === 'primaryOrange') {
          e.currentTarget.style.background = 'var(--mt-orange)';
          e.currentTarget.style.borderColor = 'var(--mt-orange)';
        } else {
          e.currentTarget.style.background = 'var(--mt-surface)';
          e.currentTarget.style.borderColor = 'var(--mt-border)';
        }
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
