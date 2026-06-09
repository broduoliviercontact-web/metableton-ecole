import Button from './Button.jsx';

export default function ErrorMessage({
  title = 'Une erreur est survenue',
  message = '',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
      <div className="mb-3 text-4xl">⚠️</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      {message && <p className="mb-6 max-w-md text-sm text-gray-400">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
