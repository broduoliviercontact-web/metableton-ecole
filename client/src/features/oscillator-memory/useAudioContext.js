import { useRef, useCallback } from 'react';

/**
 * Hook for lazy, user-gated AudioContext creation.
 * Browsers require a user gesture before resuming/suspending audio.
 */
export function useAudioContext() {
  const ctxRef = useRef(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API is not supported in this browser.');
      }
      ctxRef.current = new AudioContextClass();
    }
    return ctxRef.current;
  }, []);

  const ensureReady = useCallback(async () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }, [getContext]);

  return { getContext, ensureReady };
}
