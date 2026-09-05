import React from 'react';
import { RefreshCw, Sliders, Zap, Flame, HardDrive } from 'lucide-react';

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
  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Sliders and Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Slider 1: Sequence Length (N) */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                Sequence Length (N)
              </span>
              <span className="font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
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
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 tokens</span>
              <span>50 tokens</span>
              <span>100 tokens</span>
            </div>
          </div>

          {/* Slider 2: BDH Synaptic Decay Rate (Lambda) */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                Synaptic Decay (λ)
              </span>
              <span className="font-mono font-bold text-pink-400 px-2 py-0.5 rounded bg-pink-950/60 border border-pink-800/40">
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
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.80 (Fast)</span>
              <span>0.90</span>
              <span>1.00 (Infinite)</span>
            </div>
          </div>

          {/* Selector: Vector Dimension (D) */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Vector Dimension (D)
              </span>
              <span className="font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                D = {dimension}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {[4, 8, 16].map((d) => (
                <button
                  key={d}
                  onClick={() => setDimension(d)}
                  className={`py-1 rounded text-xs font-mono font-medium transition-all ${
                    dimension === d
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {d} x {d}
                </button>
              ))}
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="flex items-center gap-2 h-full pt-1">
            <button
              onClick={onRegenerate}
              className="w-full py-3.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4 animate-spin-once" />
              <span>Regenerate Random Vectors</span>
            </button>
          </div>
        </div>

        {/* Preset Scenarios Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-800/60">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Preset Scenarios:
          </span>
          <button
            onClick={() => onApplyPreset(20, 0.95, 8)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Default Benchmark (N=20, λ=0.95, D=8)
          </button>
          <button
            onClick={() => onApplyPreset(100, 0.95, 8)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Memory Bottleneck (N=100, λ=0.95)
          </button>
          <button
            onClick={() => onApplyPreset(30, 0.82, 8)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            High Interference (λ=0.82)
          </button>
          <button
            onClick={() => onApplyPreset(20, 0.96, 16)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            High Dimension (D=16)
          </button>
        </div>
      </div>
    </div>
  );
};
