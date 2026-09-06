import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HeaderBanner } from './components/HeaderBanner';
import { ClaimBanner } from './components/ClaimBanner';
import { LandingStory } from './components/LandingStory';
import { VictoryDashboard } from './components/VictoryDashboard';
import { Model3DSimulator } from './components/Model3DSimulator';
import { StressSimulator } from './components/StressSimulator';
import { Class10Explainer } from './components/Class10Explainer';
import { PanelTransformer } from './components/PanelTransformer';
import { PanelBDH } from './components/PanelBDH';
import { TestBench } from './components/TestBench';
import { RecallDecayCurve } from './components/RecallDecayCurve';
import { GuidedLesson } from './components/GuidedLesson';
import { StepByStepToyModel } from './components/StepByStepToyModel';
import { ControlsBar } from './components/ControlsBar';
import {
  generateTokenSequence,
  computeTransformerKVCache,
  computeBDHSynapticMatrix,
  queryModels,
} from './utils/mathEngine';
import { Sparkles, Cpu, Box, Flame, BookOpenCheck, ArrowLeft, FlaskConical } from 'lucide-react';

type LabTab = 'simulator' | '3d' | 'stress' | 'theory';

/** Thin gradient bar under the very top of the page that fills as you scroll. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 h-[3px] origin-left z-[60] pointer-events-none bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400"
    />
  );
}

/** Soft animated light orbs drifting behind the whole page. */
function AmbientBackground() {
  return (
    <div aria-hidden className="ambient-lights fixed inset-0 z-0 pointer-events-none">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
    </div>
  );
}

