import React from 'react';
import { Scale, GitCompareArrows, HardDrive, Zap, Activity, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const kvFloats = transformerState.keys.length * D * 2; // K and V matrices
  const bdhFloats = bdhState.weightMatrix.length * (bdhState.weightMatrix[0]?.length ?? 0); // W matrix only
  const kvBytes = kvFloats * 2;
  const bdhBytes = bdhFloats * 2;
  const savingsPct = kvBytes > 0 ? ((kvBytes - bdhBytes) / kvBytes) * 100 : 0;

  const bdhReadOps = D * D;
  const kvReadOps = 2 * N * D + N;

  const { queryToken, transformerAccuracy, bdhAccuracy, decayFactor, interferenceMagnitude } = retrievalResult;
  const age = N - 1 - selectedIndex;

  return (
    <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-7 backdrop-blur-sm">
      {/* Dashboard Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 shrink-0">
            <GitCompareArrows className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ARCHITECTURAL TRADE-OFFS
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                computed live + cited — not a scoreboard
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1.5">
              Head-to-Head: What Each Approach Costs
            </h2>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-sm font-mono flex items-center gap-2 shrink-0 self-start lg:self-center shadow-inner">
          <Scale className="w-4.5 h-4.5 text-cyan-400" />
          <span>
            Live config: <span className="text-cyan-300 font-bold">N={N}</span> · <span className="text-purple-300 font-bold">D={D}</span> · <span className="text-pink-300 font-bold">λ={decayLambda.toFixed(2)}</span>
          </span>
        </div>
      </div>

      {/* 4 Head-to-Head Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Memory Footprint (computed live) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <HardDrive className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-slate-900 text-cyan-300 border border-cyan-500/20">
              COMPUTED LIVE
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">GPU Memory Footprint</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Fixed D×D state vs N×D tables</p>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800/80 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-pink-300 font-semibold bg-pink-950/20 px-3 py-2 rounded-xl border border-pink-500/20">
              <span>BDH (W):</span>
              <span>{formatBytes(bdhBytes)} (O(1))</span>
            </div>
            <div className="flex items-center justify-between text-cyan-300 font-semibold bg-cyan-950/20 px-3 py-2 rounded-xl border border-cyan-500/20">
              <span>KV cache (K,V):</span>
              <span>{formatBytes(kvBytes)} (N={N})</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pt-1.5 font-sans">
              KV state grows linearly; BDH's never changes with N. At N={N}, KV stores <span className="font-mono text-cyan-300">{kvFloats.toLocaleString()}</span> floats vs <span className="font-mono text-pink-300">{bdhFloats.toLocaleString()}</span> for BDH (<span className="font-mono text-emerald-400 font-bold">{savingsPct.toFixed(1)}%</span> less state).
            </div>
          </div>
        </motion.div>

        {/* Card 2: Per-Token Read Cost (computed live) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-slate-900 text-cyan-300 border border-cyan-500/20">
              OPS MODEL
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">Per-Token Retrieval Cost</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">One W·q product vs softmax over every key</p>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800/80 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-pink-300 font-semibold bg-pink-950/20 px-3 py-2 rounded-xl border border-pink-500/20">
              <span>BDH read:</span>
              <span>{D}² = {bdhReadOps.toLocaleString()} ops</span>
            </div>
            <div className="flex items-center justify-between text-cyan-300 font-semibold bg-cyan-950/20 px-3 py-2 rounded-xl border border-cyan-500/20">
              <span>KV read:</span>
              <span>≈ {kvReadOps.toLocaleString()} ops</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pt-1.5 font-sans">
              Order-of-growth for one read step ({bdhReadOps.toLocaleString()} vs ≈{' '}
              {kvReadOps.toLocaleString()} mult-adds at N={N}, D={D}). KV read cost grows with N; BDH's does not.
            </div>
          </div>
        </motion.div>

        {/* Card 3: Sparse Activations (cited from Pathway) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-purple-950/80 text-purple-300 border border-purple-500/30">
              CITED PAPER
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">Sparse, Positive Activations</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Real BDH property from Pathway paper</p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-400">
            <p>
              Reported by Pathway in their BDH paper: &ldquo;Activation vectors of BDH are sparse
              and positive,&rdquo; and BDH &ldquo;admits a GPU-friendly formulation.&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1.5 font-mono">
              <a
                href="https://arxiv.org/abs/2509.26507"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 underline flex items-center gap-1"
              >
                <span>arXiv:2509.26507</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span>·</span>
              <a
                href="https://github.com/pathwaycom/bdh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 underline flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Honest Trade-off — Interference & Forgetting (live) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-amber-800/40 hover:border-amber-500/60 transition-all space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800/60">
              O(1) TRADE-OFF
            </span>
          </div>

          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">Interference &amp; Memory Decay</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Query token #{selectedIndex + 1} &ldquo;{queryToken.label}&rdquo; {queryToken.emoji} (age {age})
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs sm:text-sm font-mono">
            <div>
              <div className="flex justify-between text-[11px] sm:text-xs mb-1.5">
                <span className="text-cyan-300">KV cache recall:</span>
                <span className="text-cyan-300 font-bold">{transformerAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${transformerAccuracy}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-cyan-400"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] sm:text-xs mb-1.5">
                <span className="text-amber-300">BDH recall (age {age}):</span>
                <span className="text-amber-300 font-bold">{bdhAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(3, bdhAccuracy)}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-between text-[11px] sm:text-xs pt-1 text-slate-400">
              <span>Signal trace (λ<sup>age</sup>):</span>
              <span className="text-slate-200 font-bold">{(decayFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-[11px] sm:text-xs text-slate-400">
              <span>Interference mag:</span>
              <span className="text-slate-200 font-bold">{interferenceMagnitude.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sources & Method Footnote */}
      <div className="border-t border-slate-800/80 pt-4 space-y-1 text-xs leading-relaxed text-slate-400 font-mono">
        <p>
          <span className="text-slate-300 font-bold">Sources &amp; method: </span>
          memory, read-cost and recall numbers above are computed live from this toy's own state
          (seeded random vectors, N={N}, D={D}, λ={decayLambda.toFixed(2)}). Statements
          labeled &ldquo;reported by Pathway&rdquo; cite the BDH paper: A. Kosowski et al.,{' '}
          <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em> (2025).
        </p>
      </div>
    </div>
  );
};
