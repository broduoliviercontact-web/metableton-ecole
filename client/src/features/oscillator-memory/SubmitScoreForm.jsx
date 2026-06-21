import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { submitOscillatorMemoryScore } from '../../api/oscillatorMemoryScores.js';

const MAX_PSEUDO_LENGTH = 20;

export default function SubmitScoreForm({ score, onSubmitted }) {
  const [pseudo, setPseudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      await submitOscillatorMemoryScore({ pseudo: pseudo.trim(), score });
      setResult('Score publié avec succès.');
      setPseudo('');
      onSubmitted?.();
    } catch (err) {
      setError(err.message || 'Impossible de publier le score.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded border border-[#3c4a42] bg-[#0e0e0e] p-3 sm:p-4"
      aria-label="Publier mon score"
    >
      <p className="mb-3 font-mono text-sm text-[#bbcabf]">
        Ajouter mon score au tableau
      </p>

      <div className="mb-3">
        <label htmlFor="oscillator-pseudo" className="sr-only">
          Pseudo
        </label>
        <input
          id="oscillator-pseudo"
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          maxLength={MAX_PSEUDO_LENGTH}
          placeholder="Pseudo"
          disabled={isSubmitting}
          className="w-full rounded border border-[#3c4a42] bg-[#131313] px-3 py-2 font-mono text-sm text-[#e5e2e1] placeholder-[#86948a] focus:border-emerald-400 focus:outline-none"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting || pseudo.trim().length < 2}
        >
          {isSubmitting ? 'Publication…' : 'Publier le score'}
        </Button>
        <span className="font-mono text-xs text-[#86948a]">
          Sans compte, sans donnée personnelle.
        </span>
      </div>

      {result && (
        <p className="mt-3 font-mono text-sm text-emerald-400" aria-live="polite">
          {result}
        </p>
      )}

      {error && (
        <p className="mt-3 font-mono text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
