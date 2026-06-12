/* HomeHero — kicker + h1 avec em cyan + paragraphe + 2 boutons */
import React from 'react';
import MetabletonButton from '../primitives/MetabletonButton.jsx';

export default function HomeHero() {
  return (
    <div className="metableton-home-hero">
      <span
        style={{
          fontFamily: 'var(--mt-font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--mt-green)',
          marginBottom: '20px',
          display: 'block',
        }}
      >
        École en ligne — MAO &amp; Production
      </span>
      <h1
        style={{
          fontFamily: 'var(--mt-font-display)',
          fontSize: 'clamp(38px, 4.6vw, 70px)',
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          fontWeight: 800,
          marginBottom: '20px',
          textWrap: 'balance',
          color: 'var(--mt-fg)',
        }}
      >
        Maîtrisez <em style={{ color: 'var(--mt-cyan)', fontStyle: 'normal' }}>
          Ableton&nbsp;Live
        </em> comme un studio.
      </h1>
      <p
        style={{
          color: 'var(--mt-muted)',
          fontSize: '16px',
          maxWidth: '42ch',
          lineHeight: 1.6,
          marginBottom: '34px',
        }}
      >
        Synthèse, production, mix. Des cours professionnels dans une interface
        pensée comme un DAW.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <MetabletonButton variant="primary" as="a" href="#">
          Commencer
        </MetabletonButton>
        <MetabletonButton as="a" href="#">
          Voir le programme
        </MetabletonButton>
      </div>
    </div>
  );
}
