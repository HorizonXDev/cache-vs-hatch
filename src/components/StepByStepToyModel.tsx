import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Sparkles, Brain, Cpu, Info } from 'lucide-react';
import { generateTokenSequence, computeToyModelStepHistory } from '../utils/mathEngine';

interface StepByStepToyModelProps {
  decayLambda: number;
}

export const StepByStepToyModel: React.FC<StepByStepToyModelProps> = ({ decayLambda }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [toySeed, setToySeed] = useState<number>(100);

  // Toy parameters fixed for maximum visual clarity: N=5 tokens, D=4 dimension
  const toyDimension = 4;
  const toySequenceLength = 5;

  const toyTokens = useMemo(() => {
    return generateTokenSequence(toySequenceLength, toyDimension);
  }, [toySeed]);

  const history = useMemo(() => {
    return computeToyModelStepHistory(toyTokens, decayLambda, toyDimension);
  }, [toyTokens, decayLambda]);

  // Auto-play timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= toySequenceLength) {
            setIsPlaying(false);
            return toySequenceLength;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, toySequenceLength]);

  const state = history[currentStep] || history[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive 5-Token Toy Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
              N=5 Tokens | D=4 Grid
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            Step-by-Step Memory Write Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Step through token by token to watch how memory matrices change in real time!
          </p>
        </div>

        {/* Step Controls Player */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            title="Reset to Step 0"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            disabled={currentStep === 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.max(0, prev - 1));
            }}
            title="Previous Step"
            className="p-2 rounded-lg bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            disabled={currentStep >= toySequenceLength}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.min(toySequenceLength, prev + 1));
            }}
            title="Next Step"
            className="p-2 rounded-lg bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setToySeed((prev) => prev + 1)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium border border-slate-700"
          >
            New Vectors
          </button>
        </div>
      </div>

      {/* Token Timeline Strip */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>Token Stream Step Player</span>
          <span className="font-mono text-cyan-400">Step {currentStep} of {toySequenceLength}</span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {/* Step 0: Initial */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            className={`p-2 rounded-lg border text-center text-xs transition-all ${
              currentStep === 0
                ? 'bg-slate-800 border-cyan-400 text-cyan-300 font-bold ring-2 ring-cyan-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-base">🟢</div>
            <div className="font-mono text-[10px]">Start</div>
          </button>

          {/* Tokens 1..5 */}
          {toyTokens.map((token, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isProcessed = currentStep >= stepNum;
            return (
              <button
                key={token.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(stepNum);
                }}
                className={`p-2 rounded-lg border text-center text-xs transition-all ${
                  isActive
                    ? 'bg-cyan-950 border-cyan-400 text-white font-bold scale-105 shadow-lg ring-2 ring-cyan-500/40'
                    : isProcessed
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className="text-base">{token.emoji}</div>
                <div className="font-semibold text-[11px] truncate">{token.label}</div>
                <div className="text-[9px] font-mono text-slate-400">#{stepNum}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Token Vector Breakdown */}
      {state.currentToken && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{state.currentToken.emoji}</span>
              <span className="font-bold text-slate-100 text-sm">
                Incoming Token: {state.currentToken.label} (Step #{currentStep})
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
              Vector Dimension D=4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-cyan-400 font-bold mb-1">{"Key Vector k_t (Query Matcher):"}</div>
              <div className="flex gap-1.5">
                {state.keyVector.map((val, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                    {val.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-purple-400 font-bold mb-1">{"Value Vector v_t (Information Content):"}</div>
              <div className="flex gap-1.5">
                {state.valueVector.map((val, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-purple-300">
                    {val.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Toy Model State Write Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transformer Side */}
        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/40 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Standard Transformer KV Memory Write
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Rows Stored: {state.transformerKeys.length} / 5
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">
              Action: Appends Key & Value rows to the sequence table.
            </div>

            {/* Keys Table */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-cyan-400">
                {"Key Matrix [K] ("}{state.transformerKeys.length}{" rows):"}
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 space-y-1 max-h-36 overflow-y-auto">
                {state.transformerKeys.length === 0 ? (
                  <div className="text-[11px] text-slate-600 italic text-center py-2">No keys stored yet</div>
                ) : (
                  state.transformerKeys.map((row, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-slate-500 w-12 shrink-0">Row #{rIdx + 1}:</span>
                      <div className="grid grid-cols-4 gap-1 flex-1">
                        {row.map((v, cIdx) => (
                          <span
                            key={cIdx}
                            className={`p-1 rounded text-center ${
                              rIdx === state.transformerKeys.length - 1
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'bg-slate-950 text-slate-300'
                            }`}
                          >
                            {v.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BDH Side */}
        <div className="bg-slate-950 p-4 rounded-xl border border-pink-900/40 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-pink-400" />
              Pathway BDH Synaptic Memory Write
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-800">
              Matrix Size: Fixed 4 x 4
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">
              {"Action: Adds outer-product k_t * v_t^T matrix to synaptic matrix W_t = λ * W_{t-1} + k_t * v_t^T."}
            </div>

            {/* Fixed 4x4 Synaptic Matrix Grid */}
            <div>
              <div className="text-[10px] font-mono text-pink-400 mb-1">
                {"Updated Fast-Weight Synaptic Matrix [W_t ∈ ℝ^(4×4)]:"}
              </div>
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900 rounded border border-slate-800">
                {state.bdhMatrix.map((row, r) =>
                  row.map((val, c) => {
                    const idx = r * 4 + c;
                    const isActive = state.activeSparseUnits.includes(idx);
                    return (
                      <div
                        key={`toy-w-${r}-${c}`}
                        className={`h-8 rounded flex items-center justify-center font-mono text-[10px] font-bold transition-all relative ${
                          isActive
                            ? 'bg-pink-600 text-white active-node-glow border border-pink-300'
                            : 'bg-slate-950 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {val.toFixed(2)}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-white">What just happened? </span>
          {state.explanation}
        </div>
      </div>
    </div>
  );
};
