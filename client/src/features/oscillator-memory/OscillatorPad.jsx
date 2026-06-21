import { useState, useCallback, useRef, useEffect } from 'react';

const OSCILLATOR_TYPES = [
  { id: 'sine', label: 'SINE', shortcut: '1', icon: '∿' },
  { id: 'triangle', label: 'TRI', shortcut: '2', icon: '△' },
  { id: 'square', label: 'SQR', shortcut: '3', icon: '□' },
  { id: 'sawtooth', label: 'SAW', shortcut: '4', icon: '⩘' },
  { id: 'fm', label: 'FM', shortcut: '5', icon: '∞' },
  { id: 'noise', label: 'NOISE', shortcut: '6', icon: '✻' },
];

export { OSCILLATOR_TYPES };

const COLOR = {
  sine: 'emerald',
  triangle: 'amber',
  square: 'blue',
  sawtooth: 'purple',
  fm: 'pink',
  noise: 'gray',
};

const COLOR_MAP = {
  emerald: {
    glow: 'shadow-[0_0_20px_4px_rgba(52,211,153,0.5)]',
    border: 'border-emerald-500/80',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
  },
  amber: {
    glow: 'shadow-[0_0_20px_4px_rgba(251,191,36,0.5)]',
    border: 'border-amber-500/80',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
  },
  blue: {
    glow: 'shadow-[0_0_20px_4px_rgba(96,165,250,0.5)]',
    border: 'border-blue-500/80',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
  },
  purple: {
    glow: 'shadow-[0_0_20px_4px_rgba(192,132,252,0.5)]',
    border: 'border-purple-500/80',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
  },
  pink: {
    glow: 'shadow-[0_0_20px_4px_rgba(244,114,182,0.5)]',
    border: 'border-pink-500/80',
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
  },
  gray: {
    glow: 'shadow-[0_0_20px_4px_rgba(156,163,175,0.5)]',
    border: 'border-gray-500/80',
    bg: 'bg-gray-500/15',
    text: 'text-gray-400',
  },
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
    }, 150);
  }, [disabled, clearPressTimeout, onClick, type]);

  useEffect(() => {
    return () => {
      clearPressTimeout();
    };
  }, [clearPressTimeout]);

  const osc = OSCILLATOR_TYPES.find((o) => o.id === type) || OSCILLATOR_TYPES[0];
  const colorKey = COLOR[type] || 'emerald';
  const palette = COLOR_MAP[colorKey];

  return (
    <button
      type="button"
      aria-label={`${label} oscillator, touche ${shortcut}`}
      aria-keyshortcuts={shortcut}
      disabled={disabled}
      onClick={activate}
      className={`
        relative flex aspect-square flex-col items-center justify-center gap-1
        rounded-sm border bg-[#201f1f] p-2
        font-mono text-xs font-medium uppercase tracking-wider text-[#bbcabf]
        transition-all duration-75
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131313]
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#3c4a42] disabled:hover:bg-[#201f1f]
        ${pressed ? `scale-[0.96] ${palette.border} ${palette.bg} ${palette.glow}` : 'border-[#3c4a42] hover:border-[#86948a]/50 hover:bg-[#2a2a2a]'}
        ${className}
      `}
      style={{
        boxShadow: pressed
          ? undefined
          : 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.04)',
      }}
    >
      <span className="absolute left-2 top-2 font-mono text-[10px] text-[#86948a]">
        {shortcut}
      </span>

      <span
        className={`text-2xl transition-colors duration-75 ${pressed ? palette.text : 'text-[#86948a]'}`}
        aria-hidden="true"
      >
        {osc.icon}
      </span>

      <span className="text-[10px] tracking-wider">{osc.label}</span>
    </button>
  );
}
