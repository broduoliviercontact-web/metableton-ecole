import OscillatorMemoryGame from '../features/oscillator-memory/OscillatorMemoryGame.jsx';
import SignalLostHeader from '../features/oscillator-memory/SignalLostHeader.jsx';
import StarfieldBackground from '../features/oscillator-memory/StarfieldBackground.jsx';

export default function NotFoundPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 text-center"
      style={{ backgroundColor: '#131313' }}
    >
      <StarfieldBackground />

      {/* Subtle radial grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(#86948a 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
        aria-hidden="true"
      />

      <main className="relative z-10 w-full max-w-3xl">
        <SignalLostHeader />

        <div className="mt-10 sm:mt-12">
          <OscillatorMemoryGame />
        </div>
      </main>
    </div>
  );
}
