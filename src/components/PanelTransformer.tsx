import React, { useState } from 'react';
import { Database, AlertTriangle, Activity, Cpu } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-4">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Standard Transformer (KV Cache)
              </h2>
              <p className="text-xs text-slate-400">Stores full key-value sequence buffer in memory</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            Scaling: O(N · D)
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              {"Dynamic Matrix Buffer [K ∈ ℝ^(N×D), V ∈ ℝ^(N×D)]"}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {sequenceLength} x {dimension} elements (x2)
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-56 overflow-y-auto space-y-3">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 mb-1 flex justify-between">
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
                      className={`h-3 rounded-[2px] transition-all text-[8px] flex items-center justify-center font-mono ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-300 kv-cell-glow'
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
              <div className="text-[11px] font-mono text-cyan-400 mb-1">
                Value Matrix [V] ({sequenceLength} tokens stored)
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))` }}>
                {transformerState.values.map((valVec, tokenIdx) => {
                  const isSelected = tokenIdx === selectedIndex;
                  return valVec.map((val, dIdx) => (
                    <div
                      key={`v-${tokenIdx}-${dIdx}`}
                      className={`h-3 rounded-[2px] transition-all text-[8px] flex items-center justify-center font-mono ${
                        isSelected
                          ? 'bg-purple-500 text-white font-bold border border-purple-300'
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

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Live VRAM Memory Footprint Calculator
          </span>
          <select
            value={selectedPresetKey}
            onChange={(e) => setSelectedPresetKey(e.target.value)}
            className="bg-slate-900 text-cyan-400 text-xs font-medium px-2 py-1 rounded border border-slate-700 focus:outline-none"
          >
            {Object.entries(LLM_PRESETS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/60 font-mono">
            <div className="text-slate-500 text-[10px]">Architecture Setup</div>
            <div className="text-slate-300 font-semibold mt-0.5">
              {preset.layers} L | {preset.heads} H | D={preset.dim}
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/60 font-mono">
            <div className="text-slate-500 text-[10px]">Required VRAM</div>
            <div className="text-cyan-400 font-bold text-sm mt-0.5">{formatBytes(toyVRAM)}</div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/40">
          {`VRAM = 2 × ${preset.layers} L × ${preset.heads} H × ${preset.dim} D × ${sequenceLength} N × 2B = ${formatBytes(toyVRAM)}`}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-start gap-2 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Memory Bottleneck Warning: </span>
          As sequence length N grows towards 100K+ tokens, the KV cache consumes tens of gigabytes of GPU VRAM per user, limiting batch size and causing severe memory bandwidth thrashing.
        </div>
      </div>
    </div>
  );
};
