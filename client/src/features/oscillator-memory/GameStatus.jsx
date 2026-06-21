import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const MESSAGES = {
  idle: 'READY',
  playingSequence: 'LISTEN',
  waitingInput: 'YOUR TURN',
  success: 'SEQUENCE OK',
  failed: 'ERROR',
};

const LED_COLORS = {
  idle: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
  playingSequence: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
  waitingInput: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
  success: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
  failed: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]',
};

const TEXT_COLORS = {
  idle: 'text-emerald-400',
  playingSequence: 'text-amber-400',
  waitingInput: 'text-emerald-400',
  success: 'text-emerald-400',
  failed: 'text-red-400',
};

function formatScore(value) {
  return Math.max(0, Math.min(9999, value)).toString().padStart(4, '0');
}

export default function GameStatus({
  status,
  score,
  sequenceLength,
  highScore,
  isNewRecord,
}) {
  const isFailed = status === 'failed';
  const ledClass = LED_COLORS[status] || LED_COLORS.idle;
  const textClass = TEXT_COLORS[status] || TEXT_COLORS.idle;

  return (
    <div
      className="flex flex-col items-center gap-4 text-center"
      aria-live="polite"
      role={isFailed ? 'alert' : undefined}
    >
      {/* LCD status strip */}
      <div className="relative w-full overflow-hidden rounded border border-[#3c4a42] bg-[#0e0e0e] px-4 py-3">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.02), rgba(0,0,255,0.03))',
            backgroundSize: '100% 4px, 3px 100%',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${ledClass}`}
              aria-hidden="true"
            />
            <span
              className={`font-mono text-sm font-medium uppercase tracking-wider ${textClass}`}
              style={{ textShadow: '0 0 6px currentColor' }}
            >
              {status === 'playingSequence' && (
                <span className="mr-2 inline-block">
                  <LoadingSpinner size="sm" />
                </span>
              )}
              {MESSAGES[status] || MESSAGES.idle}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#86948a]">
            <span className="uppercase tracking-wider">Score:</span>
            <span
              className="font-mono text-sm text-emerald-400"
              style={{ textShadow: '0 0 6px rgba(52,211,153,0.5)' }}
            >
              {formatScore(score)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant={isFailed ? 'rejected' : 'approved'}>
          Tour {sequenceLength}
        </Badge>
        <Badge variant="all_levels">
          Record : {highScore}
        </Badge>
      </div>

      {isNewRecord && isFailed && (
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400"
          style={{ textShadow: '0 0 8px rgba(52,211,153,0.5)' }}
        >
          Nouveau record !
        </p>
      )}
    </div>
  );
}
