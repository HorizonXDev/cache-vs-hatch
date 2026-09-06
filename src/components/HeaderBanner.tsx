import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Info, Target, GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export const HeaderBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm shadow-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                DataForge 2026 Pathway Track
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/20">
                Post-Transformer Frontiers
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-500/20">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <span>BDH vs. KV Caching: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">Synaptic Short-Term Memory</span></span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-normal">
              Interactive Educational Sandbox comparing Standard Transformers to Pathway Dragon Hatchling (BDH)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-xs sm:text-sm font-medium text-slate-200 border border-slate-700/80 transition-all shadow-md hover:border-cyan-500/50"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{isOpen ? 'Hide Curriculum Info' : 'Lesson Curriculum & Objectives'}</span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </motion.button>
          </div>
        </div>

        {/* Collapsible Metadata Banner */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm space-y-4 shadow-xl backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1.5">
                      <GraduationCap className="w-4 h-4" /> Target Audience
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Data Scientists, AI Engineers, LLM Systems Researchers, and Computational Neuroscientists exploring context scaling beyond transformer KV memory limits.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1.5">
                      <Target className="w-4 h-4" /> Core Learning Objectives
                    </div>
                    <ul className="text-slate-300 text-xs space-y-1.5 list-disc list-inside">
                      <li>Visualize linear O(N) VRAM expansion in Transformer KV Caches.</li>
                      <li>Understand Hebbian outer-product fast-weight writing: W<sub>t</sub> = λ · W<sub>t-1</sub> + k<sub>t</sub> · v<sub>t</sub><sup>T</sup>.</li>
                      <li>Observe ~5% non-negative sparse unit activations in Dragon Hatchling (BDH).</li>
                      <li>Analyze the trade-off between exact recall and fixed O(1) state footprint.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1.5">
                      <BookOpen className="w-4 h-4" /> Recommended Prerequisites
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Linear algebra (matrix multiplication, outer products), basic attention mechanism intuition (Q, K, V), and fast-weight associative memory concepts.
                    </p>
                  </div>
                </div>

                {/* Central Claim Highlight */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-purple-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 shadow-sm">
                    CENTRAL HYPOTHESIS
                  </div>
                  <p className="text-xs text-cyan-100/90 italic leading-relaxed">
                    "A standard Transformer requires a Key-Value (KV) cache that scales linearly O(N) with sequence length to maintain perfect recall, whereas a Synaptic-Memory recurrent model like Dragon Hatchling (BDH) maintains a fixed-size O(1) state footprint but experiences gradual recall decay (interference) as sequence length grows."
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

