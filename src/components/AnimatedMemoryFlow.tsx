import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Brain, Cpu, Zap, ArrowRight, Layers } from 'lucide-react';
import { generateTokenSequence } from '../utils/mathEngine';

export const AnimatedMemoryFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const totalSteps = 5;
  const dimension = 4;

  const tokens = useMemo(() => {
    return generateTokenSequence(totalSteps, dimension);
  }, []);

  // Auto-play animation timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev >= totalSteps ? 1 : prev + 1));
      }, 2200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, totalSteps]);

  const activeToken = tokens[activeStep - 1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                BEGINNER ANIMATED STORY
              </span>
              <span className="text-xs text-slate-400 font-mono">Particle Memory Flow</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              How AI Models Remember Words (Animated Particle Flow)
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
              isAutoPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? 'Pause Story' : 'Play Story'}</span>
          </button>
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveStep(1);
            }}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300"
            title="Restart Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Token Stream Strip */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>1. Incoming Word Stream</span>
          <span className="font-mono text-cyan-400">Step {activeStep} of {totalSteps}</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {tokens.map((token, idx) => {
            const stepNum = idx + 1;
            const isActive = activeStep === stepNum;
            const isPassed = activeStep > stepNum;
            return (
              <button
                key={token.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveStep(stepNum);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-cyan-950 border-cyan-400 text-white font-bold scale-105 shadow-xl ring-2 ring-cyan-500/40'
                    : isPassed
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <div className="text-xl mb-1">{token.emoji}</div>
                <div className="text-xs font-semibold">{token.label}</div>
                {isActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Particle Stream Section */}
      <div className="bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-6 relative overflow-hidden">
        {/* Active Word Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl animate-bounce">
              {activeToken.emoji}
            </div>
            <div>
              <div className="text-xs text-cyan-400 font-mono font-bold">ACTIVE WORD PACKET</div>
              <div className="text-base font-extrabold text-white">"{activeToken.label}"</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Particle Flow Speed: Normal</span>
          </div>
        </div>

        {/* Dual Animated Flow Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Path A: Standard Transformer Notebook Stack */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-900/40 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Transformer (Writing Notebook Pages)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Pages: {activeStep} / 5
              </span>
            </div>

            {/* Particle Moving Down into Notebook */}
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 animate-pulse">
                <span>Sending vector packet to Page #{activeStep}...</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 animate-bounce" />
              </div>
            </div>

            {/* Animated Stack of Pages */}
            <div className="space-y-1.5 min-h-[140px] flex flex-col justify-end">
              {Array.from({ length: activeStep }).map((_, pIdx) => (
                <div
                  key={pIdx}
                  className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-all duration-500 animate-in slide-in-from-top-2 ${
                    pIdx === activeStep - 1
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 scale-105 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Notebook Page #{pIdx + 1}: "{tokens[pIdx].label}"</span>
                  </div>
                  <span className="text-[10px] opacity-80">{tokens[pIdx].emoji}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2.5 rounded border border-slate-800">
              Notice: The notebook gets thicker and heavier with every new word!
            </div>
          </div>

          {/* Path B: Pathway BDH Synaptic Brain Grid */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-pink-900/40 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-pink-400" />
                Pathway BDH (Tuning Brain Synapses)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950 text-pink-300 border border-pink-800">
                Brain Grid: Fixed 4 x 4
              </span>
            </div>

            {/* Particle Moving into Brain Grid */}
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-xs font-mono text-pink-300 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-800 animate-pulse">
                <span>Lighting up ~5% brain synapses...</span>
                <Zap className="w-4 h-4 text-pink-400 animate-ping" />
              </div>
            </div>

            {/* Animated 4x4 Synaptic Grid */}
            <div className="grid grid-cols-4 gap-2 justify-center p-3 bg-slate-950 rounded-xl border border-slate-800 min-h-[140px] items-center">
              {Array.from({ length: 16 }).map((_, nodeIdx) => {
                const isActiveSynapse = (nodeIdx + activeStep * 3) % 7 === 0;
                return (
                  <div
                    key={nodeIdx}
                    className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-500 relative ${
                      isActiveSynapse
                        ? 'bg-pink-500 text-white border border-pink-300 scale-110 active-node-glow'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    <span>S_{nodeIdx + 1}</span>
                    {isActiveSynapse && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-300 animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2.5 rounded border border-slate-800">
              Notice: The brain grid size NEVER grows—it only lights up pulsing synapses!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
