/**
 * Mapping of oscillator sound identifiers to their corresponding sample files.
 *
 * The game internally uses "sawtooth" while the UI displays "Saw".
 * Both "saw" and "sawtooth" resolve to the same sample file for compatibility.
 */
const SAMPLE_BASE_URL = '/audio/oscillator-memory';

export const SAMPLE_MAP = {
  sine: `${SAMPLE_BASE_URL}/sine.wav`,
  triangle: `${SAMPLE_BASE_URL}/triangle.wav`,
  square: `${SAMPLE_BASE_URL}/square.wav`,
  saw: `${SAMPLE_BASE_URL}/saw.wav`,
  sawtooth: `${SAMPLE_BASE_URL}/saw.wav`,
  fm: `${SAMPLE_BASE_URL}/fm.wav`,
  noise: `${SAMPLE_BASE_URL}/noise.wav`,
};

export const SAMPLE_IDS = Object.keys(SAMPLE_MAP);
