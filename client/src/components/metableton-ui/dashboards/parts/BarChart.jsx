/* BarChart — barres verticales CSS pur, label centré. */
import React from 'react';

export default function BarChart({ values = [], labels = [], height = 130, accent = 'orange' }) {
  if (!values || values.length === 0) return null;
  const gradient =
    accent === 'cyan'
      ? 'linear-gradient(to top, var(--mt-cyan-dim), var(--mt-cyan), var(--mt-cyan-bright))'
      : 'linear-gradient(to top, var(--mt-orange), oklch(55% 0.14 50))';
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          height: `${height}px`,
        }}
      >
        {values.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              minHeight: '8px',
              borderRadius: '4px 4px 0 0',
              background: gradient,
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      {labels && labels.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '10px',
            color: 'var(--mt-muted)',
            fontFamily: 'var(--mt-font-mono)',
            textTransform: 'uppercase',
          }}
        >
          {labels.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      )}
    </div>
  );
}
