import React, { useState } from 'react';
import { LineChart } from 'lucide-react';
import type { SimulationToken, TransformerState, BDHState } from '../types/simulation';
import { queryModels } from '../utils/mathEngine';

interface RecallDecayCurveProps {
  tokens: SimulationToken[];
  transformerState: TransformerState;
  bdhState: BDHState;
  decayLambda: number;
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
}

export const RecallDecayCurve: React.FC<RecallDecayCurveProps> = ({
  tokens,
  transformerState,
  bdhState,
  decayLambda,
  selectedIndex,
  setSelectedIndex,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const points = tokens.map((token, idx) => {
    const res = queryModels(tokens, idx, transformerState, bdhState, decayLambda);
    return {
      idx,
      token,
      transAcc: res.transformerAccuracy,
      bdhAcc: res.bdhAccuracy,
      decayFactor: res.decayFactor,
    };
  });

  const N = tokens.length;
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / Math.max(1, N - 1)) * plotWidth;
  const getY = (acc: number) => paddingTop + plotHeight - (Math.max(0, Math.min(100, acc)) / 100) * plotHeight;

  const transPointsStr = points.map((p) => `${getX(p.idx)},${getY(p.transAcc)}`).join(' ');
  const bdhPointsStr = points.map((p) => `${getX(p.idx)},${getY(p.bdhAcc)}`).join(' ');

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[selectedIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Analytical Recall Decay Curve vs Token Position
            </h2>
            <p className="text-xs text-slate-400">
              Comparing linear O(N) KV Cache recall vs fixed O(1) BDH synaptic decay (λ = {decayLambda.toFixed(2)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="w-3 h-0.5 bg-cyan-400 rounded" /> Transformer (100% Flat)
          </span>
          <span className="flex items-center gap-1.5 text-pink-400 font-semibold">
            <span className="w-3 h-0.5 bg-pink-500 rounded" /> BDH Synaptic Decay Curve
          </span>
        </div>
      </div>

      <div className="relative bg-slate-950 p-2 rounded-xl border border-slate-800">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={`grid-${val}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          <polyline fill="none" stroke="#22d3ee" strokeWidth="2.5" points={transPointsStr} />
          <polyline fill="none" stroke="#ec4899" strokeWidth="2.5" points={bdhPointsStr} />

          {points.map((p) => {
            const x = getX(p.idx);
            const yTrans = getY(p.transAcc);
            const yBDH = getY(p.bdhAcc);
            const isSelected = p.idx === selectedIndex;
            const isHovered = p.idx === hoverIdx;

            return (
              <g key={`node-${p.idx}`} className="cursor-pointer" onClick={() => setSelectedIndex(p.idx)} onMouseEnter={() => setHoverIdx(p.idx)} onMouseLeave={() => setHoverIdx(null)}>
                <circle
                  cx={x}
                  cy={yTrans}
                  r={isSelected ? 5 : 3}
                  fill="#22d3ee"
                  className="transition-all"
                />

                <circle
                  cx={x}
                  cy={yBDH}
                  r={isSelected || isHovered ? 6 : 3.5}
                  fill="#ec4899"
                  stroke={isSelected ? '#ffffff' : 'none'}
                  strokeWidth="1.5"
                  className="transition-all"
                />
              </g>
            );
          })}

          {activePoint && (
            <line
              x1={getX(activePoint.idx)}
              y1={paddingTop}
              x2={getX(activePoint.idx)}
              y2={svgHeight - paddingBottom}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          )}

          <text x={paddingLeft} y={svgHeight - 10} fill="#64748b" fontSize="10" fontFamily="monospace">
            Position #1 (Oldest)
          </text>
          <text x={svgWidth - paddingRight} y={svgHeight - 10} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
            Position #{N} (Recent)
          </text>
        </svg>
      </div>

      {activePoint && (
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs space-y-2 sm:space-y-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{activePoint.token.emoji}</span>
            <span className="font-semibold text-slate-200">
              Token #{activePoint.idx + 1}: {activePoint.token.label}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              ({N - 1 - activePoint.idx} steps in past)
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div className="text-cyan-400">
              Transformer: <span className="font-bold">{activePoint.transAcc.toFixed(1)}%</span>
            </div>
            <div className="text-pink-400">
              BDH Recall: <span className="font-bold">{activePoint.bdhAcc.toFixed(1)}%</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Theory λ^age: {(activePoint.decayFactor * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
