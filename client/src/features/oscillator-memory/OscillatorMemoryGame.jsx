import { useState, useCallback, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button.jsx';
import { useAudioContext } from './useAudioContext.js';
import { playSound, NOTE_DURATION } from './playSound.js';
import OscillatorPad, { OSCILLATOR_TYPES } from './OscillatorPad.jsx';
import GameStatus from './GameStatus.jsx';
import { getHighScore, saveHighScore, resetHighScore } from './highScoreStorage.js';

const GAP_BETWEEN_NOTES = 0.25;
const ROUND_DELAY_MS = 800;

function getRandomType() {
  const index = Math.floor(Math.random() * OSCILLATOR_TYPES.length);
  return OSCILLATOR_TYPES[index].id;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function OscillatorMemoryGame() {
  const [status, setStatus] = useState('idle');
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const isMountedRef = useRef(true);
  const isPlayingRef = useRef(false);
  const messageTimeoutRef = useRef(null);
  const { ensureReady } = useAudioContext();

  const clearRoundTimeout = useCallback(() => {
    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    clearRoundTimeout();
    isPlayingRef.current = false;
    setStatus('idle');
    setSequence([]);
    setUserStep(0);
    setScore(0);
    setIsNewRecord(false);
    setIsInitializing(false);
  }, [clearRoundTimeout]);

  const safeSetStatus = useCallback((nextStatus) => {
    if (isMountedRef.current) {
      setStatus(nextStatus);
    }
  }, []);

  const playSequence = useCallback(
    async (seqToPlay) => {
      isPlayingRef.current = true;
      safeSetStatus('playingSequence');
      setUserStep(0);

      let ctx;
      try {
        ctx = await ensureReady();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('AudioContext initialization failed:', error);
        if (isMountedRef.current) {
          setAudioError(true);
          setIsInitializing(false);
          isPlayingRef.current = false;
        }
        return;
      }

      for (let i = 0; i < seqToPlay.length; i++) {
        if (!isMountedRef.current) return;
        playSound(seqToPlay[i], ctx);
        // eslint-disable-next-line no-await-in-loop
        await sleep((NOTE_DURATION + GAP_BETWEEN_NOTES) * 1000);
      }

      if (isMountedRef.current) {
        isPlayingRef.current = false;
        setStatus('waitingInput');
      }
    },
    [ensureReady, safeSetStatus]
  );

  const startGame = useCallback(async () => {
    if (isPlayingRef.current || isInitializing) return;
    setIsInitializing(true);
    clearRoundTimeout();

    let ctx;
    try {
      ctx = await ensureReady();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('AudioContext initialization failed:', error);
      if (isMountedRef.current) {
        setAudioError(true);
        setIsInitializing(false);
      }
      return;
    }

    if (!isMountedRef.current) return;

    const firstType = getRandomType();
    const firstSequence = [firstType];
    setSequence(firstSequence);
    setScore(0);
    setIsNewRecord(false);
    setAudioError(false);
    setIsInitializing(false);
    await playSequence(firstSequence);
  }, [clearRoundTimeout, ensureReady, isInitializing, playSequence]);

  const handlePadClick = useCallback(
    async (type) => {
      if (status !== 'waitingInput') return;

      let ctx;
      try {
        ctx = await ensureReady();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('AudioContext initialization failed:', error);
        if (isMountedRef.current) {
          setAudioError(true);
        }
        return;
      }

      if (!isMountedRef.current) return;
      playSound(type, ctx);

      if (type !== sequence[userStep]) {
        const finalScore = sequence.length - 1;
        const previousHigh = getHighScore();
        const nextHigh = saveHighScore(finalScore);

        if (isMountedRef.current) {
          setScore(finalScore);
          setHighScore(nextHigh);
          setIsNewRecord(nextHigh > previousHigh && nextHigh > 0);
          safeSetStatus('failed');
        }
        return;
      }

      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep >= sequence.length) {
        safeSetStatus('success');
        const newScore = sequence.length;
        const nextSequence = [...sequence, getRandomType()];
        setScore(newScore);
        setSequence(nextSequence);

        messageTimeoutRef.current = window.setTimeout(() => {
          if (isMountedRef.current) {
            playSequence(nextSequence);
          }
        }, ROUND_DELAY_MS);
      }
    },
    [ensureReady, playSequence, safeSetStatus, sequence, status, userStep]
  );

  const handleReplaySequence = useCallback(async () => {
    if (status !== 'waitingInput' || sequence.length === 0) return;
    clearRoundTimeout();
    await playSequence(sequence);
  }, [clearRoundTimeout, playSequence, sequence, status]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (status !== 'waitingInput') return;

      const key = event.key;
      const pad = OSCILLATOR_TYPES.find((t) => t.shortcut === key);
      if (!pad) return;

      event.preventDefault();
      handlePadClick(pad.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePadClick, status]);

  useEffect(() => {
    isMountedRef.current = true;
    setHighScore(getHighScore());
    return () => {
      isMountedRef.current = false;
      clearRoundTimeout();
    };
  }, [clearRoundTimeout]);

  const handleResetHighScore = useCallback(() => {
    resetHighScore();
    setHighScore(0);
    setIsNewRecord(false);
  }, []);

  const sequenceLength = sequence.length || 1;
  const isIdle = status === 'idle';
  const isFailed = status === 'failed';
  const isWaiting = status === 'waitingInput';
  const padsDisabled = status === 'playingSequence' || isIdle || isFailed || audioError;

  if (audioError) {
    return (
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="mb-1 text-center text-lg font-semibold tracking-wide text-white">
            Oscillator Memory
          </h2>
          <p className="text-center text-xs text-gray-500">
            Ear training synth — écoute et reproduis la séquence
          </p>
        </div>
        <div className="text-center" role="alert">
          <p className="mb-4 text-sm text-red-300">
            L’audio n’est pas disponible sur ce navigateur. La page 404 reste accessible.
          </p>
          <Button variant="outline" onClick={resetGame}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="mb-1 text-center text-lg font-semibold tracking-wide text-white">
          Oscillator Memory
        </h2>
        <p className="text-center text-xs text-gray-500">
          Ear training synth — écoute et reproduis la séquence
        </p>
      </div>

      <div className="mb-6">
        <GameStatus
          status={status}
          score={score}
          sequenceLength={sequenceLength}
          highScore={highScore}
          isNewRecord={isNewRecord}
        />
      </div>

      {isIdle && (
        <div className="flex justify-center">
          <Button onClick={startGame} size="lg" disabled={isInitializing}>
            {isInitializing ? 'Initialisation…' : 'Écouter & jouer'}
          </Button>
        </div>
      )}

      {!isIdle && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {OSCILLATOR_TYPES.map((osc) => (
            <OscillatorPad
              key={osc.id}
              type={osc.id}
              label={osc.label}
              shortcut={osc.shortcut}
              disabled={padsDisabled}
              onClick={handlePadClick}
            />
          ))}
        </div>
      )}

      {(isWaiting || isFailed) && (
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {isWaiting && (
            <Button variant="outline" onClick={handleReplaySequence}>
              Réécouter la séquence
            </Button>
          )}
          {isFailed && (
            <Button onClick={handleRestart}>Recommencer</Button>
          )}
        </div>
      )}

      {isFailed && (
        <p className="mt-4 text-center text-sm text-gray-400">
          Pas de souci — réécoute attentivement et réessaie.
        </p>
      )}

      {isIdle && highScore > 0 && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetHighScore}
            aria-label="Réinitialiser le record local du mini-jeu"
          >
            Réinitialiser le record
          </Button>
        </div>
      )}
    </div>
  );
}
