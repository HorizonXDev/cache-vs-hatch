import React from 'react';
import { BookOpenCheck, Sparkles, AlertTriangle, ArrowRight, Notebook, Brain, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { AnimatedMemoryFlow } from './AnimatedMemoryFlow';

interface LandingStoryProps {
  onOpenLab: () => void;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const LandingStory: React.FC<LandingStoryProps> = ({ onOpenLab }) => {
  return (
    <div className="space-y-16 sm:space-y-28">
      {/* ---------- 1. Hero: the idea in plain words ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-950/90 border border-slate-800/90 rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-12 lg:p-16 shadow-2xl space-y-7 sm:space-y-10 backdrop-blur-sm"
      >
        {/* Floating ambient orbs */}
        <motion.div
          aria-hidden
          animate={{ y: [0, -16, 0], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 14, 0], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              60-second explainer — no background needed
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono bg-slate-800/80 text-slate-400 border border-slate-700/80">
              DataForge 2026 · Pathway Track
            </span>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.h1
              variants={staggerItem}
              className="text-[1.75rem] leading-[1.12] sm:text-5xl sm:leading-[1.08] lg:text-[3.6rem] font-extrabold tracking-tight text-white max-w-4xl"
            >
              AI memory has one core problem:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-200">it grows forever,</span>{' '}
              or{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">it slowly forgets.</span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-3xl mt-4 sm:mt-6"
            >
              Every AI that chats keeps a running memory of the conversation. Two designs solve that
              memory differently. This page shows you both on five simple words — then lets you open
              the real math whenever you&apos;re ready.
            </motion.p>
          </motion.div>
        </div>

        {/* The core idea in 3 cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
        >
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="group bg-slate-950/80 border border-cyan-900/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-transform duration-300 group-hover:scale-110">
              <Notebook className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-snug">The Transformer writes everything down</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2.5">
                A notebook that grows: word 1 → page 1, word 2 → page 2, and so on. It never forgets
                a word — but the notebook gets bigger with every single word.
              </p>
            </div>
            <p className="font-mono text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 rounded-lg px-3 py-2">
              (AI researchers call this the “KV cache”.)
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="group bg-slate-950/80 border border-pink-900/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl hover:border-pink-500/50 hover:shadow-pink-500/10 hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-950/80 border border-pink-500/30 flex items-center justify-center text-pink-400 transition-transform duration-300 group-hover:scale-110">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-snug">BDH re-tunes one fixed memory</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2.5">
                Like a piano with a fixed set of strings: each new word re-tunes the same strings
                instead of adding pages. The memory never grows — but older words slowly fade as new
                ones arrive.
              </p>
            </div>
            <p className="font-mono text-xs text-pink-300 bg-pink-950/40 border border-pink-500/20 rounded-lg px-3 py-2">
              (BDH = Pathway&apos;s “Dragon Hatchling” architecture.)
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="group bg-slate-950/80 border border-amber-900/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 transition-transform duration-300 group-hover:scale-110">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-snug">That&apos;s the whole trade-off</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2.5">
                A perfect memory that grows forever, or a small fixed memory that slowly forgets.
                Neither is free — and this page shows both sides honestly instead of declaring one a
                winner.
              </p>
            </div>
            <p className="font-mono text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 rounded-lg px-3 py-2">
              (No winner is declared — the data decides.)
            </p>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <div className="relative flex flex-col sm:flex-row items-center gap-4 pt-4">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="#story-demo"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-2.5"
          >
            <span>Watch it happen with 5 words</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xl"
            >
              ↓
            </motion.span>
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenLab}
            className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-sm sm:text-base font-semibold border border-slate-700/80 transition-all flex items-center justify-center gap-2.5 hover:border-cyan-500/50"
          >
            <span>Skip to the technical lab</span>
            <ArrowRight className="w-4.5 h-4.5 text-cyan-400" />
          </motion.button>
        </div>
      </motion.section>

      {/* ---------- 2. The animated demo ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        id="story-demo"
        className="scroll-mt-28 space-y-6 sm:space-y-8"
      >
        <div className="flex items-end gap-4 sm:gap-5 max-w-4xl">
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 shrink-0">
            <BookOpenCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <p className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-cyan-400 mb-2">
              02 · Watch it happen
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Now watch it happen
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed mt-2">
              Below, five words arrive one by one. The left side shows the notebook design (more
              words = more pages). The right side shows the fixed-memory design (same grid every
              time, just different spots lighting up). Press play and watch a few rounds.
            </p>
          </div>
        </div>

        <AnimatedMemoryFlow />

        <p className="text-xs sm:text-sm text-slate-500 italic leading-relaxed max-w-4xl">
          These are simplified visuals to build intuition — the disclosure at the top of the page
          explains exactly what is and isn&apos;t modeled, and the technical lab shows the real
          numbers.
        </p>
      </motion.section>

      {/* ---------- 3. Takeaway ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="bg-slate-900/90 border border-slate-800/90 rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-12 shadow-2xl space-y-8 sm:space-y-10"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-2">
            03 · The takeaway
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Two key takeaways to remember
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-sm sm:text-base">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/40 transition-all space-y-4 shadow-lg">
            <div className="font-bold text-cyan-300 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-sm flex items-center justify-center">1</span>
              Memory size scalability
            </div>
            <p className="text-slate-300 leading-relaxed">
              More words in → the <strong className="text-white">Transformer&apos;s</strong> memory keeps
              growing (page 1, 2, 3… forever). The{' '}
              <strong className="text-white">BDH</strong> memory stays exactly the same size no
              matter how many words arrive.
            </p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 hover:border-pink-500/40 transition-all space-y-4 shadow-lg">
            <div className="font-bold text-pink-300 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-pink-950 border border-pink-500/40 text-pink-400 font-mono text-sm flex items-center justify-center">2</span>
              Remembering older tokens
            </div>
            <p className="text-slate-300 leading-relaxed">
              With many words stored, <strong className="text-white">BDH&apos;s</strong> older words get
              fainter and can blur together. The <strong className="text-white">Transformer</strong>{' '}
              never forgets — it just keeps paying in memory.
            </p>
          </div>
        </div>

        {/* Honest bottom line */}
        <div className="p-5 sm:p-7 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-start gap-4 shadow-lg">
          <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </span>
          <div className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
            <span className="font-bold text-amber-300">So which is better? It depends.</span>{' '}
            If a conversation is short, the notebook is cheap and perfect. If it runs forever, the
            notebook eventually runs out of room — and the fading memory becomes the only option.
            The technical lab below shows this trade-off with real, adjustable numbers.
          </div>
        </div>

        <div className="text-center pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenLab}
            className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <span>Open the technical lab: full controls &amp; real numbers</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </motion.button>
          <p className="text-xs text-slate-400 mt-4 font-mono">
            Matrices, memory math, 3D animation, a 1-million-word stress test, and cited theory.
          </p>
        </div>
      </motion.section>
    </div>
  );
};
