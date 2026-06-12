/* CourseProgressList — liste verticale de cours avec ProgressRing.
   Si courses est vide, affiche un état vide propre. */
import React from 'react';
import ProgressRing from './ProgressRing.jsx';

export default function CourseProgressList({ courses = [], color = 'orange' }) {
  if (!courses || courses.length === 0) {
    return (
      <div
        style={{
          color: 'var(--mt-muted)',
          fontSize: '13px',
          fontFamily: 'var(--mt-font-mono)',
          padding: '8px 0',
        }}
      >
        Aucun cours en cours.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {courses.map((c, i) => (
        <div
          key={c.title || i}
          style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <ProgressRing percent={c.percent} label={c.label} color={color} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.title}</div>
            {c.subtitle && (
              <div style={{ fontSize: '12px', color: 'var(--mt-muted)' }}>
                {c.subtitle}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
