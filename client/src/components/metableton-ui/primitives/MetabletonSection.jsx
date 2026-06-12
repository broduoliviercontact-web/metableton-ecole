/* MetabletonSection — wrapper sémantique (kicker + titre + sous-titre + children) */
import React from 'react';

export default function MetabletonSection({
  kicker,
  title,
  subtitle,
  children,
  style,
  ...rest
}) {
  return (
    <section
      className="metableton-section"
      style={{ padding: '40px 0', ...style }}
      {...rest}
    >
      <div
        style={{
          width: 'min(1200px, 92vw)',
          marginInline: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {kicker && (
          <span
            style={{
              fontFamily: 'var(--mt-font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--mt-green)',
              marginBottom: '12px',
              display: 'inline-block',
            }}
          >
            {kicker}
          </span>
        )}
        {title && (
          <h2
            style={{
              fontFamily: 'var(--mt-font-display)',
              fontSize: 'clamp(24px, 2.6vw, 32px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: subtitle ? '10px' : '24px',
              color: 'var(--mt-fg)',
              fontWeight: 800,
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            style={{
              color: 'var(--mt-muted)',
              fontSize: '15px',
              maxWidth: '58ch',
              marginBottom: '28px',
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
