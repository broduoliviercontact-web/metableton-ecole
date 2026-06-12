/* DashboardHeader — title à gauche, rightSlot (badge ou bouton) à droite. */
import React from 'react';
import MetabletonBadge from '../../primitives/MetabletonBadge.jsx';
import MetabletonButton from '../../primitives/MetabletonButton.jsx';

function renderRightSlot(slot) {
  if (!slot) return null;
  if (slot.type === 'badge') {
    return <MetabletonBadge variant={slot.variant}>{slot.label}</MetabletonBadge>;
  }
  if (slot.type === 'button') {
    return (
      <MetabletonButton
        variant={slot.variant || 'primary'}
        size={slot.size || 'md'}
        as={slot.as || 'button'}
        href={slot.href}
        onClick={slot.onClick}
      >
        {slot.label}
      </MetabletonButton>
    );
  }
  // Slot libre (React node)
  return slot;
}

export default function DashboardHeader({ title, rightSlot }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--mt-font-display)',
          fontSize: '20px',
          letterSpacing: '-0.02em',
          color: 'var(--mt-fg)',
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {renderRightSlot(rightSlot)}
      </div>
    </div>
  );
}
