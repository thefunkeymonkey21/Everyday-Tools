import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const Footer = ({ totalGames, onOpenAddModal }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#060910] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-display">ArcadeVault</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              A light, fast unblocked web game portal designed for smooth browser gameplay. All games are stored in an open JSON catalog and rendered in isolated iframe sandboxes.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">{totalGames} Games Indexed</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>100% Unblocked</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>No AI</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Catalog & Feeds
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="./games.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Raw games.json Catalog
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAddModal}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Add Custom Iframe Game
                </button>
              </li>
              <li>
                <a
                  href="./games/tetris/index.html"
                  target="_blank"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Standalone Cyber Blocks
                </a>
              </li>
              <li>
                <a
                  href="./games/snake/index.html"
                  target="_blank"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Standalone Cyber Snake
                </a>
              </li>
            </ul>
          </div>

          {/* Shortcuts & Stealth */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Keyboard Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Stealth Panic Key</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-cyan-400">]</kbd>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Close Player</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-slate-300">Esc</kbd>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Hard Drop / Flap</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-slate-300">Space</kbd>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ArcadeVault. Unblocked browser gaming ecosystem.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Zero telemetry · Pure HTML/JS/CSS sandboxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
