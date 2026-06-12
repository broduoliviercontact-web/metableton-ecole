/* HomePreview — assemble nav + hero + spectrum + grille de modules.
   Reproduit la home "metableton-home-final.html" en React self-contained. */
import React from 'react';
import HomeHero from './HomeHero.jsx';
import SpectrumAnalyzer from './SpectrumAnalyzer.jsx';
import HomeModuleGrid from './HomeModuleGrid.jsx';
import MetabletonButton from '../primitives/MetabletonButton.jsx';

function HomeNav() {
  return (
    <nav
      style={{
        flexShrink: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--mt-border)',
      }}
    >
      <a
        href="#"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--mt-font-display)',
          fontWeight: 800,
          fontSize: '16px',
          letterSpacing: '-0.03em',
          textDecoration: 'none',
          color: 'var(--mt-fg)',
        }}
      >
        <span
          style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--mt-radius-sm)',
            background: 'var(--mt-cyan)',
            display: 'grid',
            placeItems: 'center',
            color: '#0a0a0f',
            fontSize: '12px',
            fontWeight: 900,
            boxShadow: '0 0 14px rgba(0,220,200,0.25)',
          }}
        >
          M
        </span>
        METABLETON
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <a
              href="#"
              style={{
                color: 'var(--mt-muted)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Cours
            </a>
          </li>
          <li>
            <a
              href="#"
              style={{
                color: 'var(--mt-muted)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Professeurs
            </a>
          </li>
          <li>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--mt-font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '5px 10px',
                borderRadius: '999px',
                border: '1px solid var(--mt-border)',
                color: 'var(--mt-green)',
                background: 'rgba(100,200,140,0.08)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--mt-green)',
                  boxShadow: '0 0 6px var(--mt-green)',
                }}
              />
              Classroom
            </span>
          </li>
        </ul>
        <MetabletonButton variant="primary" as="a" href="#">
          Se connecter
        </MetabletonButton>
      </div>
    </nav>
  );
}

export default function HomePreview() {
  return (
    <div
      className="metableton-home-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 48px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <HomeNav />

      <section
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1.05fr',
          gap: '56px',
          alignItems: 'center',
          minHeight: 0,
          padding: '32px 0 20px',
        }}
      >
        <HomeHero />
        <SpectrumAnalyzer />
      </section>

      <section style={{ flexShrink: 0, paddingBottom: '32px' }}>
        <HomeModuleGrid />
      </section>

      {/* Responsive global : passe en scroll <900px (overflow hidden → auto) */}
      <style>{`
        @media (max-width: 900px) {
          .metableton-home-modules { grid-template-columns: repeat(2, 1fr) !important; }
          .metableton-home-shell {
            height: auto !important;
            min-height: 100vh !important;
            padding: 0 24px !important;
            overflow: visible !important;
          }
          .metableton-home-shell > section:first-of-type {
            grid-template-columns: 1fr !important;
            padding: 36px 0 28px !important;
            gap: 36px !important;
          }
          .metableton-home-shell > section:first-of-type > div {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
