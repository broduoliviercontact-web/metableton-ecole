/* AssignmentTable — table générique avec colonnes configurables. */
import React from 'react';
import MetabletonCard from '../../primitives/MetabletonCard.jsx';
import DashboardAvatar from './DashboardAvatar.jsx';
import StatusBadge from './StatusBadge.jsx';

const DEFAULT_COLUMNS = [
  { key: 'name',       label: 'Élève' },
  { key: 'assignment', label: 'Devoir' },
  { key: 'status',     label: 'Statut' },
];

export default function AssignmentTable({
  assignments = [],
  columns = DEFAULT_COLUMNS,
}) {
  if (!assignments || assignments.length === 0) {
    return (
      <MetabletonCard padding={20} hover={false}>
        <div
          style={{
            color: 'var(--mt-muted)',
            fontSize: '13px',
            fontFamily: 'var(--mt-font-mono)',
          }}
        >
          Aucun devoir à afficher.
        </div>
      </MetabletonCard>
    );
  }

  return (
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
            {columns.map((c) => (
              <th
                key={c.key}
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
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((a, i) => (
            <tr key={a.name || i}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--mt-border)',
                    fontSize: '13px',
                  }}
                >
                  {c.key === 'name' ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <DashboardAvatar initials={a.initials} size="small" />
                      <span style={{ fontSize: '13px' }}>{a.name}</span>
                    </div>
                  ) : c.key === 'status' ? (
                    <StatusBadge status={a.status} />
                  ) : (
                    a[c.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </MetabletonCard>
  );
}
