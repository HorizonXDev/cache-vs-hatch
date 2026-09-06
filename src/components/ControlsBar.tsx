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
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Sliders and Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Slider 1: Sequence Length (N) */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                Sequence Length (N)
              </span>
              <span className="font-mono font-bold text-cyan-300 px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-xs shadow-sm">
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 tokens</span>
              <span>50 tokens</span>
              <span>100 tokens</span>
            </div>
          </div>

          {/* Slider 2: BDH Synaptic Decay Rate (Lambda) */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 hover:border-pink-500/30 transition-all space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-pink-400" />
                Synaptic Decay (λ)
              </span>
              <span className="font-mono font-bold text-pink-300 px-2.5 py-0.5 rounded-md bg-pink-950/80 border border-pink-500/30 text-xs shadow-sm">
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.80 (Fast)</span>
              <span>0.90</span>
              <span>1.00 (Infinite)</span>
            </div>
          </div>

          {/* Selector: Vector Dimension (D) */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 hover:border-purple-500/30 transition-all space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-400" />
                Vector Dimension (D)
              </span>
              <span className="font-mono font-bold text-purple-300 px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-xs shadow-sm">
                D = {dimension}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {[4, 8, 16].map((d) => (
                <button
                  key={d}
                  onClick={() => setDimension(d)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
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
          <div className="flex items-center gap-2 h-full pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegenerateClick}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-600/25 transition-all"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isRotating ? 'rotate-[360deg]' : ''}`} />
              <span>Regenerate Random Vectors</span>
            </motion.button>
          </div>
        </div>

        {/* Preset Scenarios Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-2 border-t border-slate-800/80">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
            <Zap className="w-4 h-4 text-yellow-400" /> Preset Scenarios:
          </span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(20, 0.95, 8)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            Default Benchmark (N=20, λ=0.95, D=8)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(100, 0.95, 8)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            Memory Bottleneck (N=100, λ=0.95)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(30, 0.82, 8)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            High Interference (λ=0.82)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApplyPreset(20, 0.96, 16)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium transition-all shadow-sm"
          >
            High Dimension (D=16)
          </motion.button>
        </div>
      </div>
    </div>
  );
};

