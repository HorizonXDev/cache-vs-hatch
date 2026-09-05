import React, { useState } from 'react';
import { Flame, AlertOctagon, CheckCircle2, Gauge, HardDrive, Sparkles } from 'lucide-react';
import { formatBytes } from '../utils/mathEngine';

export const StressSimulator: React.FC = () => {
  const [scaleN, setScaleN] = useState<number>(100000); // Default 100K tokens

  // Standard LLM parameters (e.g. Llama 3 70B: 80 layers, 64 heads, dim=128, FP16)
  const layers = 80;
  const heads = 64;
  const dim = 128;
  const bytesPerElem = 2; // FP16

  // Transformer VRAM calculation: 2 * L * H * D * N * Bytes
  const transVRAMBytes = 2 * layers * heads * dim * scaleN * bytesPerElem;
  const isOverflow = transVRAMBytes > 80 * 1024 * 1024 * 1024; // > 80 GB GPU VRAM (e.g. A100 GPU limit)

  // BDH VRAM calculation: Fixed D x D fast-weight matrix size per layer (~50 MB total fixed)
  const bdhVRAMBytes = layers * dim * dim * bytesPerElem + 1024 * 1024 * 40; // ~50 MB fixed

  // Decoding Speed Calculation (Tokens/Sec)
  // Transformer speed decreases inversely with N: O(N) attention penalty
  const transSpeed = Math.max(1, Math.round(250 / (1 + scaleN / 15000)));
  // BDH speed is constant O(1): flat 250 tok/sec
  const bdhSpeed = 250;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-flame-500/10 text-pink-400 border border-pink-500/30">
            <Flame className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Infinite Scale & VRAM Stress Simulator ($N = 1,000 \dots 1,000,000$)
            </h2>
            <p className="text-xs text-slate-400">
              Drag the sequence length slider to see Transformer KV Cache crash while BDH remains flat!
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded font-mono text-xs font-bold bg-pink-950 text-pink-300 border border-pink-800">
          Stress Level: {(scaleN / 1000).toFixed(0)}K Tokens
        </span>
      </div>

      {/* Slider Control */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            Simulated Sequence Length ($N$ Tokens)
          </span>
          <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded border border-cyan-800">
            N = {scaleN.toLocaleString()} Tokens
          </span>
        </div>

        <input
          type="range"
          min={1000}
          max={1000000}
          step={5000}
          value={scaleN}
          onChange={(e) => setScaleN(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>1,000 (Short)</span>
          <span>100,000 (Medium)</span>
          <span>500,000 (Long)</span>
          <span>1,000,000 (Ultra-Stream)</span>
        </div>
      </div>

      {/* Live VRAM Footprint & Speed Comparison Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A: Transformer KV Cache Status */}
        <div className={`p-4 rounded-xl border transition-all space-y-3 ${
          isOverflow
            ? 'bg-red-950/40 border-red-500/80 shadow-lg shadow-red-950/50'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200">Standard Transformer (KV Cache)</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isOverflow
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {isOverflow ? '💥 GPU VRAM OVERFLOW!' : 'Scaling O(N)'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Required VRAM:</span>
              <span className={`font-bold ${isOverflow ? 'text-red-400 text-sm' : 'text-cyan-400'}`}>
                {formatBytes(transVRAMBytes)}
              </span>
            </div>

            {/* VRAM Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverflow ? 'bg-red-500' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, (transVRAMBytes / (100 * 1024 * 1024 * 1024)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono pt-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-500" /> Decode Speed:
            </span>
            <span className="text-amber-400 font-bold">{transSpeed} Tokens/sec</span>
          </div>

          {isOverflow && (
            <div className="p-2.5 rounded bg-red-950/80 border border-red-600 text-red-200 text-xs flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>GPU out-of-memory crash! Standard KV Cache exceeds 80GB VRAM limit.</span>
            </div>
          )}
        </div>

        {/* Card B: Pathway BDH Status (WINNER) */}
        <div className="p-4 rounded-xl border border-emerald-500/60 bg-slate-950 space-y-3 shadow-lg shadow-emerald-950/30">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pathway Dragon Hatchling (BDH)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
              🟢 WINNER: FIXED O(1)
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Required VRAM:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {formatBytes(bdhVRAMBytes)} (Constant!)
              </span>
            </div>

            {/* BDH Flat VRAM Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-400 w-[5%] transition-all duration-300" />
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono pt-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Decode Speed:
            </span>
            <span className="text-emerald-400 font-bold">{bdhSpeed} Tokens/sec (Flat O(1))</span>
          </div>

          <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>BDH uses 99.9% less VRAM and decodes at lightning-fast constant speed!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
