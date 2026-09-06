import React from 'react';
import { Target, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SimulationToken, RetrievalResult } from '../types/simulation';

interface TestBenchProps {
  tokens: SimulationToken[];
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  result: RetrievalResult;
  decayLambda: number;
}

export const TestBench: React.FC<TestBenchProps> = ({
  tokens,
  selectedIndex,
  setSelectedIndex,
  result,
}) => {
  const { queryToken, targetValue, transformerOutput, transformerAccuracy, bdhOutput, bdhAccuracy, decayFactor, interferenceMagnitude } = result;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              Interactive Test Bench (Ground Truth vs. Model Estimate)
            </h2>
            <p className="text-xs text-slate-400">
              Select any historical token to query both models and compare key-value recall accuracy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Active Query: Token #{selectedIndex + 1} ({queryToken.label})</span>
        </div>
      </div>

      {/* Historical Tokens Carousel / Grid */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="font-semibold flex items-center gap-2">
            <span>Historical Sequence Tokens</span>
            <span className="text-slate-400 font-mono">({tokens.length} total)</span>
          </span>
          <span className="text-[11px] text-slate-400">Click a token to test key retrieval:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {tokens.map((token, idx) => {
            const isSelected = idx === selectedIndex;
            const age = tokens.length - 1 - idx;
            return (
              <motion.button
                key={token.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(idx)}
                className={`shrink-0 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950 to-slate-950 text-white border-cyan-400 shadow-lg shadow-cyan-950/60 scale-105 ring-2 ring-cyan-500/40'
                    : 'bg-slate-950/80 hover:bg-slate-800/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span className="text-lg">{token.emoji}</span>
                <span className="font-semibold text-xs whitespace-nowrap">{token.label}</span>
                <span className="text-[9px] font-mono text-slate-400">
                  #{idx + 1} {age === 0 ? '(Latest)' : `(${age} back)`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Side-By-Side Comparison Grid: Truth Beside Estimate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Ground Truth Target Vector */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-3.5 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              {"Ground Truth Target [v_target]"}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              100% Exact
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">Target Value Vector for {queryToken.label}:</div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
              {targetValue.map((v, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-slate-200 font-semibold shadow-inner">
                  {v.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80 leading-relaxed font-sans">
            Pristine ground truth value vector stored when key <span className="font-mono text-cyan-300">{queryToken.label}</span> was generated.
          </div>
        </motion.div>

        {/* Card 2: Transformer Retrieved Output */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-cyan-900/40 space-y-3.5 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Transformer KV Cache Recall
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Recall: {transformerAccuracy.toFixed(1)}%
            </span>
          </div>

          {/* Accuracy Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Recall Accuracy</span>
              <span className="text-cyan-300 font-bold">{transformerAccuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${transformerAccuracy}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">{"Retrieved Output Vector [v_Trans]:"}</div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
              {transformerOutput.map((v, i) => (
                <div key={i} className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-900/60 text-center text-cyan-200 font-semibold shadow-inner">
                  {v.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80 leading-relaxed font-sans text-cyan-300">
            Perfect recall because all keys/values remain stored uncompressed in O(N) RAM.
          </div>
        </motion.div>

        {/* Card 3: BDH Retrieved Output */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-pink-900/40 space-y-3.5 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-pink-400" />
              Pathway BDH Synaptic Recall
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-500/30">
              Recall: {bdhAccuracy.toFixed(1)}%
            </span>
          </div>

          {/* Accuracy Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Recall Accuracy</span>
              <span className="text-pink-300 font-bold">{bdhAccuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, bdhAccuracy)}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-pink-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">{"Retrieved Output Vector [v_BDH = W · q]:"}</div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
              {bdhOutput.map((v, i) => (
                <div key={i} className="p-2 rounded-lg bg-pink-950/40 border border-pink-900/60 text-center text-pink-200 font-semibold shadow-inner">
                  {v.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          {/* Theoretical Breakdown */}
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Decay Factor (λ^age):</span>
              <span className="text-pink-300 font-bold">{(decayFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Interference:</span>
              <span className="text-amber-300 font-bold">{interferenceMagnitude.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

