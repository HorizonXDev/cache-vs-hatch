import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Info, Target, GraduationCap, Sparkles, BookOpen, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

interface HeaderBannerProps {
  /** Which view the app is currently showing — highlights the matching nav button. */
  activeView?: 'story' | 'lab';
  /** Navigate back to the simple explainer (story) view. */
  onOpenStory?: () => void;
  /** Open the technical lab. */
  onOpenLab?: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  activeView = 'story',
  onOpenStory,
  onOpenLab,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-5 py-4 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                DataForge 2026 · Pathway Track
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Post-Transformer Frontiers
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl xl:text-[1.7rem] font-extrabold tracking-tight text-white mt-3 flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20 shrink-0">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <span className="min-w-0">
                BDH vs. KV Caching:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                  Synaptic Short-Term Memory
                </span>
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
              An interactive educational sandbox comparing standard Transformers with Pathway's Dragon Hatchling (BDH)
              — no background required to follow along.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Primary view switcher: simple story <-> technical lab */}
            <nav aria-label="View" className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/60 border border-slate-800 shadow-inner">
              <button
                onClick={onOpenStory}
                aria-current={activeView === 'story' ? 'page' : undefined}
                className={`switcher-button flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeView === 'story'
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white border border-transparent shadow-md shadow-cyan-600/30'
                    : 'text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${activeView === 'story' ? 'text-white' : 'text-slate-400'}`} />
                <span>Simple explainer</span>
              </button>
              <button
                onClick={onOpenLab}
                aria-current={activeView === 'lab' ? 'page' : undefined}
                className={`switcher-button flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeView === 'lab'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white border border-transparent shadow-md shadow-purple-600/30'
                    : 'text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <FlaskConical className={`w-4 h-4 ${activeView === 'lab' ? 'text-white' : 'text-slate-400'}`} />
                <span>Technical lab</span>
              </button>
            </nav>

            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700/80 transition-all shadow-md hover:border-cyan-500/50"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{isOpen ? 'Hide Curriculum Info' : 'Lesson Curriculum & Objectives'}</span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </motion.button>
          </div>
        </div>

        {/* Collapsible Metadata Banner */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-5 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-sm space-y-6 shadow-2xl backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30">
                    <div className="flex items-center gap-2.5 text-cyan-400 font-semibold mb-2.5">
                      <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <GraduationCap className="w-4.5 h-4.5" />
                      </span>
                      Target Audience
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Data Scientists, AI Engineers, LLM Systems Researchers, and Computational
                      Neuroscientists exploring context scaling beyond transformer KV memory limits.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/30">
                    <div className="flex items-center gap-2.5 text-purple-400 font-semibold mb-2.5">
                      <span className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <Target className="w-4.5 h-4.5" />
                      </span>
                      Core Learning Objectives
                    </div>
                    <ul className="text-slate-300 text-sm space-y-2 leading-relaxed">
                      <li>Visualize linear O(N) VRAM expansion in Transformer KV Caches.</li>
                      <li>Understand Hebbian outer-product fast-weight writing: W<sub>t</sub> = λ · W<sub>t-1</sub> + k<sub>t</sub> · v<sub>t</sub><sup>T</sup>.</li>
                      <li>Observe ~5% non-negative sparse unit activations in Dragon Hatchling (BDH).</li>
                      <li>Analyze the trade-off between exact recall and fixed O(1) state footprint.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-semibold mb-2.5">
                      <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <BookOpen className="w-4.5 h-4.5" />
                      </span>
                      Recommended Prerequisites
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Linear algebra (matrix multiplication, outer products), basic attention
                      mechanism intuition (Q, K, V), and fast-weight associative memory concepts.
                    </p>
                  </div>
                </div>

                {/* Central Claim Highlight */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-purple-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 shadow-sm">
                    CENTRAL HYPOTHESIS
                  </div>
                  <p className="text-sm text-cyan-100/90 italic leading-relaxed">
                    "A standard Transformer requires a Key-Value (KV) cache that scales linearly O(N)
                    with sequence length to maintain perfect recall, whereas a Synaptic-Memory
                    recurrent model like Dragon Hatchling (BDH) maintains a fixed-size O(1) state
                    footprint but experiences gradual recall decay (interference) as sequence length
                    grows."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
