export default function EmptyState({
  icon,
  title = 'Rien ici pour le moment',
  description = '',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-5xl">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-sm text-gray-400">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
