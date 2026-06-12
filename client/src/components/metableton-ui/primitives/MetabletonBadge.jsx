/* MetabletonBadge — autonome, importe zéro depuis client/src/components/ui */
import React from 'react';

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'var(--mt-font-mono)',
  fontSize: '11px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  padding: '5px 10px',
  borderRadius: '999px',
  border: '1px solid var(--mt-border)',
  color: 'var(--mt-muted)',
  background: 'rgba(255, 255, 255, 0.03)',
  whiteSpace: 'nowrap',
};

const VARIANTS = {
  default: {},
  cyan: {
    color: 'var(--mt-cyan)',
    borderColor: 'rgba(0, 220, 200, 0.25)',
    background: 'rgba(0, 220, 200, 0.08)',
  },
  green: {
    color: 'var(--mt-green)',
    borderColor: 'rgba(100, 200, 120, 0.25)',
    background: 'rgba(100, 200, 120, 0.08)',
  },
  blue: {
    color: 'var(--mt-blue)',
    borderColor: 'rgba(80, 140, 255, 0.25)',
    background: 'rgba(80, 140, 255, 0.08)',
  },
  orange: {
    color: 'var(--mt-orange)',
    borderColor: 'rgba(230, 120, 60, 0.25)',
    background: 'rgba(230, 120, 60, 0.08)',
  },
  danger: {
    color: 'var(--mt-danger)',
    borderColor: 'var(--mt-danger)',
    background: 'rgba(0, 0, 0, 0.1)',
  },
};

export default function MetabletonBadge({
  children,
  variant = 'default',
  className,
  style,
  ...rest
}) {
  return (
    <span
      className={`metableton-badge ${className || ''}`}
      style={{ ...BASE, ...(VARIANTS[variant] || {}), ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}
