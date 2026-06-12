/* MetabletonCard — autonome, importe zéro depuis client/src/components/ui */
import React from 'react';

export default function MetabletonCard({
  children,
  padding = 26,
  hover = true,
  className,
  style,
  ...rest
}) {
  const base = {
    background: 'var(--mt-surface)',
    border: '1px solid var(--mt-border)',
    borderRadius: 'var(--mt-radius-lg)',
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    transition: hover
      ? 'transform .2s ease, border-color .2s ease, box-shadow .2s ease'
      : undefined,
  };

  return (
    <div
      className={`metableton-card ${className || ''}`}
      style={{ ...base, ...style }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--mt-muted)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.borderColor = 'var(--mt-border)';
        e.currentTarget.style.boxShadow = '';
      } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
