/* TeacherDashboardPreview — fixtures locales, aucune dépendance React-Router ou useAuth */
import React from 'react';
import DashboardShell from './DashboardShell.jsx';
import MetabletonCard from '../primitives/MetabletonCard.jsx';
import MetabletonBadge from '../primitives/MetabletonBadge.jsx';
import MetabletonButton from '../primitives/MetabletonButton.jsx';

const NAV = ['Vue d\'ensemble', 'Mes classes', 'Élèves', 'Devoirs', 'Analytique'];

const STATS = [
  { label: 'Élèves actifs',       value: '124', change: '+8 cette semaine' },
  { label: 'Cours publiés',      value: '6',   change: '2 en brouillon' },
  { label: 'Taux de complétion', value: '81%', change: '+3% vs septembre' },
];

const BAR_HEIGHTS = [55, 72, 48, 90, 66, 78, 60]; // Lun → Dim
const BAR_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const SUBMISSIONS = [
  { initials: 'AL', name: 'Alex L.',  assignment: 'Drum pattern polymètre', status: 'Rendu',     variant: 'green'  },
  { initials: 'SM', name: 'Sam M.',   assignment: 'Session Wavetable',     status: 'En cours',  variant: 'orange' },
  { initials: 'JD', name: 'Jules D.', assignment: 'Mix critique',          status: 'Non rendu', variant: 'danger' },
];

export default function TeacherDashboardPreview() {
  return (
    <DashboardShell
      userInitials="LM"
      userName="L. Martin"
      userRole="Professeur"
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
            Tableau de bord
          </h2>
          <MetabletonButton variant="primaryOrange" as="a" href="#" size="sm">
            + Nouveau devoir
          </MetabletonButton>
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
            gridTemplateColumns: '1fr 1.1fr',
            gap: '16px',
          }}
        >
          <MetabletonCard padding={20} hover={false}>
            <div style={{ fontWeight: 700, marginBottom: '14px', fontSize: '15px' }}>
              Activité hebdomadaire
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px',
                height: '130px',
              }}
            >
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    minHeight: '8px',
                    borderRadius: '4px 4px 0 0',
                    background: 'linear-gradient(to top, var(--mt-orange), oklch(55% 0.14 50))',
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
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
              {BAR_LABELS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </MetabletonCard>

          <MetabletonCard padding={0} hover={false}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr>
                  {['Élève', 'Devoir', 'Statut'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '12px 14px',
                        color: 'var(--mt-muted)',
                        fontWeight: 500,
                        borderBottom: '1px solid var(--mt-border)',
                        fontFamily: 'var(--mt-font-mono)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SUBMISSIONS.map((s) => (
                  <tr key={s.name}>
                    <td
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--mt-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <div
                        className="metableton-avatar"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--mt-orange), var(--mt-green))',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: '10px',
                          color: '#111',
                        }}
                      >
                        {s.initials}
                      </div>
                      <span style={{ fontSize: '13px' }}>{s.name}</span>
                    </td>
                    <td
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--mt-border)',
                        fontSize: '13px',
                      }}
                    >
                      {s.assignment}
                    </td>
                    <td
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--mt-border)',
                      }}
                    >
                      <MetabletonBadge variant={s.variant}>{s.status}</MetabletonBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </MetabletonCard>
        </div>
      }
    />
  );
}
