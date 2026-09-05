import React from 'react';
import { Scale, GitCompareArrows, HardDrive, Zap, Activity, AlertTriangle } from 'lucide-react';
import type { TransformerState, BDHState, RetrievalResult } from '../types/simulation';
import { formatBytes } from '../utils/mathEngine';

interface VictoryDashboardProps {
  sequenceLength: number;
  dimension: number;
  decayLambda: number;
  selectedIndex: number;
  transformerState: TransformerState;
  bdhState: BDHState;
  retrievalResult: RetrievalResult;
}

export const VictoryDashboard: React.FC<VictoryDashboardProps> = ({
  sequenceLength,
  dimension,
  decayLambda,
  selectedIndex,
  transformerState,
  bdhState,
  retrievalResult,
}) => {
  const N = sequenceLength;
  const D = dimension;

  // --- Memory footprint, computed live from THIS toy's own state ---------------
  // Stored floats: the KV cache keeps an N×D key matrix + N×D value matrix;
  // BDH keeps a single D×D weight matrix. 2 bytes/float (fp16) — the same
  // convention used by the simulator panels (PanelBDH: toyBDHVRAM = D×D×2).
  const kvFloats = transformerState.keys.length * D * 2; // K and V matrices
  const bdhFloats = bdhState.weightMatrix.length * (bdhState.weightMatrix[0]?.length ?? 0); // W matrix only
  const kvBytes = kvFloats * 2;
  const bdhBytes = bdhFloats * 2;
  const savingsPct = kvBytes > 0 ? ((kvBytes - bdhBytes) / kvBytes) * 100 : 0;

  // --- Per-token read cost: operation counts from the toy's own shapes --------
  // BDH read  = one D×D matrix-vector product (W·q).
  // KV read   = N attention scores (each a length-D dot product) + a length-D
  //             softmax-weighted sum over the N stored values ≈ 2·N·D + N ops.
  // These are order-of-growth counts for the read step only — NOT wall-clock
  // throughput measurements (real Tok/s depends on hardware and kernels).
  const bdhReadOps = D * D;
  const kvReadOps = 2 * N * D + N;

  // --- Live retrieval data (reused from queryModels, not recomputed here) ------
  const { queryToken, transformerAccuracy, bdhAccuracy, decayFactor, interferenceMagnitude } = retrievalResult;
  const age = N - 1 - selectedIndex;

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <GitCompareArrows className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ARCHITECTURAL TRADE-OFFS
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                computed live + cited — not a scoreboard
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              Head-to-Head: What Each Approach Costs
            </h2>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 shrink-0 flex-wrap">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>
            Live toy config: N={N} · D={D} · λ={decayLambda.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 4 Head-to-Head Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Memory Footprint (computed live) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-800/60 transition-all space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-cyan-300">
              COMPUTED LIVE (THIS TOY)
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">GPU Memory Footprint</h3>
            <p className="text-xs text-slate-400 mt-0.5">Fixed D×D state vs N×D tables</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-pink-300 font-semibold">
              <span>BDH (W):</span>
              <span>
                {formatBytes(bdhBytes)} · O(1) fixed
              </span>
            </div>
            <div className="flex items-center justify-between text-cyan-300 font-semibold">
              <span>KV cache (K,V):</span>
              <span>
                {formatBytes(kvBytes)} at N={N}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
              KV state grows linearly; BDH's never changes with N. At this N the KV
              side stores {kvFloats.toLocaleString()} floats vs {bdhFloats.toLocaleString()} for BDH (
              {savingsPct.toFixed(1)}% less state by this byte model).
            </div>
          </div>
        </div>

        {/* Card 2: Per-Token Read Cost (computed live) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-800/60 transition-all space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-cyan-300">
              OPS, NOT BENCHMARKED
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">Per-Token Retrieval Cost</h3>
            <p className="text-xs text-slate-400 mt-0.5">One W·q product vs softmax over every key</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-pink-300 font-semibold">
              <span>BDH read:</span>
              <span>
                {D}² = {bdhReadOps.toLocaleString()} ops
              </span>
            </div>
            <div className="flex items-center justify-between text-cyan-300 font-semibold">
              <span>KV read:</span>
              <span>
                ≈ {kvReadOps.toLocaleString()} ops
              </span>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
              Order-of-growth for one read step ({bdhReadOps.toLocaleString()} vs ≈{' '}
              {kvReadOps.toLocaleString()} mult-adds at N={N}, D={D}). The KV read cost
              grows with N; BDH's does not. No real-hardware speeds are measured or claimed.
            </div>
          </div>
        </div>

        {/* Card 3: Sparse Activations (cited from Pathway — not measured here) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-800/60 transition-all space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              CITED: PATHWAY (2025)
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">Sparse, Positive Activations</h3>
            <p className="text-xs text-slate-400 mt-0.5">A real-BDH property we do not reproduce at scale</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[10px] leading-relaxed text-slate-400">
            <p>
              Reported by Pathway in their BDH paper: &ldquo;Activation vectors of BDH are sparse
              and positive,&rdquo; and BDH &ldquo;admits a GPU-friendly formulation.&rdquo; These
              properties are argued to support interpretability, not measured in this toy.
            </p>
            <p className="text-purple-300 font-mono">
              Source:{' '}
              <a
                href="https://arxiv.org/abs/2509.26507"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-purple-200"
              >
                arXiv:2509.26507 ↗
              </a>{' '}
              ·{' '}
              <a
                href="https://github.com/pathwaycom/bdh"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-purple-200"
              >
                pathwaycom/bdh ↗
              </a>
            </p>
            <p className="text-slate-500">
              Our toy panels render a stylized ~5% active slice for illustration; that slice is
              our own simplification, not a claim about real BDH's sparsity rate.
            </p>
          </div>
        </div>

        {/* Card 4: Honest Trade-off — Interference & Forgetting (live) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-700/50 hover:border-amber-500/80 transition-all space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800/60">
              LIMITATION — PRICE OF O(1)
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm">The Honest Trade-off: Interference</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Querying token #{selectedIndex + 1} &ldquo;{queryToken.label}&rdquo; {queryToken.emoji} · age {age}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-cyan-300">KV cache recall (any age):</span>
                <span className="text-cyan-300 font-bold">{transformerAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-400" style={{ width: `${transformerAccuracy}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-amber-300">BDH recall at age {age}:</span>
                <span className="text-amber-300 font-bold">{bdhAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500" style={{ width: `${Math.max(3, bdhAccuracy)}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] pt-1">
              <span className="text-slate-500">Signal remaining (λ^age):</span>
              <span className="text-slate-300 font-bold">{(decayFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">Cross-talk interference:</span>
              <span className="text-slate-300 font-bold">{interferenceMagnitude.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans pt-1">
              BDH's single D×D matrix must hold every write: older traces decay by λ each step and
              can be overwritten by newer outer-product writes, so old tokens get progressively
              harder to retrieve as N grows. The KV cache never forgets — it simply grows O(N).
              Click an older token in the Test Bench to watch BDH recall drop.
            </p>
          </div>
        </div>
      </div>

      {/* Sources & Method Footnote */}
      <div className="border-t border-slate-800 pt-3 space-y-1 text-[11px] leading-relaxed text-slate-400 font-mono">
        <p>
          <span className="text-slate-300 font-bold">Sources &amp; method: </span>
          memory, read-cost and recall numbers above are computed live from this toy's own state
          (seeded random vectors, N={N}, D={D}, λ={decayLambda.toFixed(2)}) using the same 2 bytes/float
          convention as the simulator panels — they are not GPU benchmark measurements. Statements
          labeled &ldquo;reported by Pathway&rdquo; cite the BDH paper: A. Kosowski et al.,{' '}
          <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em>,{' '}
          <a
            href="https://arxiv.org/abs/2509.26507"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-cyan-300 hover:text-cyan-200"
          >
            arXiv:2509.26507
          </a>{' '}
          (2025), and the official code repository{' '}
          <a
            href="https://github.com/pathwaycom/bdh"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-cyan-300 hover:text-cyan-200"
          >
            github.com/pathwaycom/bdh
          </a>
          . This dashboard reports trade-offs on each axis rather than declaring a winner.
        </p>
      </div>
    </div>
  );
};
