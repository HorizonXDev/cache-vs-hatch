import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Brain, Cpu, Zap, ArrowRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      }, 2400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, totalSteps]);

  const activeToken = tokens[activeStep - 1];

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-9 backdrop-blur-sm">
      {/* Title Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 shrink-0">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                VISUAL ANIMATED DEMO
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-mono">Particle Memory Flow</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight">
              How AI Models Remember Words
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner self-start xl:self-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isAutoPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlaying ? 'Pause Story' : 'Play Story'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveStep(1);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Restart Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Token Stream Strip */}
      <div className="space-y-3">
        <div className="flex justify-between items-center gap-2 text-xs sm:text-sm text-slate-300">
          <span className="font-semibold">1. Incoming Word Stream</span>
          <span className="font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/30 text-xs">
            Step {activeStep} of {totalSteps}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
          {tokens.map((token, idx) => {
            const stepNum = idx + 1;
            const isActive = activeStep === stepNum;
            const isPassed = activeStep > stepNum;
            return (
              <motion.button
                key={token.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveStep(stepNum);
                }}
                className={`p-3 sm:p-4 rounded-2xl border text-center transition-all relative overflow-hidden shadow-md ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-900/90 to-slate-950 border-cyan-400 text-white font-bold scale-105 shadow-xl ring-2 ring-cyan-500/50'
                    : isPassed
                    ? 'bg-slate-900/90 border-slate-700/80 text-slate-300'
                    : 'bg-slate-950/60 border-slate-900 text-slate-600'
                }`}
              >
                <div className="text-xl sm:text-3xl mb-1">{token.emoji}</div>
                <div className="text-xs sm:text-sm font-semibold truncate">{token.label}</div>
                {isActive && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Animated Particle Stream Section */}
      <div className="bg-slate-950/90 p-6 sm:p-8 rounded-3xl border border-slate-800/90 space-y-8 relative overflow-hidden shadow-inner">
        {/* Active Word Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-4">
            <motion.div
              key={activeToken.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20"
            >
              {activeToken.emoji}
            </motion.div>
            <div>
              <div className="text-xs text-cyan-400 font-mono font-bold tracking-wider">ACTIVE WORD PACKET</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">"{activeToken.label}"</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Particle Flow: Active</span>
          </div>
        </div>

        {/* Dual Animated Flow Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          {/* Path A: Standard Transformer Notebook Stack */}
          <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-cyan-900/40 space-y-5 relative shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <span className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-cyan-400" />
                Transformer (Writing Notebook Pages)
              </span>
              <span className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Pages: {activeStep} / 5
              </span>
            </div>

            {/* Particle Moving Down into Notebook */}
            <div className="flex items-center justify-center py-1">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-cyan-300 bg-cyan-950/80 px-4 py-2 rounded-full border border-cyan-500/40 animate-pulse shadow-sm">
                <span>Sending vector packet to Page #{activeStep}...</span>
                <ArrowRight className="w-4.5 h-4.5 text-cyan-400 animate-bounce" />
              </div>
            </div>

            {/* Animated Stack of Pages */}
            <div className="space-y-2.5 min-h-[190px] flex flex-col justify-end">
              <AnimatePresence>
                {Array.from({ length: activeStep }).map((_, pIdx) => (
                  <motion.div
                    key={`page-${pIdx}`}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-mono flex items-center justify-between transition-all ${
                      pIdx === activeStep - 1
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 scale-[1.02] shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-950/90 text-slate-300 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4.5 h-4.5" />
                      <span>Notebook Page #{pIdx + 1}: "{tokens[pIdx].label}"</span>
                    </div>
                    <span className="text-lg">{tokens[pIdx].emoji}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-xs sm:text-sm text-slate-400 italic bg-slate-950/80 p-3.5 sm:p-4 rounded-xl border border-slate-800/80">
              Notice: The notebook gets thicker and heavier with every new word!
            </div>
          </div>

          {/* Path B: Pathway BDH Synaptic Brain Grid */}
          <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-pink-900/40 space-y-5 relative shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <span className="text-sm font-bold text-pink-300 flex items-center gap-2">
                <Brain className="w-4.5 h-4.5 text-pink-400" />
                Pathway BDH (Tuning Brain Synapses)
              </span>
              <span className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-500/30">
                Brain Grid: Fixed 4×4
              </span>
            </div>

            {/* Particle Moving into Brain Grid */}
            <div className="flex items-center justify-center py-1">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-pink-300 bg-pink-950/80 px-4 py-2 rounded-full border border-pink-500/40 animate-pulse shadow-sm">
                <span>Lighting up ~5% brain synapses...</span>
                <Zap className="w-4.5 h-4.5 text-pink-400 animate-ping" />
              </div>
            </div>

            {/* Animated 4x4 Synaptic Grid */}
            <div className="grid grid-cols-4 gap-2.5 justify-center p-4 sm:p-5 bg-slate-950/90 rounded-2xl border border-slate-800 min-h-[190px] items-center">
              {Array.from({ length: 16 }).map((_, nodeIdx) => {
                const isActiveSynapse = (nodeIdx + activeStep * 3) % 7 === 0;
                return (
                  <div
                    key={nodeIdx}
                    className={`h-10 sm:h-11 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all duration-300 relative ${
                      isActiveSynapse
                        ? 'bg-pink-500 text-white border border-pink-300 scale-110 active-node-glow'
                        : 'bg-slate-900/90 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <span>S_{nodeIdx + 1}</span>
                    {isActiveSynapse && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-300 animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-xs sm:text-sm text-slate-400 italic bg-slate-950/80 p-3.5 sm:p-4 rounded-xl border border-slate-800/80">
              Notice: The brain grid size NEVER grows — it only lights up pulsing synapses!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
