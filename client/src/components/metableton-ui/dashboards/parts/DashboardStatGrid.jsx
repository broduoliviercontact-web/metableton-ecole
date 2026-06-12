/* DashboardStatGrid — grille responsive de DashboardStatCard.
   Si stats est vide ou absent, ne rend rien. */
import React from 'react';
import DashboardStatCard from './DashboardStatCard.jsx';

export default function DashboardStatGrid({ stats = [], columns = 3 }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '14px',
      }}
    >
      {stats.map((s) => (
        <DashboardStatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
