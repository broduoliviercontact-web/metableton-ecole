import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const MESSAGES = {
  idle: 'Prêt à tester tes oreilles ?',
  playingSequence: 'Écoute la séquence…',
  waitingInput: 'Rejoue la séquence',
  success: 'Séquence correcte — passe au tour suivant',
  failed: 'Séquence incorrecte',
};

const STATUS_COLORS = {
  idle: 'text-gray-400',
  playingSequence: 'text-amber-300',
  waitingInput: 'text-white',
  success: 'text-emerald-400',
  failed: 'text-red-400',
};

export default function GameStatus({ status, score, sequenceLength }) {
  const isFailed = status === 'failed';

  return (
    <div
      className="flex flex-col items-center gap-3 text-center"
      aria-live="polite"
      role={isFailed ? 'alert' : undefined}
    >
      <div className={`flex items-center gap-3 ${STATUS_COLORS[status] || 'text-gray-400'}`}>
        {status === 'playingSequence' && <LoadingSpinner size="sm" />}
        <p className="text-sm font-medium tracking-wide">
          {MESSAGES[status] || MESSAGES.idle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isFailed ? 'rejected' : 'approved'}>
          Score : {score}
        </Badge>
        <Badge variant={isFailed ? 'rejected' : 'pending'}>
          Tour {sequenceLength}
        </Badge>
      </div>
    </div>
  );
}
