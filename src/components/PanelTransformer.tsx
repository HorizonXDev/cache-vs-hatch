import React, { useState } from 'react';
import { Database, AlertTriangle, Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TransformerState } from '../types/simulation';
import { LLM_PRESETS } from '../types/simulation';
import { formatBytes } from '../utils/mathEngine';

interface PanelTransformerProps {
  transformerState: TransformerState;
  sequenceLength: number;
  dimension: number;
  selectedIndex: number;
  attentionWeights: number[];
}

export const PanelTransformer: React.FC<PanelTransformerProps> = ({
  transformerState,
  sequenceLength,
  dimension,
  selectedIndex,
  attentionWeights,
}) => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('toy');
  const preset = LLM_PRESETS[selectedPresetKey];

  const bytesPerElement = preset.precisionBits / 8;
  const toyVRAM = 2 * preset.layers * preset.heads * preset.dim * sequenceLength * bytesPerElement;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl space-y-6 backdrop-blur-sm"
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10">
              <Database className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Standard Transformer (KV Cache)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Stores full key-value sequence buffer in memory</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm">
            Scaling: O(N · D)
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Dynamic Matrix Buffer [K ∈ ℝ<sup>N×D</sup>, V ∈ ℝ<sup>N×D</sup>]
            </span>
            <span className="font-mono text-cyan-300 text-xs">
              {sequenceLength}×{dimension} elements (×2)
            </span>
          </div>

          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90 max-h-72 overflow-y-auto space-y-4 shadow-inner">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 mb-1.5 flex justify-between">
                <span>Key Matrix [K] ({sequenceLength} tokens stored)</span>
                <span>Active Token: #{selectedIndex + 1}</span>
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))` }}>
                {transformerState.keys.map((keyVec, tokenIdx) => {
                  const isSelected = tokenIdx === selectedIndex;
                  const attn = attentionWeights[tokenIdx] || 0;
                  return keyVec.map((val, dIdx) => (
                    <div
                      key={`k-${tokenIdx}-${dIdx}`}
                      className={`h-3.5 rounded-[3px] transition-all text-[8px] flex items-center justify-center font-mono ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 font-bold border border-cyan-200 kv-cell-glow scale-105'
                          : attn > 0.1
                          ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-700/50'
                          : 'bg-slate-800/80 border border-slate-800'
                      }`}
                      title={`Token ${tokenIdx + 1} Key[${dIdx}]: ${val.toFixed(2)} | Attn: ${(attn * 100).toFixed(1)}%`}
                    />
                  ));
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-purple-400 mb-1.5">
                Value Matrix [V] ({sequenceLength} tokens stored)
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))` }}>
                {transformerState.values.map((valVec, tokenIdx) => {
                  const isSelected = tokenIdx === selectedIndex;
                  return valVec.map((val, dIdx) => (
                    <div
                      key={`v-${tokenIdx}-${dIdx}`}
                      className={`h-3.5 rounded-[3px] transition-all text-[8px] flex items-center justify-center font-mono ${
                        isSelected
                          ? 'bg-purple-500 text-white font-bold border border-purple-300 scale-105'
                          : 'bg-slate-800/80 border border-slate-800'
                      }`}
                      title={`Token ${tokenIdx + 1} Value[${dIdx}]: ${val.toFixed(2)}`}
                    />
                  ));
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90 space-y-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" />
            Live VRAM Memory Calculator
          </span>
          <select
            value={selectedPresetKey}
            onChange={(e) => setSelectedPresetKey(e.target.value)}
            className="bg-slate-900 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            {Object.entries(LLM_PRESETS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono">
            <div className="text-slate-500 text-[11px]">Architecture Setup</div>
            <div className="text-slate-200 font-bold mt-0.5">
              {preset.layers} L · {preset.heads} H · D={preset.dim}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono">
            <div className="text-slate-500 text-[11px]">Required VRAM</div>
            <div className="text-cyan-300 font-bold text-sm mt-0.5">{formatBytes(toyVRAM)}</div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800/60">
          VRAM = 2 × {preset.layers}L × {preset.heads}H × {preset.dim}D × {sequenceLength}N × 2B = <span className="text-cyan-300 font-bold">{formatBytes(toyVRAM)}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-start gap-3 text-[13px] leading-relaxed text-amber-200 shadow-md">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Memory Bottleneck Warning: </span>
          As sequence length N grows towards 100K+ tokens, the KV cache consumes tens of gigabytes of GPU VRAM per user, limiting batch size and causing severe memory thrashing.
        </div>
      </div>
    </motion.div>
  );
};

