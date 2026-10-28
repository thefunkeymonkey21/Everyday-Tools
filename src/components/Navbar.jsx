import React from 'react';
import { Shield, Plus, Star, Gamepad2, Search } from 'lucide-react';

export const Navbar = ({
  onAddGameClick,
  onStealthClick,
  onFavoritesClick,
  onAllGamesClick,
  favoritesCount,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={onAllGamesClick}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0">
            ArcadeVault
          </span>
        </button>

        {/* Zone 2: 4-5 Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={onAllGamesClick}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            All Games
          </button>
          <button
            onClick={() => onFavoritesClick()}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            Favorites ({favoritesCount})
          </button>
          <button
            onClick={onAddGameClick}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Add Iframe Game
          </button>
          <a
            href="/games.json"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-500"
          >
            games.json
          </a>
        </nav>

        {/* Search Input inline */}
        <div className="flex-1 max-w-xs relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search unblocked games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>

        {/* Zone 3: 1 Primary Action (Stealth Cloak / Panic Key) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStealthClick}
            title="Press ] anytime to trigger Stealth Mode"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Panic Key <kbd className="hidden lg:inline px-1 py-0.5 ml-1 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">]</kbd></span>
          </button>
        </div>

      </div>
    </header>
  );
};
