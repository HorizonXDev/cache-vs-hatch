import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
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
    return generateTokenSequence(sequenceLength, dimension);
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

  // Open the technical lab (optionally on a specific tab)
  const openLab = (tab: LabTab = 'simulator') => {
    setLabTab(tab);
    setShowLab(true);
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
      className={`px-3.5 py-2 rounded-lg text-left transition-all flex items-center gap-2.5 border ${
        active ? activeClasses : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="flex flex-col">
        <span className="text-xs font-bold leading-tight">{label}</span>
        <span className={`text-[9px] font-mono leading-tight ${active ? 'opacity-80' : 'text-slate-500'}`}>
          {sub}
        </span>
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Header Banner */}
      <HeaderBanner />

      {/* Toy reimplementation disclosure — hackathon rule: toy models must be identified as such */}
      <div className="border-b border-amber-900/40 bg-amber-950/25">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-start gap-2.5 text-[11px] sm:text-xs leading-relaxed text-amber-100/90">
          <FlaskConical className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold text-amber-300">Toy reimplementation — not the official BDH model: </span>
            this app is our own simplified teaching reimplementation of BDH's Hebbian fast-weight
            mechanism (W<sub>t</sub> = λ·W<sub>t-1</sub> + k·v<sup>T</sup>), built from scratch for
            DataForge 2026. It is not Pathway's actual BDH model or codebase — real BDH adds
            architectural details not modeled here (e.g. sparse activation gating, GPU-friendly
            formulation, scale-free graph structure). Where the app cites Pathway figures, they are
            labeled as reported and linked to their sources.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {!showLab ? (
          /* ---------------- SIMPLE STORY (default landing) ---------------- */
          <LandingStory onOpenLab={() => openLab('simulator')} />
        ) : (
          /* ---------------- TECHNICAL LAB ---------------- */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Lab header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    TECHNICAL LAB
                  </span>
                  <span className="text-xs text-slate-400 font-mono">the same simulation, with the dials exposed</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">Full simulator &amp; deep dive</h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
                  Every number here is computed live in your browser from seeded random vectors —
                  nothing is hardcoded. Use the tabs to explore the matrices, the 3D view, an
                  extreme-scale memory test, or the cited theory.
                </p>
              </div>
              <button
                onClick={() => setShowLab(false)}
                className="shrink-0 self-start md:self-end px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to the simple explainer
              </button>
            </div>

            {/* Lab tabs (plain English) */}
            <nav className="flex flex-wrap gap-2">
              {labTabButton(
                labTab === 'simulator',
                'simulator',
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />,
                'Interactive simulator',
                'change N / D / λ · compare side by side',
                'bg-cyan-950 border-cyan-500/60 text-white shadow-md shadow-cyan-950/40'
              )}
              {labTabButton(
                labTab === '3d',
                '3d',
                <Box className="w-4 h-4 text-purple-400 shrink-0" />,
                '3D animations',
                'watch both designs as scenes',
                'bg-purple-950 border-purple-500/60 text-white shadow-md shadow-purple-950/40'
              )}
              {labTabButton(
                labTab === 'stress',
                'stress',
                <Flame className="w-4 h-4 text-pink-400 shrink-0" />,
                'Extreme scale — up to 1M words',
                'memory required at huge context',
                'bg-pink-950 border-pink-500/60 text-white shadow-md shadow-pink-950/40'
              )}
              {labTabButton(
                labTab === 'theory',
                'theory',
                <BookOpenCheck className="w-4 h-4 text-indigo-400 shrink-0" />,
                'Theory, lesson & quiz',
                'the science behind the demo',
                'bg-indigo-950 border-indigo-500/60 text-white shadow-md shadow-indigo-950/40'
              )}
            </nav>

            {/* ---------------- Tab: Interactive simulator ---------------- */}
            {labTab === 'simulator' && (
              <div className="space-y-8">
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

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="space-y-8">
                <Model3DSimulator />
              </div>
            )}

            {/* ---------------- Tab: Extreme scale ---------------- */}
            {labTab === 'stress' && (
              <div className="space-y-8">
                <StressSimulator />
              </div>
            )}

            {/* ---------------- Tab: Theory, lesson & quiz ---------------- */}
            {labTab === 'theory' && (
              <div className="space-y-8">
                <GuidedLesson />
                <StepByStepToyModel decayLambda={decayLambda} />
                <Class10Explainer />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>DataForge 2026 Pathway Track Submission</span>
          </div>
          <div>
            Built with React, Tailwind CSS &amp; Lucide Icons. Pure 100% Client-Side Simulation.
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Pathway Post-Transformer Architecture Series (BDH)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
