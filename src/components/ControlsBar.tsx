import React, { useState } from 'react';
import { RefreshCw, Sliders, Zap, Flame, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsBarProps {
  sequenceLength: number;
  setSequenceLength: (n: number) => void;
  decayLambda: number;
  setDecayLambda: (l: number) => void;
  dimension: number;
  setDimension: (d: number) => void;
  onRegenerate: () => void;
  onApplyPreset: (n: number, l: number, d: number) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  sequenceLength,
  setSequenceLength,
  decayLambda,
  setDecayLambda,
  dimension,
  setDimension,
  onRegenerate,
  onApplyPreset,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleRegenerateClick = () => {
    setIsRotating(true);
    onRegenerate();
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 shrink-0">
              <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Simulation Controls</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Change the experiment — every number below recomputes live.
              </p>
            </div>
          </div>
        </div>

        {/* Sliders and Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-stretch">
          {/* Slider 1: Sequence Length (N) */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-sm gap-2">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <HardDrive className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                Sequence Length (N)
              </span>
              <span className="font-mono font-bold text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-sm shadow-sm shrink-0">
                N = {sequenceLength}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={sequenceLength}
              onChange={(e) => setSequenceLength(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-0.5">
              <span>5 tokens</span>
              <span>50 tokens</span>
              <span>100 tokens</span>
            </div>
          </div>

          {/* Slider 2: BDH Synaptic Decay Rate (Lambda) */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 hover:border-pink-500/30 transition-all space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-sm gap-2">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Flame className="w-4.5 h-4.5 text-pink-400 shrink-0" />
                Synaptic Decay (λ)
              </span>
              <span className="font-mono font-bold text-pink-300 px-2.5 py-1 rounded-lg bg-pink-950/80 border border-pink-500/30 text-sm shadow-sm shrink-0">
                λ = {decayLambda.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.0}
              step={0.01}
              value={decayLambda}
              onChange={(e) => setDecayLambda(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400 transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-0.5">
              <span>0.80 (Fast)</span>
              <span>0.90</span>
              <span>1.00 (Infinite)</span>
            </div>
          </div>

          {/* Selector: Vector Dimension (D) */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 hover:border-purple-500/30 transition-all space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-sm gap-2">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                Vector Dimension (D)
              </span>
              <span className="font-mono font-bold text-purple-300 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 text-sm shadow-sm shrink-0">
                D = {dimension}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-0.5 flex-1 content-center">
              {[4, 8, 16].map((d) => (
                <button
                  key={d}
                  onClick={() => setDimension(d)}
                  className={`py-2.5 rounded-xl text-sm font-mono font-medium transition-all ${
                    dimension === d
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40 font-bold'
                      : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {d}×{d}
                </button>
              ))}
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegenerateClick}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-600/25 transition-all"
            >
              <RefreshCw className={`w-5 h-5 transition-transform duration-500 ${isRotating ? 'rotate-[360deg]' : ''}`} />
              <span>Regenerate Random Vectors</span>
            </motion.button>
          </div>
        </div>

        {/* Preset Scenarios Bar */}
        <div className="flex flex-wrap items-center gap-2.5 text-sm pt-5 border-t border-slate-800/80">
          <span className="text-slate-300 font-semibold flex items-center gap-2 mr-1">
            <Zap className="w-4.5 h-4.5 text-yellow-400" /> Preset Scenarios:
          </span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(20, 0.95, 8)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            Default Benchmark (N=20, λ=0.95, D=8)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(100, 0.95, 8)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            Memory Bottleneck (N=100, λ=0.95)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(30, 0.82, 8)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            High Interference (λ=0.82)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(20, 0.96, 16)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            High Dimension (D=16)
          </motion.button>
        </div>
      </div>
    </div>
  );
};
