import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Info, Target, GraduationCap, Sparkles, BookOpen } from 'lucide-react';

export const HeaderBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                DataForge 2026 Pathway Track
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Post-Transformer Frontiers
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              BDH vs. KV Caching: Exploring Synaptic Short-Term Memory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive Educational Sandbox comparing Standard Transformers to Pathway Dragon Hatchling (BDH)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-300 border border-slate-700 transition-all shadow-sm"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{isOpen ? 'Hide Curriculum Info' : 'Lesson Curriculum & Objectives'}</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Metadata Banner */}
        {isOpen && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
                  <GraduationCap className="w-4 h-4" /> Target Audience
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Data Scientists, AI Engineers, LLM Systems Researchers, and Computational Neuroscientists exploring context scaling beyond transformer KV memory limits.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1">
                  <Target className="w-4 h-4" /> Core Learning Objectives
                </div>
                <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
                  <li>Visualize linear O(N) VRAM expansion in Transformer KV Caches.</li>
                  <li>Understand Hebbian outer-product fast-weight writing: W_t = λ * W_{"{t-1}"} + k_t * v_t^T.</li>
                  <li>Observe ~5% non-negative sparse unit activations in Dragon Hatchling (BDH).</li>
                  <li>Analyze the trade-off between exact recall and fixed O(1) state footprint.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                  <BookOpen className="w-4 h-4" /> Recommended Prerequisites
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Linear algebra (matrix multiplication, outer products), basic attention mechanism intuition (Q, K, V), and fast-weight associative memory concepts.
                </p>
              </div>
            </div>

            {/* Central Claim Highlight */}
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                CENTRAL HYPOTHESIS
              </div>
              <p className="text-xs text-cyan-100 italic leading-relaxed">
                "A standard Transformer requires a Key-Value (KV) cache that scales linearly O(N) with sequence length to maintain perfect recall, whereas a Synaptic-Memory recurrent model like Dragon Hatchling (BDH) maintains a fixed-size O(1) state footprint but experiences gradual recall decay (interference) as sequence length grows."
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
