import { useEffect, useState } from 'react';
import { fetchOscillatorMemoryScores } from '../../api/oscillatorMemoryScores.js';
import Badge from '../../components/ui/Badge.jsx';

export default function LeaderboardPanel({ refreshToken }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOscillatorMemoryScores();
        if (!cancelled) setScores(data || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Classement indisponible pour le moment.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return (
    <div className="mt-5 rounded border border-[#3c4a42] bg-[#0e0e0e] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e5e2e1]">
          Top écoutes
        </h3>
        <Badge variant="all_levels">Classement expérimental</Badge>
      </div>

      {loading && (
        <p className="font-mono text-sm text-[#86948a]">Chargement…</p>
      )}

      {error && (
        <p className="font-mono text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && scores.length === 0 && (
        <p className="font-mono text-sm text-[#86948a]">
          Aucun score publié pour l’instant.
        </p>
      )}

      {!loading && !error && scores.length > 0 && (
        <ul className="space-y-2" role="list">
          {scores.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono text-xs text-[#86948a]">
                  {index + 1}
                </span>
                <span className="text-sm text-[#e5e2e1]">{entry.pseudo}</span>
              </div>
              <span className="font-mono text-sm text-emerald-400">
                {entry.score}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
