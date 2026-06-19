import { apiClient } from './client.js';

/**
 * Fetch the top anonymous scores for the Oscillator Memory mini-game.
 * @returns {Promise<Array<{ id, pseudo, score, createdAt }>>}
 */
export async function fetchOscillatorMemoryScores() {
  const res = await apiClient('/api/oscillator-memory/scores');
  return res.data;
}

/**
 * Submit a new anonymous score.
 * @param {{ pseudo: string, score: number }} params
 * @returns {Promise<{ id, pseudo, score, createdAt }>}
 */
export async function submitOscillatorMemoryScore({ pseudo, score }) {
  const res = await apiClient('/api/oscillator-memory/scores', {
    method: 'POST',
    body: JSON.stringify({ pseudo, score }),
  });
  return res.data;
}
