import { useState, useMemo } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
import { ControlsBar } from './components/ControlsBar';
import { VictoryDashboard } from './components/VictoryDashboard';
import { Model3DSimulator } from './components/Model3DSimulator';
import { StressSimulator } from './components/StressSimulator';
import { AnimatedMemoryFlow } from './components/AnimatedMemoryFlow';
import { Class10Explainer } from './components/Class10Explainer';
import { PanelTransformer } from './components/PanelTransformer';
import { PanelBDH } from './components/PanelBDH';
import { TestBench } from './components/TestBench';
import { RecallDecayCurve } from './components/RecallDecayCurve';
import { GuidedLesson } from './components/GuidedLesson';
import { StepByStepToyModel } from './components/StepByStepToyModel';
import {
  generateTokenSequence,
  computeTransformerKVCache,
  computeBDHSynapticMatrix,
  queryModels,
} from './utils/mathEngine';
import { Sparkles, Cpu, Play, Flame, Box } from 'lucide-react';

export function App() {
  // Main view mode: '3d' (3D Interactive Model Simulation) vs 'toy' (5-token simulator) vs 'sandbox' (Full N=5..100) vs 'stress' (1,000,000 token simulator)
  const [viewMode, setViewMode] = useState<'3d' | 'toy' | 'sandbox' | 'stress'>('3d');

  // State for controls (Defaults: N=20, decay=0.95, D=8)
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Header Banner */}
      <HeaderBanner />

      {/* Mode Switcher Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Learning Mode:</span>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === '3d'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              🎮 Mode 1: 3D Interactive Model Simulation
            </button>
            <button
              onClick={() => setViewMode('toy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === 'toy'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              🐣 Mode 2: Step-by-Step Toy Simulator
            </button>
            <button
              onClick={() => setViewMode('sandbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === 'sandbox'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              🧪 Mode 3: Full Benchmark Sandbox (N=5..100)
            </button>
            <button
              onClick={() => setViewMode('stress')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === 'stress'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              ⚡ Mode 4: 1,000,000 Token Stress Simulator & BDH Wins
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden lg:block">
            {viewMode === '3d'
              ? 'Viewing: 3D Model Interior Simulation'
              : viewMode === 'toy'
              ? 'Viewing: Step-by-step 5-token simulator'
              : viewMode === 'sandbox'
              ? `Viewing: Full benchmark (N=${sequenceLength}, D=${dimension})`
              : 'Viewing: 1,000,000 Token VRAM Stress Simulator'}
          </div>
        </div>
      </div>

      {/* Controls Bar (Visible in Sandbox) */}
      {viewMode === 'sandbox' && (
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
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Head-to-Head Victory Dashboard (Always accessible at top) */}
        <VictoryDashboard />

        {/* MODE 1: 3D Interactive Model Simulation */}
        {viewMode === '3d' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <Model3DSimulator />
            <AnimatedMemoryFlow />
            <Class10Explainer />
          </div>
        )}

        {/* MODE 2: Step-by-Step Toy Model & Beginner Lesson */}
        {viewMode === 'toy' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <StepByStepToyModel decayLambda={decayLambda} />
            <GuidedLesson />
          </div>
        )}

        {/* MODE 3: Full Benchmark Sandbox */}
        {viewMode === 'sandbox' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <GuidedLesson />

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

        {/* MODE 4: 1,000,000 Token Stress Simulator */}
        {viewMode === 'stress' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <StressSimulator />
            <GuidedLesson />
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
            Built with React, Tailwind CSS & Lucide Icons. Pure 100% Client-Side Simulation.
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
