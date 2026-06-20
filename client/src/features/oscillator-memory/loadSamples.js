import { SAMPLE_MAP, SAMPLE_IDS } from './sampleMap.js';

/**
 * Load and decode all oscillator samples for the AudioContext.
 *
 * @param {AudioContext} audioContext
 * @returns {Promise<{ buffers: Record<string, AudioBuffer>, errors: Record<string, Error> }>}
 */
export async function loadSamples(audioContext) {
  const buffers = {};
  const errors = {};

  await Promise.all(
    SAMPLE_IDS.map(async (soundId) => {
      try {
        const response = await fetch(SAMPLE_MAP[soundId]);

        if (!response.ok) {
          throw new Error(
            `Failed to load sample ${soundId}: ${response.status} ${response.statusText}`
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        buffers[soundId] = audioBuffer;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Sample loading error for ${soundId}:`, error);
        errors[soundId] = error;
      }
    })
  );

  return { buffers, errors };
}
