const variants = {
  beginner: 'bg-blue-500/20 text-blue-300',
  intermediate: 'bg-amber-500/20 text-amber-300',
  advanced: 'bg-red-500/20 text-red-300',
  all_levels: 'bg-emerald-500/20 text-emerald-300',
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-emerald-500/20 text-emerald-300',
  pending: 'bg-amber-500/20 text-amber-300',
  approved: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
  student: 'bg-blue-500/20 text-blue-300',
  teacher: 'bg-purple-500/20 text-purple-300',
  admin: 'bg-emerald-500/20 text-emerald-300',
};

export default function Badge({ children, variant = 'all_levels', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.all_levels} ${className}`}
    >
      {children}
    </span>
  );
}

export { variants };
