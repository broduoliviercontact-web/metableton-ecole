/* HomeModuleGrid — grille 4 colonnes (responsive 2 / 1) des 4 modules */
import React from 'react';
import HomeModuleCard from './HomeModuleCard.jsx';

const MODULES = [
  { strip: 'cyan',  icon: 'ableton', title: 'Ableton Live',
    description: 'Session & Arrangement, clips MIDI, racks d’effets.' },
  { strip: 'green', icon: 'mao',     title: 'MAO & Setup',
    description: 'Interface DAW, routing, export, organisation.' },
  { strip: 'blue',  icon: 'synth',   title: 'Synthèse sonore',
    description: 'Wavetable, Operator, FM, modulations.' },
  { strip: 'white', icon: 'mix',     title: 'Mix & Master',
    description: 'Compression, EQ, saturation, export final.' },
];

export default function HomeModuleGrid() {
  return (
    <div
      className="metableton-home-modules"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}
    >
      {MODULES.map((m) => (
        <HomeModuleCard key={m.title} {...m} />
      ))}

      {/* Responsive : 2 colonnes <900px, 1 colonne <480px — via media query inline */}
      <style>{`
        @media (max-width: 900px) {
          .metableton-home-modules { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .metableton-home-modules { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
