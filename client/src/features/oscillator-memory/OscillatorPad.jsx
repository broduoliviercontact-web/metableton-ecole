import { useState, useCallback, useRef, useEffect } from 'react';

const OSCILLATOR_TYPES = [
  { id: 'sine', label: 'Sine', shortcut: '1' },
  { id: 'triangle', label: 'Triangle', shortcut: '2' },
  { id: 'square', label: 'Square', shortcut: '3' },
  { id: 'sawtooth', label: 'Saw', shortcut: '4' },
  { id: 'fm', label: 'FM', shortcut: '5' },
  { id: 'noise', label: 'Noise', shortcut: '6' },
];

export { OSCILLATOR_TYPES };

const COLORS = {
  sine: 'focus-visible:ring-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 active:bg-emerald-500/20',
  triangle: 'focus-visible:ring-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10 active:bg-amber-500/20',
  square: 'focus-visible:ring-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 active:bg-blue-500/20',
  sawtooth: 'focus-visible:ring-purple-400 hover:border-purple-500/40 hover:bg-purple-500/10 active:bg-purple-500/20',
  fm: 'focus-visible:ring-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10 active:bg-pink-500/20',
  noise: 'focus-visible:ring-gray-400 hover:border-gray-500/40 hover:bg-gray-500/10 active:bg-gray-500/20',
};

const PRESSED_COLORS = {
  sine: 'border-emerald-500/60 bg-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.25)]',
  triangle: 'border-amber-500/60 bg-amber-500/20 shadow-[0_0_16px_rgba(245,158,11,0.25)]',
  square: 'border-blue-500/60 bg-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.25)]',
  sawtooth: 'border-purple-500/60 bg-purple-500/20 shadow-[0_0_16px_rgba(168,85,247,0.25)]',
  fm: 'border-pink-500/60 bg-pink-500/20 shadow-[0_0_16px_rgba(236,72,153,0.25)]',
  noise: 'border-gray-500/60 bg-gray-500/20 shadow-[0_0_16px_rgba(156,163,175,0.25)]',
};

export default function OscillatorPad({
  type,
  label,
  shortcut,
  disabled = false,
  onClick,
  className = '',
}) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef(null);

  const clearPressTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const activate = useCallback(() => {
    if (disabled) return;
    clearPressTimeout();
    setPressed(true);
    onClick(type);
    timeoutRef.current = window.setTimeout(() => {
      setPressed(false);
    }, 120);
  }, [disabled, clearPressTimeout, onClick, type]);

  useEffect(() => {
    return () => {
      clearPressTimeout();
    };
  }, [clearPressTimeout]);

  return (
    <button
      type="button"
      aria-label={`${label} oscillator, touche ${shortcut}`}
      aria-keyshortcuts={shortcut}
      disabled={disabled}
      onClick={activate}
      className={`
        relative flex flex-col items-center justify-center gap-1
        rounded-lg border bg-black/20
        px-4 py-5
        font-mono text-sm font-medium tracking-wide text-white
        transition-all duration-75
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-black/20
        ${COLORS[type]}
        ${pressed ? PRESSED_COLORS[type] : 'border-white/10'}
        ${className}
      `}
    >
      <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-xs text-white/50">{shortcut}</span>
    </button>
  );
}
