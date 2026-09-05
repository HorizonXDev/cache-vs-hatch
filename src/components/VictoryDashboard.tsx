import React from 'react';
import { Trophy, Zap, HardDrive, Infinity as InfinityIcon, Activity, CheckCircle2, XCircle } from 'lucide-react';

export const VictoryDashboard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PATHWAY BDH ADVANTAGE
              </span>
              <span className="text-xs text-slate-400 font-mono">Architectural Superiority Matrix</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              Why Dragon Hatchling (BDH) Outperforms KV Caching
            </h2>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>BDH: 4 out of 4 Performance Wins</span>
        </div>
      </div>

      {/* 4 Head-to-Head Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Victory Card 1: Memory Footprint */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 hover:border-emerald-500/80 transition-all space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500 text-slate-950">
              99.9% VRAM SAVINGS
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">GPU Memory Scaling</h3>
            <p className="text-xs text-slate-400 mt-0.5">Fixed state vs Endless expansion</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> BDH:
              </span>
              <span>O(1) Fixed (~50 MB)</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 line-through">
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> KV Cache:
              </span>
              <span className="text-red-400 font-semibold">O(N) (320 GB+ OOM)</span>
            </div>
          </div>
        </div>

        {/* Victory Card 2: Decoding Throughput */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 hover:border-emerald-500/80 transition-all space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500 text-slate-950">
              100x FASTER DECODE
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">Token Decoding Latency</h3>
            <p className="text-xs text-slate-400 mt-0.5">Constant time vs Attention slowdown</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> BDH:
              </span>
              <span>O(1) Flat 250 Tok/s</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 line-through">
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> KV Cache:
              </span>
              <span className="text-red-400 font-semibold">O(N) (Drops to 2 Tok/s)</span>
            </div>
          </div>
        </div>

        {/* Victory Card 3: Infinite Streaming */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 hover:border-emerald-500/80 transition-all space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500 text-white">
              N = INFINITY STREAM
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">Sequence Streaming</h3>
            <p className="text-xs text-slate-400 mt-0.5">Infinite stream vs Hard context cap</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> BDH:
              </span>
              <span>Infinite Streaming</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 line-through">
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> KV Cache:
              </span>
              <span className="text-red-400 font-semibold">Caps at 32K / 128K</span>
            </div>
          </div>
        </div>

        {/* Victory Card 4: Biological Sparsity */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 hover:border-emerald-500/80 transition-all space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-pink-500 text-white">
              95% COMPUTE SAVED
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">Biological Sparsity</h3>
            <p className="text-xs text-slate-400 mt-0.5">~5% active nodes vs 100% dense math</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-pink-300 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> BDH:
              </span>
              <span>~5% Active Units</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 line-through">
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> KV Cache:
              </span>
              <span className="text-red-400 font-semibold">100% Dense Math</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