export function App() {
  // Simple story first; the full simulator/tools live behind the "Technical Lab".
  const [showLab, setShowLab] = useState<boolean>(false);
  const [labTab, setLabTab] = useState<LabTab>('simulator');

  // State for the live simulation (defaults: N=20, decay=0.95, D=8)
  const [sequenceLength, setSequenceLength] = useState<number>(20);
  const [decayLambda, setDecayLambda] = useState<number>(0.95);
  const [dimension, setDimension] = useState<number>(8);
  const [seed, setSeed] = useState<number>(42);

  // Active query index in the token sequence
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Generate sequence of random tokens client-side
  const tokens = useMemo(() => {
    // Seed is genuinely consumed: the PRNG produces deterministic vectors,
    // and bumping the seed regenerates them.
    return generateTokenSequence(sequenceLength, dimension, seed);
  }, [sequenceLength, dimension, seed]);

  // Compute Transformer KV Cache state
  const transformerState = useMemo(() => {
    return computeTransformerKVCache(tokens);
  }, [tokens]);

  // Compute Pathway BDH Synaptic Fast-Weight Matrix state
  const bdhState = useMemo(() => {
    return computeBDHSynapticMatrix(tokens, decayLambda, dimension);
  }, [tokens, decayLambda, dimension]);

  // Ensure selectedIndex remains valid when N changes
  const validSelectedIndex = Math.min(selectedIndex, tokens.length - 1);

  // Perform live query retrieval for both models
  const retrievalResult = useMemo(() => {
    return queryModels(tokens, validSelectedIndex, transformerState, bdhState, decayLambda);
  }, [tokens, validSelectedIndex, transformerState, bdhState, decayLambda]);

  // Handle Preset updates
  const handleApplyPreset = (n: number, l: number, d: number) => {
    setSequenceLength(n);
    setDecayLambda(l);
    setDimension(d);
    setSelectedIndex(0);
  };

  // Handle sequence regeneration
  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
  };

  // Smoothly jump back to the very top when returning to the simple explainer.
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Align an element's top edge just below the sticky header.
  const scrollBelowHeader = (el: HTMLElement) => {
    const header = document.querySelector('header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    const target = el.getBoundingClientRect().top + window.scrollY - headerBottom - 16;
    window.scrollTo({ top: Math.max(target, 0), left: 0, behavior: 'smooth' });
  };

  // When opening the lab, land on the lab's own header ("Full simulator & deep dive")
  // instead of the top of the page — so the claim box stays out of the way.
  const scrollToLabHeader = () => {
    // Wait one frame so React has committed the lab view before measuring.
    requestAnimationFrame(() => {
      const labEl = document.getElementById('technical-lab');
      if (labEl) {
        scrollBelowHeader(labEl);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  };

  // Open the technical lab (optionally on a specific tab)
  const openLab = (tab: LabTab = 'simulator') => {
    setLabTab(tab);
    setShowLab(true);
    scrollToLabHeader();
  };

  // Return to the simple explainer landing
  const goToStory = () => {
    setShowLab(false);
    scrollToTop();
  };

  const labTabButton = (
    active: boolean,
    tab: LabTab,
    icon: ReactNode,
    label: string,
    sub: string,
    activeClasses: string
  ) => (
    <button
      key={tab}
      onClick={() => setLabTab(tab)}
      className={`px-4 py-3 rounded-xl text-left transition-all flex items-center gap-3 border ${
        active ? activeClasses : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="flex flex-col">
        <span className="text-xs sm:text-sm font-bold leading-tight">{label}</span>
        <span className={`text-[10px] sm:text-[11px] font-mono leading-tight ${active ? 'opacity-80' : 'text-slate-500'}`}>
          {sub}
        </span>
      </span>
    </button>
  );

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black relative">
      <ScrollProgress />
      <AmbientBackground />

      {/* Header Banner */}
      <div className="relative z-10">
        <HeaderBanner
          activeView={showLab ? 'lab' : 'story'}
          onOpenStory={goToStory}
          onOpenLab={() => openLab()}
        />
      </div>

      {/* Toy reimplementation disclosure — hackathon rule: toy models must be identified as such */}
      <div className="relative z-10 border-b border-amber-900/40 bg-amber-950/25 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 sm:px-8 lg:px-10 flex items-start gap-3.5 sm:gap-4">
          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 items-center justify-center shrink-0 mt-0.5">
            <FlaskConical className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] sm:text-sm text-amber-100/90 leading-relaxed max-w-4xl">
              <span className="font-bold text-amber-300 tracking-wide">Toy reimplementation — not the official BDH model: </span>
              this app is our own simplified teaching reimplementation of BDH's Hebbian fast-weight
              mechanism (W<sub>t</sub> = λ·W<sub>t-1</sub> + k·v<sup>T</sup>), built from scratch for
              DataForge 2026. It is not Pathway's actual BDH model or codebase — real BDH adds
              architectural details not modeled here (e.g. sparse activation gating, GPU-friendly
              formulation, scale-free graph structure). Where the app cites Pathway figures, they are
              labeled as reported and linked to their sources.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-5 py-8 sm:px-8 lg:px-10 sm:py-10 space-y-14 sm:space-y-20">
        {/* Central falsifiable claim — the first thing a learner or judge reads, above all demos */}
        <ClaimBanner />

        {!showLab ? (
          /* ---------------- SIMPLE STORY (default landing) ---------------- */
          <LandingStory onOpenLab={() => openLab('simulator')} />
        ) : (
          /* ---------------- TECHNICAL LAB ---------------- */
          <div
            id="technical-lab"
            className="space-y-12 sm:space-y-14 animate-in fade-in duration-200"
          >
            {/* Lab header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    TECHNICAL LAB
                  </span>
                  <span className="text-sm text-slate-400 font-mono">the same simulation, with the dials exposed</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Full simulator &amp; deep dive
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
                  Every number here is computed live in your browser from seeded random vectors —
                  nothing is hardcoded. Use the tabs to explore the matrices, the 3D view, an
                  extreme-scale memory test, or the cited theory.
                </p>
              </div>
              <button
                onClick={goToStory}
                className="shrink-0 self-start lg:self-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2 hover:border-cyan-500/50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to the simple explainer
              </button>
            </div>

            {/* Lab tabs (plain English) */}
            <nav className="flex flex-wrap gap-3">
              {labTabButton(
                labTab === 'simulator',
                'simulator',
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />,
                'Interactive simulator',
                'change N / D / λ · compare side by side',
                'bg-cyan-950 border-cyan-500/60 text-white shadow-lg shadow-cyan-950/40'
              )}
              {labTabButton(
                labTab === '3d',
                '3d',
                <Box className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />,
                '3D animations',
                'watch both designs as scenes',
                'bg-purple-950 border-purple-500/60 text-white shadow-lg shadow-purple-950/40'
              )}
              {labTabButton(
                labTab === 'stress',
                'stress',
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 shrink-0" />,
                'Extreme scale — up to 1M words',
                'memory required at huge context',
                'bg-pink-950 border-pink-500/60 text-white shadow-lg shadow-pink-950/40'
              )}
              {labTabButton(
                labTab === 'theory',
                'theory',
                <BookOpenCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />,
                'Theory, lesson & quiz',
                'the science behind the demo',
                'bg-indigo-950 border-indigo-500/60 text-white shadow-lg shadow-indigo-950/40'
              )}
            </nav>

            {/* ---------------- Tab: Interactive simulator ---------------- */}
            {labTab === 'simulator' && (
              <div className="space-y-12 sm:space-y-14">
                <ControlsBar
                  sequenceLength={sequenceLength}
                  setSequenceLength={setSequenceLength}
                  decayLambda={decayLambda}
                  setDecayLambda={setDecayLambda}
                  dimension={dimension}
                  setDimension={setDimension}
                  onRegenerate={handleRegenerate}
                  onApplyPreset={handleApplyPreset}
                />

                {/* Honest head-to-head summary (computed live) */}
                <VictoryDashboard
                  sequenceLength={sequenceLength}
                  dimension={dimension}
                  decayLambda={decayLambda}
                  selectedIndex={validSelectedIndex}
                  transformerState={transformerState}
                  bdhState={bdhState}
                  retrievalResult={retrievalResult}
                />

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PanelTransformer
                    transformerState={transformerState}
                    sequenceLength={sequenceLength}
                    dimension={dimension}
                    selectedIndex={validSelectedIndex}
                    attentionWeights={retrievalResult.transformerAttention}
                  />

                  <PanelBDH
                    bdhState={bdhState}
                    sequenceLength={sequenceLength}
                    decayLambda={decayLambda}
                    dimension={dimension}
                    selectedIndex={validSelectedIndex}
                  />
                </section>

                <TestBench
                  tokens={tokens}
                  selectedIndex={validSelectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  result={retrievalResult}
                  decayLambda={decayLambda}
                />

                <RecallDecayCurve
                  tokens={tokens}
                  transformerState={transformerState}
                  bdhState={bdhState}
                  decayLambda={decayLambda}
                  selectedIndex={validSelectedIndex}
                  setSelectedIndex={setSelectedIndex}
                />
              </div>
            )}

            {/* ---------------- Tab: 3D animations ---------------- */}
            {labTab === '3d' && (
              <div className="space-y-12 sm:space-y-14">
                <Model3DSimulator />
              </div>
            )}

            {/* ---------------- Tab: Extreme scale ---------------- */}
            {labTab === 'stress' && (
              <div className="space-y-12 sm:space-y-14">
                <StressSimulator />
              </div>
            )}

            {/* ---------------- Tab: Theory, lesson & quiz ---------------- */}
            {labTab === 'theory' && (
              <div className="space-y-12 sm:space-y-14">
                <GuidedLesson />
                <StepByStepToyModel decayLambda={decayLambda} />
                <Class10Explainer />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-sm py-10 px-6 text-center text-xs sm:text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-semibold text-slate-200">
            <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
            <span>DataForge 2026 Pathway Track Submission</span>
          </div>
          <div className="text-slate-400">
            Built with React, Tailwind CSS &amp; Lucide Icons. Pure 100% Client-Side Simulation.
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Pathway Post-Transformer Architecture Series (BDH)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
