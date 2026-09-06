import React from 'react';
import { FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

export const ClaimBanner: React.FC = () => {
  return (
    <motion.section
      aria-label="The central claim"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative border border-slate-800 border-l-4 border-l-amber-500 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-7 sm:p-10 lg:p-12 shadow-2xl space-y-5 sm:space-y-6 overflow-hidden"
    >
      {/* Soft amber bloom in the corner so the card reads as a stage, not a box */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

      {/* Eyebrow label */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-[0.18em] uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
          THE CLAIM
        </span>
        <span aria-hidden className="hidden sm:block h-px flex-1 max-w-xs bg-gradient-to-r from-amber-500/40 to-transparent" />
      </div>

      {/* Main claim — the single most important sentence on the page */}
      <p className="text-lg sm:text-2xl lg:text-[1.7rem] font-semibold leading-snug sm:leading-snug text-slate-50 max-w-5xl">
        A standard Transformer's memory grows by one key-value pair per token forever — it never
        forgets, but never stops growing.{' '}
        <span className="text-amber-300">
          BDH's fixed-size Hebbian memory stays constant in size no matter how long the sequence
          gets
        </span>
        , but pays for that with interference: older associations decay and can be overwritten, so
        retrieval accuracy for old tokens degrades as the sequence grows.
      </p>

      {/* Sub-line — how to test it yourself */}
      <p className="text-sm sm:text-base text-slate-400 leading-relaxed flex items-start gap-2.5 max-w-4xl">
        <FlaskConical className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <span className="font-semibold text-slate-300">Test it yourself:</span> increase sequence
          length or lower the decay rate in Sandbox mode, then query an old token in both models and
          compare retrieval accuracy.
        </span>
      </p>
    </motion.section>
  );
};
