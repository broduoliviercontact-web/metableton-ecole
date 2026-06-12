/* SpectrumAnalyzer — 24 barres animées CSS, courbe SVG statique, sans micro */
import React from 'react';

/* Durations et delays recopiés à l'identique depuis le HTML de référence. */
const BAR_TIMING = [
  [0.75, 0.00], [0.95, 0.12], [0.65, 0.05], [1.05, 0.18], [0.85, 0.08],
  [0.55, 0.22], [0.90, 0.14], [0.70, 0.03], [1.10, 0.20], [0.60, 0.10],
  [0.80, 0.28], [0.50, 0.06], [0.92, 0.16], [0.72, 0.24], [1.15, 0.04],
  [0.62, 0.12], [0.78, 0.26], [0.52, 0.08], [0.88, 0.18], [0.68, 0.02],
  [1.00, 0.14], [0.58, 0.22], [0.82, 0.06], [0.48, 0.16],
];

/* Peak (--pk) repris du HTML ; le rendu utilise ce % pour positionner la barre peak. */
const PEAKS = [75, 60, 82, 55, 70, 45, 68, 50, 78, 62, 85, 58, 90, 48, 72,
               40, 65, 35, 55, 30, 45, 25, 38, 20];

/* Classes de largeur (g-wide, g-mid, g-norm, g-treble, g-air) */
const WIDTHS = ['g-wide','g-wide','g-wide',
                'g-mid','g-mid','g-mid','g-mid',
                'g-norm','g-norm','g-norm','g-norm','g-norm','g-norm','g-norm',
                'g-treble','g-treble','g-treble','g-treble','g-treble','g-treble',
                'g-air','g-air','g-air','g-air'];

/* Les 4 premières et 4 dernières barres sont plus discrètes (rendu bord du spectre) */
const DIMMED = new Set([0, 1, 22, 23]);

export default function SpectrumAnalyzer() {
  return (
    <div
      className="metableton-spectrum"
      style={{
        background:
          'linear-gradient(180deg, oklch(19% 0.02 280), oklch(15% 0.015 280))',
        border: '1px solid var(--mt-border)',
        borderRadius: '10px',
        padding: '14px',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.55)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '390px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 0,
      }}
    >
      {/* Chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--mt-border)',
          paddingBottom: '10px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--mt-font-display)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '-0.01em',
              color: 'var(--mt-fg)',
            }}
          >
            Spectrum
          </span>
          <span
            style={{
              fontFamily: 'var(--mt-font-mono)',
              fontSize: '9px',
              color: 'var(--mt-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            FFT · 4096 · LIN
          </span>
        </div>
      </div>

      {/* Display */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '8px',
          minHeight: 0,
          position: 'relative',
          paddingTop: '10px',
        }}
      >
        {/* Échelle dB */}
        <div
          style={{
            width: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'var(--mt-font-mono)',
            fontSize: '9px',
            color: 'var(--mt-muted)',
            textAlign: 'right',
            paddingBottom: '18px',
            flexShrink: 0,
          }}
        >
          <span>0</span><span>-12</span><span>-24</span>
          <span>-36</span><span>-48</span><span>-60</span>
        </div>

        {/* Graph */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: '1px',
          }}
        >
          {/* Grille horizontale */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.035)',
                  width: '100%',
                }}
              />
            ))}
          </div>

          {/* Courbe SVG statique (forme typique spectre audio) */}
          <svg
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              opacity: 0.55,
              pointerEvents: 'none',
            }}
          >
            <path
              d="M0,90 Q15,88 25,80 T45,65 T60,55 T75,48 T90,42 T105,38 T120,35 T135,33 T150,32 T165,34 T180,38 T195,45 T210,55 T225,68 T240,82 T255,90 T270,94 T285,96 T300,97"
              fill="none"
              stroke="var(--mt-cyan)"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 3px rgba(0,220,200,0.4))' }}
            />
          </svg>

          {/* Barres */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '2px',
              position: 'relative',
              zIndex: 2,
              height: '100%',
            }}
          >
            {BAR_TIMING.map(([duration, delay], i) => {
              const isDimmed = DIMMED.has(i);
              return (
                <div
                  key={i}
                  className={`metableton-bar ${WIDTHS[i]}`}
                  style={{
                    flex: WIDTHS[i] === 'g-wide' ? 1.5
                        : WIDTHS[i] === 'g-mid' ? 1.1
                        : WIDTHS[i] === 'g-norm' ? 1.0
                        : WIDTHS[i] === 'g-treble' ? 0.75
                        : 0.55,
                    minHeight: '2px',
                    borderRadius: '1px 1px 0 0',
                    position: 'relative',
                    transformOrigin: 'bottom',
                    background: isDimmed
                      ? 'linear-gradient(to top, oklch(55% 0.10 195), var(--mt-cyan))'
                      : 'linear-gradient(to top, var(--mt-cyan-dim), var(--mt-cyan), var(--mt-cyan-bright))',
                    boxShadow: '0 0 12px rgba(0,220,200,0.18)',
                    opacity: isDimmed ? 0.55 : 1,
                    animation: `metabletonBarDrift ${duration}s ease-in-out ${delay}s infinite alternate`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '20%',
                      right: '20%',
                      height: '1.5px',
                      borderRadius: '1px',
                      background: 'rgba(255,255,255,0.7)',
                      boxShadow: '0 0 4px rgba(255,255,255,0.5)',
                      bottom: `${PEAKS[i]}%`,
                      zIndex: 3,
                      opacity: 0.85,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Axe fréquences */}
      <div
        style={{
          position: 'relative',
          height: '18px',
          flexShrink: 0,
          borderTop: '1px solid var(--mt-border)',
          marginTop: '4px',
        }}
      >
        {[
          ['20', '0%'],
          ['100', '15%'],
          ['500', '35%'],
          ['1k', '55%'],
          ['5k', '75%'],
          ['16k', '92%'],
          ['20k', '100%'],
        ].map(([label, left]) => (
          <span
            key={label}
            style={{
              position: 'absolute',
              top: '4px',
              left,
              fontFamily: 'var(--mt-font-mono)',
              fontSize: '9px',
              color: 'var(--mt-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transform: 'translateX(-50%)',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--mt-border)',
          paddingTop: '8px',
          marginTop: '6px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--mt-font-mono)',
            fontSize: '9px',
            color: 'var(--mt-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Input: Mic 1 · 48 kHz
        </span>
        <span
          style={{
            fontFamily: 'var(--mt-font-mono)',
            fontSize: '10px',
            color: 'var(--mt-cyan)',
            fontWeight: 700,
            letterSpacing: '0.06em',
          }}
        >
          Peak: -4.2 dBFS
        </span>
      </div>

      {/* Keyframes locales — scoped via className */}
      <style>{`
        @keyframes metabletonBarDrift {
          0%   { transform: scaleY(0.18); opacity: .55; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
