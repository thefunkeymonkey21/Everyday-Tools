import React, { useState } from 'react';
import { Play, Star, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative bg-[#0D1424] hover:bg-[#111A2E] border border-slate-800/80 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5"
    >
      <div>
        {/* Thumbnail Area */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
          {game.thumbnail && !imageError ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            /* Styled Fallback Pattern */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 mb-2">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-300 font-display">
                {game.title}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                HTML5 Iframe Game
              </span>
            </div>
          )}

          {/* Quick Play Hover Scrim */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:scale-110 transition-all z-10"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Card Content (Zero-Pill Discipline) */}
        <div className="p-4">
          {/* Metadata Row: Category & Plays as unboxed text */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
            <span className="text-emerald-400">{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono tabular-nums text-slate-400">
              {game.plays?.toLocaleString?.() || game.plays} plays
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono">
              ★ {Number(game.rating).toFixed(1)}
            </span>
          </div>

          <h3 className="text-base font-semibold text-white font-display group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1.5">
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Tags & Controls preview */}
      <div className="px-4 pb-4 pt-1 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
        <div className="truncate max-w-[190px]">
          {game.tags?.slice(0, 3).join(' · ')}
        </div>
        <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
          {game.controls?.[0]?.key || 'Keys'}
        </span>
      </div>
    </div>
  );
};
