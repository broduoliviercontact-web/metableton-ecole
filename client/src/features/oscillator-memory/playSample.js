import { SAMPLE_MAP } from './sampleMap.js';

const MASTER_GAIN = 0.85;

/**
 * Play a decoded sample through the given AudioContext.
 *
 * @param {string} soundId
 * @param {AudioContext} audioContext
 * @param {Record<string, AudioBuffer>} sampleBuffers
 * @returns {boolean}
 */
export function playSample(soundId, audioContext, sampleBuffers) {
  if (!audioContext) {
    // eslint-disable-next-line no-console
    console.warn('AudioContext is required to play sample.');
    return false;
  }

  const buffer = sampleBuffers?.[soundId];

  if (!buffer) {
    // eslint-disable-next-line no-console
    console.warn(`Sample not loaded: ${soundId}`);
    return false;
  }

  try {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const gain = audioContext.createGain();
    gain.gain.value = MASTER_GAIN;

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start(0);

    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to play sample ${soundId}:`, error);
    return false;
  }
}

/**
 * Approximate duration of a sample for sequence timing.
 * Falls back to a safe default if the buffer is unknown.
 */
export function getSampleDuration(soundId, sampleBuffers) {
  const buffer = sampleBuffers?.[soundId];
  return buffer ? buffer.duration : 1.5;
}

export { SAMPLE_MAP, MASTER_GAIN };
