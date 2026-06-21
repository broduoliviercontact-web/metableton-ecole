const SCREW_CLASS =
  'absolute z-10 h-2 w-2 rounded-full border border-[#3c4a42] bg-[#1c1b1b]';

export default function OscillatorMemoryFrame({ children }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-[#3c4a42] bg-[#131313] p-4 shadow-2xl sm:p-6">
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-15"
        style={{
          background:
            'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.02), rgba(0,0,255,0.03))',
          backgroundSize: '100% 4px, 3px 100%',
        }}
      />

      {/* Module header */}
      <div className="relative z-10 mb-5 flex items-center justify-between border-b border-[#3c4a42] pb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-lg text-emerald-400"
            aria-hidden="true"
            style={{ textShadow: '0 0 8px rgba(52,211,153,0.6)' }}
          >
            ⊘
          </span>
          <h2 className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#e5e2e1]">
            Auditory Recall Protocol
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#86948a]">
          SEQ-404-BLIND
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* Decorative screws */}
      <div className={`${SCREW_CLASS} top-3 left-3`} aria-hidden="true" />
      <div className={`${SCREW_CLASS} top-3 right-3`} aria-hidden="true" />
      <div className={`${SCREW_CLASS} bottom-3 left-3`} aria-hidden="true" />
      <div className={`${SCREW_CLASS} bottom-3 right-3`} aria-hidden="true" />
    </div>
  );
}
