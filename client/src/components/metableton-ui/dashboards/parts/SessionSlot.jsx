/* SessionSlot — cellule clip-slot (variantes : orange / green / blue / empty). */
import React from 'react';

const VARIANT_STYLES = {
  orange: { left: 'var(--mt-orange)', bg: 'rgba(230,120,60,0.06)' },
  green:  { left: 'var(--mt-green)',  bg: 'rgba(100,200,120,0.06)' },
  blue:   { left: 'var(--mt-blue)',   bg: 'rgba(80,140,255,0.06)' },
  empty:  { left: 'transparent',      bg: 'rgba(255,255,255,0.02)' },
};

export default function SessionSlot({ title, time, variant = 'empty' }) {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.empty;
  const isEmpty = variant === 'empty';
  return (
    <div
      style={{
        aspectRatio: '4/3',
        borderRadius: 'var(--mt-radius-sm)',
        border: '1px solid var(--mt-border)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px',
        fontSize: '11px',
        fontFamily: 'var(--mt-font-mono)',
        borderLeft: `3px solid ${v.left}`,
        opacity: isEmpty ? 0.5 : 1,
      }}
    >
      <div style={{ fontWeight: 600, fontFamily: 'var(--mt-font-body)', fontSize: '12px' }}>
        {title}
      </div>
      <div style={{ color: 'var(--mt-muted)' }}>{time}</div>
    </div>
  );
}
