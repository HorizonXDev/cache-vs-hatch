import React, { useState } from 'react';
import { BookOpen, Sparkles, Brain, Cpu, Zap, Layers, GitBranch, Award, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GuidedLesson: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guided' | 'theory'>('guided');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const LESSON_STEPS = [
    {
      title: '1. The Notebook Analogy: Why Standard Transformers Run Out of Memory',
      icon: Cpu,
      color: 'text-cyan-400',
      badge: 'ELI5 Concept',
      content: (
        <div className="space-y-3.5 text-slate-300 leading-relaxed text-xs sm:text-sm">
          <p>
            Imagine taking notes in a class. A <strong className="text-cyan-300">Standard Transformer</strong> acts like a student who writes down <em>every single word</em> on new pages in a physical notebook (the <strong>KV Cache</strong>).
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-cyan-200 shadow-inner">
            {"Notebook Size = 2 × Layers × Heads × Dimension × Sequence Length (N)"}
          </div>
          <p>
            When you read a 5-page story, your notebook is light. But when you process a 100,000-page book, your notebook becomes so heavy and massive that it fills up your entire backpack (GPU VRAM)! This is the <strong>KV Cache Memory Wall</strong>.
          </p>
        </div>
      ),
    },
    {
      title: '2. The Piano String Analogy: How Pathway BDH Synapses Work',
      icon: Brain,
      color: 'text-pink-400',
      badge: 'Hebbian Learning',
      content: (
        <div className="space-y-3.5 text-slate-300 leading-relaxed text-xs sm:text-sm">
          <p>
            Instead of adding new pages to a notebook, <strong className="text-pink-300">Pathway Dragon Hatchling (BDH)</strong> works like tuning a fixed set of <strong>piano strings</strong> (synaptic weights matrix W).
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-sm text-pink-200 flex items-center gap-1.5 flex-wrap shadow-inner">
            <span className="text-pink-300 font-bold">W<sub>t</sub></span>
            <span className="text-slate-400">=</span>
            <span className="text-yellow-300">λ</span>
            <span className="text-slate-400">·</span>
            <span className="text-pink-300">W<sub>t-1</sub></span>
            <span className="text-slate-400">+</span>
            <span className="text-cyan-300">k<sub>t</sub></span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-300">v<sub>t</sub><sup>T</sup></span>
          </div>
          <p>
            Every time a new token arrives, BDH gently adjusts the tension of the piano strings (<strong className="text-pink-300">W<sub>t</sub></strong>). The size of the piano <em>never grows</em>—it is always a fixed <strong className="text-yellow-300">D × D</strong> grid! Over time, older sounds gently fade away (<strong className="text-yellow-300">λ</strong>), making room for new notes.
          </p>
        </div>
      ),
    },
    {
      title: '3. Why ~5% Sparse Activations Prevent Confusion',
      icon: Zap,
      color: 'text-yellow-400',
      badge: 'Biological Sparsity',
      content: (
        <div className="space-y-3.5 text-slate-300 leading-relaxed text-xs sm:text-sm">
          <p>
            If you play 100 songs on the same piano, wouldn't the sounds get mixed up? In human brains, only a tiny fraction of neurons fire at any moment.
          </p>
          <p>
            BDH uses <strong className="text-yellow-300">sparse non-negative activations</strong> where only <strong>~5% of units activate</strong> for any key.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-yellow-200 shadow-inner">
            {"Sparsity Rate ≈ 5% Active Units"}
          </div>
          <p>
            Because only 5% of nodes glow at a time, different memories rarely overlap or interfere with each other, keeping the system computationally lightweight!
          </p>
        </div>
      ),
    },
    {
      title: '4. Summary: The Great AI Trade-Off',
      icon: Layers,
      color: 'text-emerald-400',
      badge: 'Core Trade-Off',
      content: (
        <div className="space-y-3.5 text-slate-300 leading-relaxed text-xs sm:text-sm">
          <p>
            Here is the core lesson comparing both architectures:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-cyan-200 shadow-sm">
              <div className="font-bold text-cyan-300 mb-1.5">Standard Transformer</div>
              <div>Memory: Grows endlessly O(N)</div>
              <div>Recall: 100% Perfect</div>
              <div>Problem: GPU out of memory crash</div>
            </div>
            <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-900/60 text-pink-200 shadow-sm">
              <div className="font-bold text-pink-300 mb-1.5">Pathway BDH</div>
              <div>Memory: Fixed O(1) size</div>
              <div>Recall: Old items gently fade</div>
              <div>Benefit: Infinite context streaming</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-7 backdrop-blur-sm">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('guided')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'guided'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            The Guided Narrative (Beginner Friendly)
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'theory'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Scientific Theory &amp; BDH vs. SSMs
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:block">
          DataForge 2026 Education Track
        </span>
      </div>

      {/* Tab 1: Guided Narrative Lesson */}
      {activeTab === 'guided' && (
        <div className="space-y-4">
          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {LESSON_STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = currentStep === idx;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all shadow-sm ${
                    isActive
                      ? 'bg-slate-950 border-cyan-400 text-white shadow-lg ring-2 ring-cyan-500/30'
                      : 'bg-slate-950/40 hover:bg-slate-950/80 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <IconComp className={`w-4 h-4 ${step.color}`} />
                    <span className="truncate">Step {idx + 1}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">{step.badge}</div>
                </motion.button>
              );
            })}
          </div>

          {/* Step Content Box */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {LESSON_STEPS[currentStep].title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-slate-900 text-cyan-400 border border-slate-800">
                {LESSON_STEPS[currentStep].badge}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {LESSON_STEPS[currentStep].content}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 disabled:opacity-40 text-slate-300 hover:bg-slate-800 border border-slate-800 font-medium transition-all"
              >
                Previous Step
              </button>
              <button
                disabled={currentStep === LESSON_STEPS.length - 1}
                onClick={() => setCurrentStep((prev) => Math.min(LESSON_STEPS.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-cyan-600 disabled:opacity-40 text-white font-semibold hover:bg-cyan-500 flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scientific Theory Section */}
      {activeTab === 'theory' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-inner"
        >
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Scientific Foundation: Pathway Dragon Hatchling (BDH) Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Technical taxonomy distinguishing BDH from standard attention and State-Space Models (SSMs)
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-purple-300 text-sm">1. Is BDH a State-Space Model (SSM) like Mamba?</h4>
            <p>
              <strong className="text-white">No.</strong> While State-Space Models (e.g., Mamba, S4) rely on continuous linear time-invariant system dynamics parameterized with selective scan algorithms, <strong className="text-purple-300">Dragon Hatchling (BDH)</strong> is a post-transformer architecture family formulated through <strong>fast-weight associative synaptic matrices</strong> and low-rank non-negative activations.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-purple-300 text-sm">2. Linear Attention via Hebbian Outer-Product Dynamics</h4>
            <p>
              Standard Transformer Softmax attention prevents factorizing key and query computations due to the non-linear Softmax operator.
            </p>
            <p>
              BDH converts softmax attention into linear outer-product updates:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-purple-200 shadow-inner">
              W<sub>t</sub> = λ · W<sub>t−1</sub> + ϕ(k<sub>t</sub>) · ψ(v<sub>t</sub>)<sup>T</sup> &nbsp;&nbsp;⟹&nbsp;&nbsp; v<sub>retrieved</sub> = W<sub>t</sub> · ϕ(q<sub>t</sub>)
            </div>
            <p>
              where ϕ and ψ represent non-negative activation functions (ReLU). This transforms token retrieval into matrix-vector operations fully parallelizable on modern GPU hardware.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2 shadow-md">
            <div className="font-bold text-purple-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" /> Key Research Takeaway for Data Scientists
            </div>
            <p className="text-xs text-purple-100">
              By trading off exact long-range token recall for bounded O(1) fast-weight state storage, BDH unlocks infinite sequence streaming without VRAM context length limits.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

