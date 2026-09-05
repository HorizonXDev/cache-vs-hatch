import React from 'react';
import { BookOpenCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { AnimatedMemoryFlow } from './AnimatedMemoryFlow';

interface LandingStoryProps {
  onOpenLab: () => void;
}

export const LandingStory: React.FC<LandingStoryProps> = ({ onOpenLab }) => {
  return (
    <div className="space-y-10">
      {/* ---------- 1. Hero: the idea in plain words ---------- */}
      <section className="bg-gradient-to-b from-indigo-950/50 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            60-second explainer — no background needed
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
            DataForge 2026 · Pathway Track
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
          AI memory has one core problem:{' '}
          <span className="text-cyan-300">it grows forever,</span> or{' '}
          <span className="text-pink-300">it slowly forgets.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Every AI that chats keeps a running memory of the conversation. Two designs solve
          that memory differently. This page shows you both on five simple words — then lets
          you open the real math whenever you&apos;re ready.
        </p>

        {/* The core idea in 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 border border-cyan-900/50 rounded-xl p-5 space-y-2">
            <div className="text-2xl">📓</div>
            <h3 className="font-bold text-white text-sm">The Transformer writes everything down</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A notebook that grows: word 1 → page 1, word 2 → page 2, and so on. It never
              forgets a word — but the notebook gets bigger with every single word.
              <span className="block mt-1 text-cyan-300/80">(AI researchers call this the “KV cache”.)</span>
            </p>
          </div>

          <div className="bg-slate-950/80 border border-pink-900/50 rounded-xl p-5 space-y-2">
            <div className="text-2xl">🧠</div>
            <h3 className="font-bold text-white text-sm">BDH re-tunes one fixed memory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Like a piano with a fixed set of strings: each new word re-tunes the same
              strings instead of adding pages. The memory never grows — but older words
              slowly fade as new ones arrive.
              <span className="block mt-1 text-pink-300/80">(BDH = Pathway&apos;s “Dragon Hatchling” research architecture.)</span>
            </p>
          </div>

          <div className="bg-slate-950/80 border border-amber-900/50 rounded-xl p-5 space-y-2">
            <div className="text-2xl">⚖️</div>
            <h3 className="font-bold text-white text-sm">That&apos;s the whole trade-off</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A perfect memory that grows forever, or a small fixed memory that slowly
              forgets. Neither is free — and this page shows both sides honestly instead of
              declaring one a winner.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <a
            href="#story-demo"
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/20 transition-all"
          >
            Watch it happen with 5 words ↓
          </a>
          <button
            onClick={onOpenLab}
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all"
          >
            Skip to the technical lab →
          </button>
        </div>
      </section>

      {/* ---------- 2. The animated demo ---------- */}
      <section id="story-demo" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Now watch it happen</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Below, five words arrive one by one. The left side shows the notebook design
              (more words = more pages). The right side shows the fixed-memory design (same
              grid every time, just different spots lighting up). Press play and watch a few
              rounds.
            </p>
          </div>
        </div>

        <AnimatedMemoryFlow />

        <p className="text-[11px] text-slate-500 italic">
          These are simplified visuals to build intuition — the disclosure at the top of the
          page explains exactly what is and isn&apos;t modeled, and the technical lab shows the real
          numbers.
        </p>
      </section>

      {/* ---------- 3. Takeaway ---------- */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white">Two things to remember</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="font-bold text-cyan-300 mb-1">1 · Memory size</div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              More words in → the <strong>Transformer&apos;s</strong> memory keeps growing (page 1,
              2, 3… forever). The <strong>BDH</strong> memory stays exactly the same size no matter
              how many words arrive.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="font-bold text-pink-300 mb-1">2 · Remembering old words</div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              With many words stored, <strong>BDH&apos;s</strong> older words get fainter and can blur
              together. The <strong>Transformer</strong> never forgets — it just keeps paying in
              memory.
            </p>
          </div>
        </div>

        {/* Honest bottom line */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            <span className="font-bold text-amber-300">So which is better? It depends.</span>{' '}
            If a conversation is short, the notebook is cheap and perfect. If it runs forever,
            the notebook eventually runs out of room — and the fading memory becomes the only
            option. The technical lab below shows this trade-off with real, adjustable numbers.
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onOpenLab}
            className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.02]"
          >
            Open the technical lab: full controls &amp; real numbers →
          </button>
          <p className="text-[11px] text-slate-500 mt-3">
            Matrices, memory math, 3D animation, a 1-million-word stress test, and the cited theory.
          </p>
        </div>
      </section>
    </div>
  );
};
