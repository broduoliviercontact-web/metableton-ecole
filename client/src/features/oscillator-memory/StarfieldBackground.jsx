/**
 * Subtle CSS-only starfield / digital dust background.
 * Uses multiple small absolutely-positioned dots to avoid canvas state.
 */

function Star({ top, left, size, opacity, delay }) {
  return (
    <span
      className="pointer-events-none absolute rounded-full bg-emerald-400"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: size,
        height: size,
        opacity,
        '--base-opacity': opacity,
        animation: `starPulse 4s ease-in-out ${delay}s infinite`,
      }}
      aria-hidden="true"
    />
  );
}

const STARS = [
  { top: 10, left: 12, size: 2, opacity: 0.35, delay: 0 },
  { top: 22, left: 85, size: 1.5, opacity: 0.25, delay: 1.2 },
  { top: 35, left: 45, size: 2, opacity: 0.3, delay: 0.4 },
  { top: 48, left: 8, size: 1.5, opacity: 0.2, delay: 2.1 },
  { top: 55, left: 92, size: 2.5, opacity: 0.35, delay: 0.8 },
  { top: 68, left: 28, size: 1.5, opacity: 0.25, delay: 1.6 },
  { top: 75, left: 70, size: 2, opacity: 0.3, delay: 0.2 },
  { top: 88, left: 18, size: 1.5, opacity: 0.2, delay: 2.5 },
  { top: 14, left: 60, size: 1.5, opacity: 0.25, delay: 1.0 },
  { top: 60, left: 55, size: 1.5, opacity: 0.2, delay: 1.9 },
  { top: 82, left: 82, size: 2, opacity: 0.3, delay: 0.6 },
  { top: 40, left: 78, size: 1.5, opacity: 0.2, delay: 2.8 },
  { top: 5, left: 35, size: 1.5, opacity: 0.25, delay: 1.4 },
  { top: 95, left: 50, size: 2, opacity: 0.25, delay: 0.9 },
  { top: 28, left: 22, size: 1.5, opacity: 0.2, delay: 2.3 },
];

export default function StarfieldBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Keyframe injected locally so no global CSS file is touched */}
      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: var(--base-opacity, 0.25); transform: scale(1); }
          50% { opacity: calc(var(--base-opacity, 0.25) * 1.8); transform: scale(1.2); }
        }
      `}</style>
      {STARS.map((star, index) => (
        <Star key={index} {...star} />
      ))}
      {/* Fine grain texture via repeating radial dots */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(#86948a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
