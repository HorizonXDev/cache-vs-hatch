import React from 'react';
import { Network, Zap, ShieldCheck, Flame } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-4">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Pathway Dragon Hatchling (BDH)
              </h2>
              <p className="text-xs text-slate-400">Stores relationships in a fixed synaptic weight matrix</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-pink-950 text-pink-400 border border-pink-800/60">
            Scaling: O(1) Constant
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              {"Fixed Fast-Weight Matrix [W_t ∈ ℝ^(D×D)]"}
            </span>
            <span className="font-mono text-pink-400 text-[11px] font-bold">
              INVARIANT SIZE: {dimension} x {dimension}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
              <span>Hebbian Synaptic Strength heatmap (λ={decayLambda.toFixed(2)})</span>
              <span>N={sequenceLength} sequence tokens processed</span>
            </div>

            <div
              className="grid gap-1.5 justify-center p-2 bg-slate-900/60 rounded border border-slate-800/60"
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
                      className={`h-7 sm:h-8 rounded flex items-center justify-center font-mono text-[9px] font-bold transition-all relative group cursor-pointer ${
                        isActiveUnit
                          ? 'border border-pink-400 active-node-glow'
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

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Positive Weight
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Negative Weight
              </span>
              <span className="flex items-center gap-1 text-pink-300 font-semibold">
                <Zap className="w-3 h-3 text-pink-400" /> Glowing = Active Unit (~5%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            Sparse Non-Negative Activation Renderer (~5% Target)
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-800/50">
            Active: {activeCount} / {totalUnits} ({activeRatio}%)
          </span>
        </div>

        <div className="p-3 rounded bg-slate-900 border border-slate-800/60 space-y-2">
          <div className="text-[11px] text-slate-400">
            Token #{selectedIndex + 1} Non-Negative Firing State (ReLU(k_t - θ)):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bdhState.sparseActivations[selectedIndex]?.map((act, idx) => (
              <div
                key={`act-${idx}`}
                className={`px-2 py-1 rounded font-mono text-[10px] flex items-center gap-1 ${
                  act > 0
                    ? 'bg-pink-900/60 text-pink-200 border border-pink-500/50 font-bold'
                    : 'bg-slate-950 text-slate-600 border border-slate-800'
                }`}
              >
                <span>U_{idx}</span>
                <span>{act.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/60 font-mono">
            <div className="text-slate-500 text-[10px]">State Matrix Footprint</div>
            <div className="text-pink-400 font-bold text-sm mt-0.5">{formatBytes(toyBDHVRAM)}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/60 font-mono">
            <div className="text-slate-500 text-[10px]">Growth with Length N</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5">0 Bytes (Constant O(1))</div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2 text-xs text-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300">Bounded O(1) Memory Footprint: </span>
          BDH maintains a strictly fixed state size regardless of sequence length (N=1,000 or N=10,000,000), entirely eliminating KV cache memory blowup!
        </div>
      </div>
    </div>
  );
};
