import React from 'react';
import { BookOpenCheck, Sparkles, AlertTriangle, ArrowRight, Notebook, Brain, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedMemoryFlow } from './AnimatedMemoryFlow';

interface LandingStoryProps {
  onOpenLab: () => void;
}

export const LandingStory: React.FC<LandingStoryProps> = ({ onOpenLab }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* ---------- 1. Hero: the idea in plain words ---------- */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-sm"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            60-second explainer — no background needed
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800/80 text-slate-400 border border-slate-700/80">
            DataForge 2026 · Pathway Track
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
          AI memory has one core problem:{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-200">it grows forever,</span> or{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">it slowly forgets.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-normal">
          Every AI that chats keeps a running memory of the conversation. Two designs solve
          that memory differently. This page shows you both on five simple words — then lets
          you open the real math whenever you&apos;re ready.
        </p>

        {/* The core idea in 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-slate-950/80 border border-cyan-900/40 rounded-2xl p-5 space-y-3 shadow-lg hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Notebook className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">The Transformer writes everything down</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A notebook that grows: word 1 → page 1, word 2 → page 2, and so on. It never
              forgets a word — but the notebook gets bigger with every single word.
              <span className="block mt-2 font-mono text-[11px] text-cyan-300">(AI researchers call this the “KV cache”.)</span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-slate-950/80 border border-pink-900/40 rounded-2xl p-5 space-y-3 shadow-lg hover:border-pink-500/50 hover:shadow-pink-500/10 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">BDH re-tunes one fixed memory</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Like a piano with a fixed set of strings: each new word re-tunes the same
              strings instead of adding pages. The memory never grows — but older words
              slowly fade as new ones arrive.
              <span className="block mt-2 font-mono text-[11px] text-pink-300">(BDH = Pathway&apos;s “Dragon Hatchling” architecture.)</span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-slate-950/80 border border-amber-900/40 rounded-2xl p-5 space-y-3 shadow-lg hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">That&apos;s the whole trade-off</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A perfect memory that grows forever, or a small fixed memory that slowly
              forgets. Neither is free — and this page shows both sides honestly instead of
              declaring one a winner.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#story-demo"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Watch it happen with 5 words</span>
            <span className="text-lg">↓</span>
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenLab}
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-sm font-semibold border border-slate-700/80 transition-all flex items-center justify-center gap-2"
          >
            <span>Skip to the technical lab</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </motion.button>
        </div>
      </motion.section>

      {/* ---------- 2. The animated demo ---------- */}
      <motion.section variants={itemVariants} id="story-demo" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Now watch it happen</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
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
      </motion.section>

      {/* ---------- 3. Takeaway ---------- */}
      <motion.section variants={itemVariants} className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">Two key takeaways to remember</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 hover:border-cyan-500/40 transition-all space-y-2">
            <div className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs flex items-center justify-center">1</span>
              Memory size scalability
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              More words in → the <strong>Transformer&apos;s</strong> memory keeps growing (page 1,
              2, 3… forever). The <strong>BDH</strong> memory stays exactly the same size no matter
              how many words arrive.
            </p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 hover:border-pink-500/40 transition-all space-y-2">
            <div className="font-bold text-pink-300 flex items-center gap-2 text-sm">
              <span className="w-6 h-6 rounded-full bg-pink-950 border border-pink-500/40 text-pink-400 font-mono text-xs flex items-center justify-center">2</span>
              Remembering older tokens
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              With many words stored, <strong>BDH&apos;s</strong> older words get fainter and can blur
              together. The <strong>Transformer</strong> never forgets — it just keeps paying in
              memory.
            </p>
          </div>
        </div>

        {/* Honest bottom line */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-start gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            <span className="font-bold text-amber-300">So which is better? It depends.</span>{' '}
            If a conversation is short, the notebook is cheap and perfect. If it runs forever,
            the notebook eventually runs out of room — and the fading memory becomes the only
            option. The technical lab below shows this trade-off with real, adjustable numbers.
          </div>
        </div>

        <div className="text-center pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenLab}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-2.5 mx-auto"
          >
            <span>Open the technical lab: full controls &amp; real numbers</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <p className="text-[11px] text-slate-400 mt-3 font-mono">
            Matrices, memory math, 3D animation, a 1-million-word stress test, and cited theory.
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
};

