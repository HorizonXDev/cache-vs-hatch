import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, Box, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateTokenSequence } from '../utils/mathEngine';

export const Model3DSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const totalSteps = 6;
  const tokens = useMemo(() => generateTokenSequence(totalSteps, 4), []);

  // Timer loop for auto-advancing 3D simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev >= totalSteps ? 1 : prev + 1));
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSteps]);

  // 3D Canvas Rendering Loop using HTML5 2.5D/3D projection with crisp DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;

      // Handle HiDPI screens
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const logicalWidth = rect.width || 840;
      const logicalHeight = 400;

      if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = logicalWidth;
      const height = logicalHeight;

      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains('light');

      // Background gradient grid
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, isLight ? '#f8fafc' : '#030712');
      bgGrad.addColorStop(1, isLight ? '#e2e8f0' : '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid perspective floor lines
      ctx.strokeStyle = isLight ? 'rgba(148, 163, 184, 0.4)' : 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.2, height * 0.4);
        ctx.stroke();
      }

      // Left Center: Transformer 3D Stacking Memory Tower
      const transCenterX = width * 0.28;
      const transBaseY = height * 0.8;

      // Draw Transformer 3D Platform
      ctx.fillStyle = isLight ? '#ffffff' : '#0f172a';
      ctx.strokeStyle = isLight ? '#0284c7' : '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(transCenterX, transBaseY, 90, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Title Label
      ctx.fillStyle = isLight ? '#0369a1' : '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TRANSFORMER KV TOWER (O(N) GROWING)', transCenterX, transBaseY + 45);

      // Draw Stacked 3D Cuboids (1 cuboid per active step)
      const blockHeight = 22;
      for (let i = 0; i < activeStep; i++) {
        const blockY = transBaseY - 20 - i * (blockHeight + 4);
        const isLatest = i === activeStep - 1;

        const isWarning = i >= 4;
        const fillColor = isLatest
          ? isWarning
            ? isLight
              ? 'rgba(239, 68, 68, 0.85)'
              : 'rgba(239, 68, 68, 0.9)'
            : isLight
            ? 'rgba(2, 132, 199, 0.85)'
            : 'rgba(6, 182, 212, 0.9)'
          : isWarning
          ? isLight
            ? 'rgba(220, 38, 38, 0.55)'
            : 'rgba(185, 28, 28, 0.6)'
          : isLight
          ? 'rgba(3, 105, 161, 0.55)'
          : 'rgba(14, 116, 144, 0.6)';
        const borderColor = isWarning
          ? isLight
            ? '#dc2626'
            : '#f87171'
          : isLight
          ? '#0284c7'
          : '#22d3ee';

        const bw = 70;
        const bh = blockHeight;

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1.5;

        // Top face
        ctx.beginPath();
        ctx.moveTo(transCenterX, blockY - bh);
        ctx.lineTo(transCenterX + bw / 2, blockY - bh + 10);
        ctx.lineTo(transCenterX, blockY - bh + 20);
        ctx.lineTo(transCenterX - bw / 2, blockY - bh + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front Left face
        ctx.beginPath();
        ctx.moveTo(transCenterX - bw / 2, blockY - bh + 10);
        ctx.lineTo(transCenterX, blockY - bh + 20);
        ctx.lineTo(transCenterX, blockY + 20);
        ctx.lineTo(transCenterX - bw / 2, blockY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front Right face
        ctx.beginPath();
        ctx.moveTo(transCenterX, blockY - bh + 20);
        ctx.lineTo(transCenterX + bw / 2, blockY - bh + 10);
        ctx.lineTo(transCenterX + bw / 2, blockY + 10);
        ctx.lineTo(transCenterX, blockY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Label on block
        ctx.fillStyle = isLight ? '#ffffff' : '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Page #${i + 1} ${tokens[i]?.emoji || ''}`, transCenterX, blockY + 5);
      }

      // Right Center: Pathway BDH 3D Neural Mesh Sphere/Grid
      const bdhCenterX = width * 0.72;
      const bdhBaseY = height * 0.55;
      const radius = 80;

      // Draw BDH Base Ring
      ctx.fillStyle = isLight ? '#ffffff' : '#0f172a';
      ctx.strokeStyle = isLight ? '#db2777' : '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(bdhCenterX, height * 0.8, 90, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isLight ? '#be185d' : '#f43f5e';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PATHWAY BDH MESH (O(1) FIXED SIZE)', bdhCenterX, height * 0.8 + 45);

      // 3D Neural Lattice Nodes (Fixed 16 nodes rotating in 3D sphere)
      const numNodes = 16;
      const nodeCoords: { x: number; y: number; z: number; isActive: boolean }[] = [];

      for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi + time * 0.5;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const isActive = (i + activeStep * 2) % 6 === 0;

        nodeCoords.push({
          x: bdhCenterX + x,
          y: bdhBaseY + y * 0.6,
          z,
          isActive,
        });
      }

      // Draw 3D Synaptic Connection Beams between nodes
      for (let i = 0; i < nodeCoords.length; i++) {
        for (let j = i + 1; j < nodeCoords.length; j++) {
          const n1 = nodeCoords[i];
          const n2 = nodeCoords[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 75) {
            ctx.strokeStyle = n1.isActive || n2.isActive
              ? isLight
                ? 'rgba(219, 39, 119, 0.8)'
                : 'rgba(236, 72, 153, 0.7)'
              : isLight
              ? 'rgba(203, 213, 225, 0.6)'
              : 'rgba(51, 65, 85, 0.3)';
            ctx.lineWidth = n1.isActive || n2.isActive ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Glowing Nodes
      nodeCoords.forEach((node) => {
        const nodeSize = node.isActive ? 7 : 4;
        ctx.fillStyle = node.isActive
          ? isLight
            ? '#db2777'
            : '#ec4899'
          : isLight
          ? '#94a3b8'
          : '#475569';
        ctx.strokeStyle = node.isActive ? '#ffffff' : isLight ? '#cbd5e1' : '#1e293b';
        ctx.lineWidth = node.isActive ? 2 : 1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (node.isActive) {
          ctx.strokeStyle = isLight ? 'rgba(219, 39, 119, 0.5)' : 'rgba(236, 72, 153, 0.5)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize + 4 + Math.sin(time * 5) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Center Launch Area: Shooting 3D Energy Particle Beams
      const currentToken = tokens[activeStep - 1];
      const sourceX = width / 2;
      const sourceY = height * 0.22;

      // Draw Central Word Capsule
      ctx.fillStyle = isLight ? '#e0e7ff' : '#1e1b4b';
      ctx.strokeStyle = isLight ? '#4338ca' : '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sourceX - 75, sourceY - 22, 150, 44, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isLight ? '#3730a3' : '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentToken?.emoji || ''} "${currentToken?.label || ''}"`, sourceX, sourceY + 5);

      // Energy Particles shooting from center to both models
      const progress = (time * 2) % 1;

      // Beam to Transformer
      const pTransX = sourceX + (transCenterX - sourceX) * progress;
      const pTransY = sourceY + (transBaseY - 40 - sourceY) * progress;

      ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
      ctx.shadowColor = isLight ? '#0284c7' : '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pTransX, pTransY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Beam to BDH
      const pBdhX = sourceX + (bdhCenterX - sourceX) * progress;
      const pBdhY = sourceY + (bdhBaseY - sourceY) * progress;

      ctx.fillStyle = isLight ? '#db2777' : '#f43f5e';
      ctx.shadowColor = isLight ? '#db2777' : '#ec4899';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pBdhX, pBdhY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeStep, tokens]);

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 backdrop-blur-sm">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3.5 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-md shadow-purple-500/10">
            <Box className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                REAL-TIME 3D VISUALIZER
              </span>
              <span className="text-xs text-slate-400 font-mono">Model Architecture Interior</span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5">
              3D Interactive Memory Simulator
            </h2>
          </div>
        </div>

        {/* Player Bar */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause 3D' : 'Play 3D'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Reset 3D Scene"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] block"
        />

        {/* Live Overlay Callout */}
        <div className="absolute bottom-3 left-3 right-3 p-3 sm:p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">{tokens[activeStep - 1]?.emoji}</span>
            <span className="text-slate-200">
              Streaming token <strong className="text-cyan-300">"{tokens[activeStep - 1]?.label}"</strong> into both architectures in 3D!
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Transformer: Tower +1 Block
            </span>
            <span className="text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> BDH: Fixed Mesh +5% Synapses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

