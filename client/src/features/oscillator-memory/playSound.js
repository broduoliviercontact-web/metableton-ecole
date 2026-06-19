/**
 * Pedagogical oscillator sound engine for the 404 Oscillator Memory mini-game.
 *
 * Design principles:
 * - All tonal oscillators share the same BASE_FREQ so the player compares *timbre*,
 *   not pitch. This is the core of ear-training for waveform recognition.
 * - Each waveform has a distinct spectral signature:
 *   - sine: pure tone, no harmonics
 *   - triangle: soft, odd harmonics only, mellow but distinct from sine
 *   - square: hollow/chiptune character, odd harmonics, clearly nasal
 *   - sawtooth: bright and buzzy, rich in all harmonics
 *   - fm: metallic/digital timbre via frequency modulation
 *   - noise: non-periodic, percussive texture
 * - Per-type gain balancing keeps the overall level comfortable and avoids
 *   harshness (saw/square/fm/noise can be louder psychoacoustically).
 */

const NOTE_DURATION = 0.90;
const ATTACK = 0.02;
const DECAY = 0.08;
const SUSTAIN = 0.65;
const RELEASE = 0.25;

const BASE_FREQ = 220;

const GAINS = {
  sine: 0.32,
  triangle: 0.40,
  square: 0.28,
  sawtooth: 0.26,
  fm: 0.24,
  noise: 0.18,
};

/**
 * Build a per-voice gain node with a smooth ADSR envelope and connect it
 * directly to the audio destination. Each oscillator type gets its own
 * balanced peak level.
 */
function makeVoiceGain(ctx, now, peakLevel) {
  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  const releaseStart = now + Math.max(0, NOTE_DURATION - RELEASE);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peakLevel, now + ATTACK);
  if (ATTACK + DECAY < NOTE_DURATION - RELEASE) {
    gain.gain.exponentialRampToValueAtTime(peakLevel * SUSTAIN, now + ATTACK + DECAY);
  }
  if (releaseStart > now + ATTACK + DECAY) {
    gain.gain.setValueAtTime(peakLevel * SUSTAIN, releaseStart);
  }
  gain.gain.exponentialRampToValueAtTime(0.001, now + NOTE_DURATION);

  return gain;
}

function playNoise(ctx) {
  const now = ctx.currentTime;
  const bufferSize = Math.ceil(ctx.sampleRate * NOTE_DURATION);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Shape the noise with a lowpass so it sits behind the tonal oscillators.
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1600;
  filter.Q.value = 0.7;

  const gain = makeVoiceGain(ctx, now, GAINS.noise);

  source.connect(filter);
  filter.connect(gain);

  source.start(now);
  source.stop(now + NOTE_DURATION);

  source.onended = () => {
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

function playFm(ctx) {
  const now = ctx.currentTime;

  // Carrier: pure sine at the shared pitch.
  const carrier = ctx.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.value = BASE_FREQ;

  // Modulator: integer ratio gives a clear, metallic FM bell/keyboard character.
  const modulator = ctx.createOscillator();
  modulator.type = 'sawtooth';
  modulator.frequency.value = BASE_FREQ * 5;

  // Modulation depth: strong enough to be unmistakably FM, but not painful.
  const modGain = ctx.createGain();
  modGain.gain.value = 240;

  const gain = makeVoiceGain(ctx, now, GAINS.fm);

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);
  carrier.connect(gain);

  carrier.start(now);
  modulator.start(now);
  carrier.stop(now + NOTE_DURATION);
  modulator.stop(now + NOTE_DURATION);

  const cleanup = () => {
    carrier.disconnect();
    modulator.disconnect();
    modGain.disconnect();
    gain.disconnect();
  };

  carrier.onended = cleanup;
  modulator.onended = cleanup;
}

function playOscillator(type, ctx) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = BASE_FREQ;

  const gain = makeVoiceGain(ctx, now, GAINS[type]);

  // Square and sawtooth are rich in high harmonics. A gentle lowpass keeps
  // them from becoming abrasive while preserving their identity.
  if (type === 'square' || type === 'sawtooth') {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'square' ? 3000 : 5000;
    filter.Q.value = 0.7;

    osc.connect(filter);
    filter.connect(gain);

    osc.start(now);
    osc.stop(now + NOTE_DURATION);

    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
    return;
  }

  osc.connect(gain);

  osc.start(now);
  osc.stop(now + NOTE_DURATION);

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

/**
 * Play one of the six oscillator sounds through the given AudioContext.
 * Supported types: 'sine' | 'triangle' | 'square' | 'sawtooth' | 'fm' | 'noise'.
 * Returns false if the AudioContext is missing or invalid.
 */
export function playSound(type, audioContext) {
  if (!audioContext) {
    // eslint-disable-next-line no-console
    console.warn('AudioContext is required to play sound.');
    return false;
  }

  try {
    switch (type) {
      case 'noise':
        playNoise(audioContext);
        break;
      case 'fm':
        playFm(audioContext);
        break;
      case 'sine':
      case 'triangle':
      case 'square':
      case 'sawtooth':
        playOscillator(type, audioContext);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown oscillator type: ${type}`);
        return false;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to play oscillator sound:', error);
    return false;
  }

  return true;
}

export { NOTE_DURATION };
