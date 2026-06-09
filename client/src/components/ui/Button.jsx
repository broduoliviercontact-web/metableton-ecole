export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600',
    secondary: 'bg-white/10 text-white hover:bg-white/15 active:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/5 active:bg-white/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 active:bg-red-500/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
