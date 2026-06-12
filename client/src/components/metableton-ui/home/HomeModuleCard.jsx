/* HomeModuleCard — 1 carte module : strip colorée + icône SVG + titre + desc */
import React from 'react';

const ICONS = {
  ableton: (
    <svg viewBox="0 0 10 10" style={{ width: 10, height: 10, fill: 'currentColor' }}>
      <rect x="1" y="1" width="8" height="8" rx="1" />
    </svg>
  ),
  mao: (
    <svg viewBox="0 0 10 10" style={{ width: 10, height: 10, fill: 'currentColor' }}>
      <circle cx="5" cy="5" r="4" />
    </svg>
  ),
  synth: (
    <svg viewBox="0 0 10 10" style={{ width: 10, height: 10, fill: 'currentColor' }}>
      <path d="M1 5 L5 1 L9 5 L5 9 Z" />
    </svg>
  ),
  mix: (
    <svg viewBox="0 0 10 10" style={{ width: 10, height: 10, fill: 'currentColor' }}>
      <path d="M1 8 L3 4 L5 6 L7 2 L9 5" />
    </svg>
  ),
};

const STRIP_COLORS = {
  cyan: 'var(--mt-cyan)',
  green: 'var(--mt-green)',
  blue: 'var(--mt-blue)',
  white: 'rgba(255, 255, 255, 0.35)',
};

const ICON_COLORS = {
  cyan: 'var(--mt-cyan)',
  green: 'var(--mt-green)',
  blue: 'var(--mt-blue)',
  white: 'var(--mt-fg)',
};

export default function HomeModuleCard({
  strip = 'cyan',
  icon = 'ableton',
  title,
  description,
}) {
  return (
    <div
      className="metableton-home-module"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--mt-surface)',
        border: '1px solid var(--mt-border)',
        borderRadius: 'var(--mt-radius-sm)',
        overflow: 'hidden',
        transition: 'border-color .2s, transform .2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--mt-muted)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--mt-border)';
        e.currentTarget.style.transform = '';
      }}
    >
      <div
        className={`mod-strip ${strip}`}
        style={{
          width: '4px',
          flexShrink: 0,
          background: STRIP_COLORS[strip] || STRIP_COLORS.cyan,
        }}
      />
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div
          className="mod-icon"
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '3px',
            marginBottom: '6px',
            border: '1px solid var(--mt-border)',
            display: 'grid',
            placeItems: 'center',
            color: ICON_COLORS[strip] || ICON_COLORS.cyan,
          }}
        >
          {ICONS[icon] || ICONS.ableton}
        </div>
        <h4
          style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--mt-fg)',
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--mt-muted)',
            lineHeight: 1.45,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
