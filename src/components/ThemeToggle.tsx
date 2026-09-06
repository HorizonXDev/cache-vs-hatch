import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

/**
 * Theme toggle.
 * Resolution order: saved preference (localStorage "df-theme") > OS preference.
 * Dark mode = no `.light` class on <html>. Light mode = `.light` class present.
 */
export const ThemeToggle: React.FC = () => {
  // 'light' | 'dark' | 'system' — what the user picked ('' means never picked)
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
    try {
      const stored = localStorage.getItem('df-theme');
      if (stored === 'light' || stored === 'dark') return stored;
      // 'system', empty, or unknown values all mean: follow the OS
      return 'system';
    } catch {
      return 'system';
    }
  });

  // Apply effective theme + react to OS changes while in system mode
  useEffect(() => {
    const apply = () => {
      const stored = mode === 'system' ? null : mode;
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const effective = stored ?? (prefersLight ? 'light' : 'dark');
      const root = document.documentElement;
      root.classList.add('theme-switching');
      root.classList.toggle('light', effective === 'light');
      // Remove the transient class after the CSS transition finishes
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

  // Cycle: system -> light -> dark -> system (auto mode is the default on first visit)
  const cycle = () => {
    setMode((prev) => {
      const next = prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system';
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

  // Icon reflects the effective theme; title explains what the next click does
  const icon =
    mode === 'system' ? (
      <Monitor className="w-4 h-4" />
    ) : mode === 'light' ? (
      <Sun className="w-4 h-4" />
    ) : (
      <Moon className="w-4 h-4" />
    );
  const label =
    mode === 'system'
      ? 'Theme: Auto (follows your system) — click to force light'
      : mode === 'light'
      ? 'Theme: Light — click to force dark'
      : 'Theme: Dark — click to go back to auto';

  return (
    <button
      onClick={cycle}
      title={label}
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm shrink-0"
    >
      {icon}
    </button>
  );
};

export default ThemeToggle;
