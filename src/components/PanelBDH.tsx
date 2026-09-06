import React from 'react';
import { Zap, ShieldCheck, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BDHState } from '../types/simulation';
import { formatBytes } from '../utils/mathEngine';

interface PanelBDHProps {
  bdhState: BDHState;
  sequenceLength: number;
  decayLambda: number;
  dimension: number;
  selectedIndex: number;
}

export const PanelBDH: React.FC<PanelBDHProps> = ({
  bdhState,
  sequenceLength,
  decayLambda,
  dimension,
  selectedIndex,
}) => {
  let maxWeight = 0.0001;
  bdhState.weightMatrix.forEach((row) => {
    row.forEach((val) => {
      if (Math.abs(val) > maxWeight) maxWeight = Math.abs(val);
    });
  });

  const toyBDHVRAM = dimension * dimension * 2;
  const activeCount = bdhState.activeNodeIndices.length;
  const totalUnits = dimension * dimension;
  const activeRatio = ((activeCount / totalUnits) * 100).toFixed(1);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl space-y-6 backdrop-blur-sm"
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Pathway Dragon Hatchling (BDH)
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30">
                  ARCHITECTURAL WINNER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Stores relationships in a fixed synaptic weight matrix</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm">
            Scaling: O(1) Constant
          </span>
        </div>

        {/* Winner Highlights Banner */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 text-[11px] sm:text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-center font-semibold shadow-sm">
            🟢 99.9% VRAM Savings
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-center font-semibold shadow-sm">
            ⚡ Constant O(1) Speed
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-center font-semibold shadow-sm">
            ♾️ Infinite Streaming
          </div>
        </div>

        {/* Fixed Synaptic Matrix Grid Visualizer */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-pink-400" />
              Fixed Fast-Weight Matrix [W<sub>t</sub> ∈ ℝ<sup>D×D</sup>]
            </span>
            <span className="font-mono text-pink-300 text-xs font-bold bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/30">
              INVARIANT SIZE: {dimension}×{dimension}
            </span>
          </div>

          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90 space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Hebbian Synaptic Strength heatmap (λ={decayLambda.toFixed(2)})</span>
              <span>N={sequenceLength} sequence tokens processed</span>
            </div>

            <div
              className="grid gap-1.5 justify-center p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80"
              style={{ gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))` }}
            >
              {bdhState.weightMatrix.map((row, r) =>
                row.map((val, c) => {
                  const unitIndex = r * dimension + c;
                  const isActiveUnit = bdhState.activeNodeIndices.includes(unitIndex);
                  const intensity = Math.min(1, Math.abs(val) / maxWeight);

                  return (
                    <div
                      key={`w-${r}-${c}`}
                      className={`h-7 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[9px] font-bold transition-all relative group cursor-pointer ${
                        isActiveUnit
                          ? 'border border-pink-400 active-node-glow scale-105'
                          : 'border border-slate-800'
                      }`}
                      style={{
                        backgroundColor: val >= 0
                          ? `rgba(236, 72, 153, ${0.15 + intensity * 0.75})`
                          : `rgba(59, 130, 246, ${0.15 + intensity * 0.75})`,
                        color: intensity > 0.4 ? '#ffffff' : '#94a3b8',
                      }}
                    >
                      {val.toFixed(2)}
                      {isActiveUnit && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Positive Weight
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Negative Weight
              </span>
              <span className="flex items-center gap-1.5 text-pink-300 font-semibold">
                <Zap className="w-3.5 h-3.5 text-pink-400" /> Active Unit (~5%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90 space-y-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-pink-400" />
            Sparse Non-Negative Activation Renderer (~5% Target)
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-500/30">
            Active: {activeCount} / {totalUnits} ({activeRatio}%)
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="text-[11px] text-slate-400">
            Token #{selectedIndex + 1} Non-Negative Firing State (ReLU(k<sub>t</sub> − θ)):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bdhState.sparseActivations[selectedIndex]?.map((act, idx) => (
              <div
                key={`act-${idx}`}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1.5 ${
                  act > 0
                    ? 'bg-pink-900/60 text-pink-200 border border-pink-500/50 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                <span>U_{idx}</span>
                <span>{act.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono">
            <div className="text-slate-500 text-[11px]">State Matrix Footprint</div>
            <div className="text-pink-300 font-bold text-sm mt-0.5">{formatBytes(toyBDHVRAM)}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono">
            <div className="text-slate-500 text-[11px]">Growth with Length N</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5">0 Bytes (Constant O(1))</div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-3 text-[13px] leading-relaxed text-emerald-200 shadow-md">
        <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300">Bounded O(1) Memory Footprint: </span>
          BDH maintains a strictly fixed state size regardless of sequence length (N=1,000 or N=10,000,000), entirely eliminating KV cache memory blowup!
        </div>
      </div>
    </motion.div>
  );
};

