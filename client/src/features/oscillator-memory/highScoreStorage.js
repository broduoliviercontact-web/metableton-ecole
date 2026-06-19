const STORAGE_KEY = 'metableton-oscillator-memory-hiscore';

function isValidScore(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Read the stored high score for Oscillator Memory.
 * Returns 0 if localStorage is unavailable or the stored value is invalid.
 */
export function getHighScore() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 0;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return 0;
    }

    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      return 0;
    }

    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read oscillator memory high score:', error);
    return 0;
  }
}

/**
 * Save a new high score if it is higher than the current stored value.
 * Returns the stored high score (existing or updated).
 */
export function saveHighScore(score) {
  if (!isValidScore(score)) {
    return getHighScore();
  }

  const current = getHighScore();
  const next = Math.max(current, Math.floor(score));

  if (typeof window !== 'undefined' && window.localStorage && next !== current) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to save oscillator memory high score:', error);
    }
  }

  return next;
}

/**
 * Clear the stored high score.
 */
export function resetHighScore() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to reset oscillator memory high score:', error);
  }
}
