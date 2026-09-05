import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, Box } from 'lucide-react';
import { generateTokenSequence } from '../utils/mathEngine';

export const Model3DSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraAngle] = useState<'perspective' | 'front' | 'top'>('perspective');

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

  // 3D Canvas Rendering Loop using HTML5 2.5D/3D projection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Background gradient grid
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid perspective floor lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
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
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(transCenterX, transBaseY, 90, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Title Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TRANSFORMER KV TOWER (O(N) GROWING)', transCenterX, transBaseY + 45);

      // Draw Stacked 3D Cuboids (1 cuboid per active step)
      const blockHeight = 22;
      for (let i = 0; i < activeStep; i++) {
        const blockY = transBaseY - 20 - i * (blockHeight + 4);
        const isLatest = i === activeStep - 1;

        // Block color shifts to red if stack gets high
        const isWarning = i >= 4;
        const fillColor = isLatest
          ? isWarning
            ? 'rgba(239, 68, 68, 0.9)'
            : 'rgba(6, 182, 212, 0.9)'
          : isWarning
          ? 'rgba(185, 28, 28, 0.6)'
          : 'rgba(14, 116, 144, 0.6)';
        const borderColor = isWarning ? '#f87171' : '#22d3ee';

        // 3D Isometric Block
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
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(`Page #${i + 1} ${tokens[i]?.emoji || ''}`, transCenterX, blockY + 5);
      }

      // Right Center: Pathway BDH 3D Neural Mesh Sphere/Grid
      const bdhCenterX = width * 0.72;
      const bdhBaseY = height * 0.55;
      const radius = 80;

      // Draw BDH Base Ring
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(bdhCenterX, height * 0.8, 90, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 12px monospace';
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

        // Active node threshold (~5% active)
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
            ctx.strokeStyle = n1.isActive || n2.isActive ? 'rgba(236, 72, 153, 0.7)' : 'rgba(51, 65, 85, 0.3)';
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
        ctx.fillStyle = node.isActive ? '#ec4899' : '#475569';
        ctx.strokeStyle = node.isActive ? '#ffffff' : '#1e293b';
        ctx.lineWidth = node.isActive ? 2 : 1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (node.isActive) {
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize + 4 + Math.sin(time * 5) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Center Launch Area: Shooting 3D Energy Particle Beams
      const currentToken = tokens[activeStep - 1];
      const sourceX = width / 2;
      const sourceY = height * 0.25;

      // Draw Central Word Capsule
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sourceX - 70, sourceY - 22, 140, 44, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentToken?.emoji || ''} "${currentToken?.label || ''}"`, sourceX, sourceY + 5);

      // Energy Particles shooting from center to both models
      const progress = (time * 2) % 1; // 0 to 1

      // Beam to Transformer
      const pTransX = sourceX + (transCenterX - sourceX) * progress;
      const pTransY = sourceY + (transBaseY - 40 - sourceY) * progress;

      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pTransX, pTransY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Beam to BDH
      const pBdhX = sourceX + (bdhCenterX - sourceX) * progress;
      const pBdhY = sourceY + (bdhBaseY - sourceY) * progress;

      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pBdhX, pBdhY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeStep, cameraAngle, tokens]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                REAL-TIME 3D SIMULATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">Model Interiors</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              3D Interactive Model Memory Simulator
            </h2>
          </div>
        </div>

        {/* Player Bar */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause 3D' : 'Play 3D'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
            }}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300"
            title="Reset 3D Scene"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Canvas Box */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={840}
          height={380}
          className="w-full h-auto max-h-[420px] object-cover block"
        />

        {/* Live Overlay Callout */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{tokens[activeStep - 1]?.emoji}</span>
            <span className="text-slate-200">
              Shooting word <strong>"{tokens[activeStep - 1]?.label}"</strong> into both models in 3D!
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-cyan-400">Transformer: Tower +1 Block</span>
            <span className="text-pink-400">BDH: Fixed Mesh +5% Synapses</span>
          </div>
        </div>
      </div>
    </div>
  );
};
