import React, { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ThemeMode = 'system' | 'light' | 'dark';

/**
 * Theme toggle button matching the project's futuristic glassmorphic UI vibe.
 * Order: System (Default) -> Light -> Dark -> System
 */
export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('df-theme');
      if (stored === 'light' || stored === 'dark') return stored;
      return 'system';
    } catch {
      return 'system';
    }
  });

  // Sync mode changes to document class & detect system theme
  useEffect(() => {
    const apply = () => {
      const stored = mode === 'system' ? null : mode;
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const effective = stored ?? (prefersLight ? 'light' : 'dark');

      const root = document.documentElement;
      root.classList.add('theme-switching');
      root.classList.toggle('light', effective === 'light');

      window.clearTimeout((apply as unknown as { _t?: number })._t);
      (apply as unknown as { _t?: number })._t = window.setTimeout(() => {
        root.classList.remove('theme-switching');
      }, 300);
    };

    apply();

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (mode === 'system') apply();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  const cycleTheme = () => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system';
      try {
        if (next === 'system') {
          localStorage.removeItem('df-theme');
        } else {
          localStorage.setItem('df-theme', next);
        }
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const getLabel = () => {
    if (mode === 'system') return 'System (Auto)';
    if (mode === 'light') return 'Light Theme';
    return 'Dark Theme';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={cycleTheme}
      title={`Current: ${getLabel()} — Click to switch`}
      aria-label={`Toggle theme (current: ${getLabel()})`}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-xs font-semibold text-slate-200 border border-slate-700/80 transition-all shadow-md hover:border-cyan-500/50 group"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === 'system' && (
            <motion.div
              key="system"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Monitor className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </motion.div>
          )}

          {mode === 'light' && (
            <motion.div
              key="light"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sun className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
            </motion.div>
          )}

          {mode === 'dark' && (
            <motion.div
              key="dark"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="hidden sm:inline font-mono text-[11px] font-bold tracking-tight text-slate-300 group-hover:text-white transition-colors">
        {mode === 'system' ? (
          <span className="text-cyan-400">AUTO</span>
        ) : mode === 'light' ? (
          <span className="text-amber-400">LIGHT</span>
        ) : (
          <span className="text-purple-400">DARK</span>
        )}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;

