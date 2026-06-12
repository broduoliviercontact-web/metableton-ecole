/* StudentDashboardPreview — fixtures locales, aucune dépendance React-Router ou useAuth */
import React from 'react';
import DashboardShell from './DashboardShell.jsx';
import MetabletonCard from '../primitives/MetabletonCard.jsx';
import MetabletonBadge from '../primitives/MetabletonBadge.jsx';

const NAV = ['Tableau de bord', 'Mes cours', 'Agenda', 'Devoirs', 'Progression'];

const STATS = [
  { label: 'Cours actifs',       value: '3',  change: '+1 ce mois' },
  { label: 'Heures de pratique', value: '48h', change: '+12h cette semaine' },
  { label: 'Progression moyenne', value: '72%', change: '+5% vs janvier' },
];

/* Progress ring — conic-gradient reproduit la référence (--p:var) */
function ProgressRing({ percent, label }) {
  return (
    <div
      className="metableton-progress-ring"
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: `conic-gradient(var(--mt-orange) ${percent}%, var(--mt-border) 0)`,
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

export default function StudentDashboardPreview() {
  return (
    <DashboardShell
      userInitials="AL"
      userName="Alex L."
      userRole="Élève"
      navItems={NAV}
      activeIndex={0}
      header={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--mt-font-display)',
              fontSize: '20px',
              letterSpacing: '-0.02em',
              color: 'var(--mt-fg)',
              fontWeight: 700,
            }}
          >
            Bonjour, Alex
          </h2>
          <MetabletonBadge variant="orange">Niveau 4 — Intermédiaire</MetabletonBadge>
        </div>
      }
      stats={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
          }}
        >
          {STATS.map(({ label, value, change }) => (
            <div
              key={label}
              style={{
                background: 'var(--mt-surface)',
                border: '1px solid var(--mt-border)',
                borderRadius: 'var(--mt-radius-md)',
                padding: '18px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--mt-muted)',
                  marginBottom: '8px',
                  fontFamily: 'var(--mt-font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--mt-fg)',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--mt-green)',
                  marginTop: '6px',
                  fontFamily: 'var(--mt-font-mono)',
                }}
              >
                {change}
              </div>
            </div>
          ))}
        </div>
      }
      cards={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <MetabletonCard padding={20}>
            <div style={{ fontWeight: 700, marginBottom: '14px', fontSize: '15px' }}>
              Cours en cours
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <ProgressRing percent={78} label="78%" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Ableton Live</div>
                  <div style={{ fontSize: '12px', color: 'var(--mt-muted)' }}>
                    Leçon 16/20 · Opérateurs FX
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <ProgressRing percent={45} label="45%" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Synthèse sonore</div>
                  <div style={{ fontSize: '12px', color: 'var(--mt-muted)' }}>
                    Leçon 7/16 · FM Basics
                  </div>
                </div>
              </div>
            </div>
          </MetabletonCard>

          <MetabletonCard padding={20}>
            <div style={{ fontWeight: 700, marginBottom: '14px', fontSize: '15px' }}>
              Prochaines sessions (Agenda)
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
            >
              <ClipSlot color="orange" name="Correction projet" time="Mer 14h" />
              <ClipSlot color="green"  name="Q&A Mix"           time="Ven 10h" />
              <ClipSlot color="empty"  name="—"                 time="Lun" />
              <ClipSlot color="empty"  name="—"                 time="Mar" />
            </div>
          </MetabletonCard>
        </div>
      }
    />
  );
}

function ClipSlot({ color, name, time }) {
  const isEmpty = color === 'empty';
  const leftColor =
    color === 'orange' ? 'var(--mt-orange)' :
    color === 'green' ? 'var(--mt-green)' :
    color === 'blue' ? 'var(--mt-blue)' :
    'transparent';

  return (
    <div
      style={{
        aspectRatio: '4/3',
        borderRadius: 'var(--mt-radius-sm)',
        border: '1px solid var(--mt-border)',
        background:
          color === 'orange' ? 'rgba(230,120,60,0.06)' :
          color === 'green' ? 'rgba(100,200,120,0.06)' :
          color === 'blue' ? 'rgba(80,140,255,0.06)' :
          'rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px',
        fontSize: '11px',
        fontFamily: 'var(--mt-font-mono)',
        borderLeft: `3px solid ${leftColor}`,
        opacity: isEmpty ? 0.5 : 1,
      }}
    >
      <div style={{ fontWeight: 600, fontFamily: 'var(--mt-font-body)', fontSize: '12px' }}>
        {name}
      </div>
      <div style={{ color: 'var(--mt-muted)' }}>{time}</div>
    </div>
  );
}
