import React from 'react';
import { Target, CheckCircle, AlertCircle, Search } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Interactive Test Bench (Truth Beside Estimate)
            </h2>
            <p className="text-xs text-slate-400">
              Select any historical token to query both models and compare key-value recall accuracy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Query: Token #{selectedIndex + 1} ({queryToken.label})</span>
        </div>
      </div>

      {/* Historical Tokens Carousel / Grid */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="font-semibold flex items-center gap-1">
            <span>Historical Sequence Tokens</span>
            <span className="text-slate-500 font-mono">({tokens.length} total)</span>
          </span>
          <span className="text-[11px] text-slate-400">Click a token to test key retrieval:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {tokens.map((token, idx) => {
            const isSelected = idx === selectedIndex;
            const age = tokens.length - 1 - idx;
            return (
              <button
                key={token.id}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-cyan-950 text-white border-cyan-400 shadow-lg shadow-cyan-950/50 scale-105 ring-2 ring-cyan-500/30'
                    : 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-base">{token.emoji}</span>
                <span className="font-semibold text-[11px] whitespace-nowrap">{token.label}</span>
                <span className="text-[9px] font-mono text-slate-400">
                  #{idx + 1} {age === 0 ? '(Latest)' : `(${age} back)`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-By-Side Comparison Grid: Truth Beside Estimate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Ground Truth Target Vector */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {"Ground Truth Target [v_target]"}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              100% Exact
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400">Target Value Vector for {queryToken.label}:</div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
              {targetValue.map((v, i) => (
                <div key={i} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center text-slate-200">
                  {v.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 leading-relaxed">
            The pristine ground truth value vector stored when key <span className="font-mono text-cyan-300">{queryToken.label}</span> was generated.
          </div>
        </div>

        {/* Card 2: Transformer Retrieved Output */}
        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/40 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Transformer KV Cache Recall
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
              Recall: {transformerAccuracy.toFixed(1)}%
            </span>
          </div>

          {/* Accuracy Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Recall Accuracy Meter</span>
              <span className="text-cyan-400 font-bold">{transformerAccuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${transformerAccuracy}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400">{"Retrieved Output Vector [v_Trans]:"}</div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
              {transformerOutput.map((v, i) => (
                <div key={i} className="p-1.5 rounded bg-cyan-950/40 border border-cyan-900/60 text-center text-cyan-200">
                  {v.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 leading-relaxed flex items-center gap-1 text-cyan-300">
            <span>Perfect recall because all keys/values remain stored uncompressed in O(N) RAM.</span>
          </div>
        </div>

        {/* Card 3: BDH Retrieved Output */}
        <div className="bg-slate-950 p-4 rounded-xl border border-pink-900/40 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-pink-400" />
              Pathway BDH Synaptic Recall
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-800/50">
              Recall: {bdhAccuracy.toFixed(1)}%
            </span>
          </div>

          {/* Accuracy Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Recall Accuracy Meter</span>
              <span className="text-pink-400 font-bold">{bdhAccuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${Math.max(5, bdhAccuracy)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400">{"Retrieved Output Vector [v_BDH = W * q]:"}</div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
              {bdhOutput.map((v, i) => (
                <div key={i} className="p-1.5 rounded bg-pink-950/40 border border-pink-900/60 text-center text-pink-200">
                  {v.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          {/* Theoretical Breakdown */}
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 space-y-1">
            <div className="flex justify-between font-mono">
              <span>{"Decay Factor (λ^age):"}</span>
              <span className="text-pink-400 font-bold">{(decayFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Cross-Talk Interference:</span>
              <span className="text-amber-400 font-bold">{interferenceMagnitude.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
