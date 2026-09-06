import React, { useState } from 'react';
import { Flame, AlertOctagon, CheckCircle2, Gauge, HardDrive, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const isOverflow = transVRAMBytes > 80 * 1024 * 1024 * 1024; // > 80 GB GPU VRAM

  // BDH VRAM calculation: Fixed D x D fast-weight matrix size per layer (~50 MB total fixed)
  const bdhVRAMBytes = layers * dim * dim * bytesPerElem + 1024 * 1024 * 40; // ~50 MB fixed

  // Decoding Speed Calculation (Tokens/Sec)
  const transSpeed = Math.max(1, Math.round(250 / (1 + scaleN / 15000)));
  const bdhSpeed = 250;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3.5 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/30 shadow-md shadow-pink-500/10">
            <Flame className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              Extreme Context &amp; VRAM Stress Simulator (N = 1,000 … 1,000,000)
            </h2>
            <p className="text-xs text-slate-400">
              Drag the sequence length slider to observe Transformer KV Cache overflow while BDH remains flat!
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-pink-950/80 text-pink-300 border border-pink-500/40 shadow-sm">
          Stress Level: {(scaleN / 1000).toFixed(0)}K Tokens
        </span>
      </div>

      {/* Slider Control & Preset Quick Buttons */}
      <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-3.5 shadow-inner">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            Simulated Sequence Length (N Tokens)
          </span>
          <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/30 shadow-sm">
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
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex gap-2">
            {[1000, 50000, 200000, 500000, 1000000].map((val) => (
              <motion.button
                key={val}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setScaleN(val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  scaleN === val
                    ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {val >= 1000000 ? '1M' : `${val / 1000}K`}
              </motion.button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" /> Llama-3 70B FP16 Scale
          </div>
        </div>
      </div>

      {/* Live VRAM Footprint & Speed Comparison Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A: Transformer KV Cache Status */}
        <motion.div
          animate={{ scale: isOverflow ? [1, 1.01, 1] : 1 }}
          transition={{ repeat: isOverflow ? Infinity : 0, duration: 1.5 }}
          className={`p-5 rounded-2xl border transition-all space-y-3.5 shadow-xl ${
            isOverflow
              ? 'bg-gradient-to-b from-red-950/60 to-slate-950 border-red-500/80 shadow-red-950/50'
              : 'bg-slate-950/90 border-slate-800/90'
          }`}
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-slate-200">Standard Transformer (KV Cache)</span>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
              isOverflow
                ? 'bg-red-500 text-white animate-pulse shadow-sm shadow-red-500/50'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {isOverflow ? '💥 GPU VRAM OVERFLOW!' : 'Scaling O(N)'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Required VRAM:</span>
              <span className={`font-bold ${isOverflow ? 'text-red-400 text-sm' : 'text-cyan-300'}`}>
                {formatBytes(transVRAMBytes)}
              </span>
            </div>

            {/* VRAM Progress Bar */}
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (transVRAMBytes / (80 * 1024 * 1024 * 1024)) * 100)}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full ${
                  isOverflow ? 'bg-gradient-to-r from-red-600 to-rose-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono pt-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-slate-500" /> Decode Speed:
            </span>
            <span className="text-amber-400 font-bold">{transSpeed} Tokens/sec</span>
          </div>

          {isOverflow && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs flex items-center gap-2.5 shadow-md"
            >
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>GPU out-of-memory crash! Standard KV Cache exceeds 80GB VRAM limit.</span>
            </motion.div>
          )}
        </motion.div>

        {/* Card B: Pathway BDH Status (WINNER) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl border border-emerald-500/60 bg-gradient-to-b from-slate-950 to-emerald-950/20 space-y-3.5 shadow-xl shadow-emerald-950/20"
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pathway Dragon Hatchling (BDH)
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30">
              🟢 WINNER: FIXED O(1)
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Required VRAM:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {formatBytes(bdhVRAMBytes)} (Constant!)
              </span>
            </div>

            {/* BDH Flat VRAM Progress Bar */}
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[5%]" />
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono pt-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" /> Decode Speed:
            </span>
            <span className="text-emerald-400 font-bold">{bdhSpeed} Tokens/sec (Flat O(1))</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>BDH uses 99.9% less VRAM and decodes at constant speed regardless of context length!</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

