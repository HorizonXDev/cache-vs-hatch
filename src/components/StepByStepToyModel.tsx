import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Sparkles, Brain, Cpu, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTokenSequence, computeToyModelStepHistory } from '../utils/mathEngine';

interface StepByStepToyModelProps {
  decayLambda: number;
}

export const StepByStepToyModel: React.FC<StepByStepToyModelProps> = ({ decayLambda }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [toySeed, setToySeed] = useState<number>(100);

  const toyDimension = 4;
  const toySequenceLength = 5;

  const toyTokens = useMemo(() => {
    return generateTokenSequence(toySequenceLength, toyDimension, toySeed);
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
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-7 backdrop-blur-sm">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800/80 pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive 5-Token Toy Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
              N=5 Tokens | D=4 Grid
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-2 flex items-center gap-2">
            Step-by-Step Memory Write Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Step through token by token to watch how memory matrices change in real time!
          </p>
        </div>

        {/* Step Controls Player */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 shadow-inner">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            title="Reset to Step 0"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentStep === 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.max(0, prev - 1));
            }}
            title="Previous Step"
            className="p-2 rounded-lg bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentStep >= toySequenceLength}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.min(toySequenceLength, prev + 1));
            }}
            title="Next Step"
            className="p-2 rounded-lg bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setToySeed((prev) => prev + 1)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-slate-700 shadow-sm"
          >
            New Vectors
          </motion.button>
        </div>
      </div>

      {/* Token Timeline Strip */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>Token Stream Step Player</span>
          <span className="font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
            Step {currentStep} of {toySequenceLength}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2.5">
          {/* Step 0: Initial */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
              currentStep === 0
                ? 'bg-slate-800 border-cyan-400 text-cyan-300 font-bold ring-2 ring-cyan-500/40 shadow-lg'
                : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-base">🟢</div>
            <div className="font-mono text-[10px]">Start</div>
          </motion.button>

          {/* Tokens 1..5 */}
          {toyTokens.map((token, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isProcessed = currentStep >= stepNum;
            return (
              <motion.button
                key={token.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(stepNum);
                }}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-950 to-slate-950 border-cyan-400 text-white font-bold scale-105 shadow-xl ring-2 ring-cyan-500/40'
                    : isProcessed
                    ? 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className="text-base">{token.emoji}</div>
                <div className="font-semibold text-[11px] truncate">{token.label}</div>
                <div className="text-[9px] font-mono text-slate-400">#{stepNum}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Token Vector Breakdown */}
      <AnimatePresence mode="wait">
        {state.currentToken && (
          <motion.div
            key={state.currentToken.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-3.5 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{state.currentToken.emoji}</span>
                <span className="font-extrabold text-slate-100 text-sm sm:text-base">
                  Incoming Token: "{state.currentToken.label}" (Step #{currentStep})
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                Vector Dimension D=4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
                <div className="text-cyan-400 font-bold mb-1.5">Key Vector k<sub>t</sub> (Query Matcher):</div>
                <div className="flex gap-2">
                  {state.keyVector.map((val, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                      {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
                <div className="text-purple-400 font-bold mb-1.5">Value Vector v<sub>t</sub> (Information Content):</div>
                <div className="flex gap-2">
                  {state.valueVector.map((val, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 font-bold">
                      {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Toy Model State Write Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transformer Side */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-cyan-900/40 space-y-3.5 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Standard Transformer KV Memory Write
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Rows Stored: {state.transformerKeys.length} / 5
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">
              Action: Appends Key & Value rows to the sequence table.
            </div>

            {/* Keys Table */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-cyan-400">
                Key Matrix [K] ({state.transformerKeys.length} rows):
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5 max-h-36 overflow-y-auto shadow-inner">
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
                            className={`p-1 rounded text-center transition-all ${
                              rIdx === state.transformerKeys.length - 1
                                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
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
        </motion.div>

        {/* BDH Side */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-pink-900/40 space-y-3.5 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-pink-400" />
              Pathway BDH Synaptic Memory Write
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-500/30">
              Matrix Size: Fixed 4×4
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">
              Action: Adds outer-product k<sub>t</sub>·v<sub>t</sub>ᵀ to W<sub>t</sub> = λ·W<sub>t−1</sub> + k<sub>t</sub>·v<sub>t</sub>ᵀ.
            </div>

            {/* Fixed 4x4 Synaptic Matrix Grid */}
            <div>
              <div className="text-[10px] font-mono text-pink-400 mb-1.5">
                Updated Fast-Weight Matrix [W<sub>t</sub> ∈ ℝ<sup>4×4</sup>]:
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
                {state.bdhMatrix.map((row, r) =>
                  row.map((val, c) => {
                    const idx = r * 4 + c;
                    const isActive = state.activeSparseUnits.includes(idx);
                    return (
                      <div
                        key={`toy-w-${r}-${c}`}
                        className={`h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-all relative ${
                          isActive
                            ? 'bg-pink-500 text-white active-node-glow border border-pink-300 scale-105'
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
        </motion.div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start gap-3 shadow-inner">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-white">What just happened? </span>
          {state.explanation}
        </div>
      </div>
    </div>
  );
};

