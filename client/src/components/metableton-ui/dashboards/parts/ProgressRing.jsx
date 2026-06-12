/* ProgressRing — anneau conic-gradient, label central.
   Couleur paramétrable : 'orange' (défaut) | 'cyan' | 'green' | 'blue'. */
import React from 'react';

const COLOR_VAR = {
  orange: 'var(--mt-orange)',
  cyan:   'var(--mt-cyan)',
  green:  'var(--mt-green)',
  blue:   'var(--mt-blue)',
};

export default function ProgressRing({
  percent,
  label,
  color = 'orange',
  size = 60,
}) {
  const stroke = COLOR_VAR[color] || COLOR_VAR.orange;
  return (
    <div
      className="metableton-progress-ring"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `conic-gradient(${stroke} ${percent}%, var(--mt-border) 0)`,
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'relative',
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '12px',
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
}
