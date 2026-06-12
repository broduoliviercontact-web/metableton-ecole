/* SessionGrid — grille de SessionSlot. Si vide, ne rend rien. */
import React from 'react';
import SessionSlot from './SessionSlot.jsx';

export default function SessionGrid({ sessions = [], columns = 4 }) {
  if (!sessions || sessions.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '8px',
      }}
    >
      {sessions.map((s, i) => (
        <SessionSlot
          key={`${s.title || 'slot'}-${i}`}
          title={s.title}
          time={s.time}
          variant={s.variant}
        />
      ))}
    </div>
  );
}
