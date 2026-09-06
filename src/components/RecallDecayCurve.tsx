import React, { useState } from 'react';
import { LineChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const svgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 40;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / Math.max(1, N - 1)) * plotWidth;
  const getY = (acc: number) => paddingTop + plotHeight - (Math.max(0, Math.min(100, acc)) / 100) * plotHeight;

  const transPointsStr = points.map((p) => `${getX(p.idx)},${getY(p.transAcc)}`).join(' ');
  const bdhPointsStr = points.map((p) => `${getX(p.idx)},${getY(p.bdhAcc)}`).join(' ');

  // Gradient area paths
  const transAreaPath = `${transPointsStr} L ${getX(N - 1)},${paddingTop + plotHeight} L ${getX(0)},${paddingTop + plotHeight} Z`;
  const bdhAreaPath = `${bdhPointsStr} L ${getX(N - 1)},${paddingTop + plotHeight} L ${getX(0)},${paddingTop + plotHeight} Z`;

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[selectedIndex];

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 backdrop-blur-sm">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between border-b border-slate-800/80 pb-5 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-500/10 shrink-0">
            <LineChart className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Analytical Recall Decay Curve
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comparing linear O(N) KV Cache recall vs fixed O(1) BDH synaptic decay (λ = {decayLambda.toFixed(2)})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
          <span className="flex items-center gap-2 text-cyan-300 font-semibold bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            <span className="w-3 h-1 bg-cyan-400 rounded-full" /> Transformer (100% Flat)
          </span>
          <span className="flex items-center gap-2 text-pink-300 font-semibold bg-pink-950/60 px-2.5 py-1 rounded-lg border border-pink-500/30">
            <span className="w-3 h-1 bg-pink-500 rounded-full" /> BDH Synaptic Decay
          </span>
        </div>
      </div>

      <div className="relative bg-slate-950/90 p-4 sm:p-6 rounded-3xl border border-slate-800/90 shadow-inner">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="transGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bdhGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
            </linearGradient>
          </defs>

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

          <path d={transAreaPath} fill="url(#transGrad)" />
          <path d={bdhAreaPath} fill="url(#bdhGrad)" />

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
                  className="transition-all duration-200"
                />

                <circle
                  cx={x}
                  cy={yBDH}
                  r={isSelected || isHovered ? 6 : 3.5}
                  fill="#ec4899"
                  stroke={isSelected ? '#ffffff' : 'none'}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
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
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          )}

          <text x={paddingLeft} y={svgHeight - 12} fill="#64748b" fontSize="10" fontFamily="monospace">
            Position #1 (Oldest)
          </text>
          <text x={svgWidth - paddingRight} y={svgHeight - 12} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
            Position #{N} (Recent)
          </text>
        </svg>
      </div>

      {activePoint && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm space-y-3 sm:space-y-0 shadow-xl gap-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{activePoint.token.emoji}</span>
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span>Token #{activePoint.idx + 1}: {activePoint.token.label}</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {N - 1 - activePoint.idx} steps in past
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div className="text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Transformer: <span className="font-bold">{activePoint.transAcc.toFixed(1)}%</span>
            </div>
            <div className="text-pink-300 bg-pink-950/40 px-2.5 py-1 rounded-lg border border-pink-500/20">
              BDH Recall: <span className="font-bold">{activePoint.bdhAcc.toFixed(1)}%</span>
            </div>
            <div className="text-slate-300 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>λ<sup>age</sup>: {(activePoint.decayFactor * 100).toFixed(1)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

