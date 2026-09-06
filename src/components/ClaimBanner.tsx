import React from 'react';
import { FlaskConical } from 'lucide-react';

export const ClaimBanner: React.FC = () => {
  return (
    <section
      aria-label="The central claim"
      className="relative border border-slate-800 border-l-4 border-l-amber-500 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-5 sm:p-7 lg:p-8 shadow-2xl space-y-3.5 sm:space-y-4"
    >
      {/* Eyebrow label */}
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.15em] uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
        THE CLAIM
      </span>

      {/* Main claim — the single most important sentence on the page */}
      <p className="text-base sm:text-lg lg:text-xl font-semibold leading-relaxed text-slate-50">
        A standard Transformer's memory grows by one key-value pair per token forever — it never
        forgets, but never stops growing. BDH's fixed-size Hebbian memory stays constant in size no
        matter how long the sequence gets, but pays for that with interference: older associations
        decay and can be overwritten, so retrieval accuracy for old tokens degrades as the sequence
        grows.
      </p>

      {/* Sub-line — how to test it yourself */}
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed flex items-start gap-2">
        <FlaskConical className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Test it yourself: increase sequence length or lower the decay rate in Sandbox mode, then
          query an old token in both models and compare retrieval accuracy.
        </span>
      </p>
    </section>
  );
};