import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Star,
  Keyboard
} from 'lucide-react';

function resolveGameUrl(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;

  const cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');

  let basePath = window.location.pathname;
  if (!basePath.endsWith('/')) {
    if (/\.[a-zA-Z0-9]+$/.test(basePath)) {
      basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
    } else {
      basePath = basePath + '/';
    }
  }

  return window.location.origin + basePath + cleanPath;
}

export const GamePlayerModal = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const resolvedUrl = game ? resolveGameUrl(game.iframeSrc) : '';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (iframeRef.current) {
      try {
        iframeRef.current.focus();
      } catch (e) {}
    }
  }, [resolvedUrl, iframeKey]);

  if (!game) return null;

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleReloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className={`bg-[#0B101D] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
          isTheater || isFullscreen
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'w-full max-w-5xl h-[88vh] max-h-[850px]'
        }`}
      >
        {/* Player Header Bar */}
        <div className="bg-[#090D18] px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Player (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white font-display truncate">
                {game.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="text-emerald-400">{game.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{game.plays?.toLocaleString?.() || game.plays} plays</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Controls Helper Toggle */}
            <button
              onClick={() => setShowControls(!showControls)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                showControls
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Controls</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={(e) => onToggleFavorite(game.id, e)}
              title={isFavorite ? "Remove favorite" : "Add to favorites"}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-colors"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Reload Iframe */}
            <button
              onClick={handleReloadIframe}
              title="Restart Game"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              title={isTheater ? "Normal Size" : "Theater Mode"}
              className="hidden sm:flex p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              {isTheater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleFullscreenToggle}
              title="Fullscreen"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Main Player Screen Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Active Iframe */}
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={resolvedUrl}
            title={game.title}
            className="w-full h-full border-0 bg-transparent"
            allow="autoplay; fullscreen; gamepad; focus-without-user-activation; pointer-lock"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
            onLoad={() => {
              if (iframeRef.current) {
                try { iframeRef.current.focus(); } catch (e) {}
              }
            }}
          />

          {/* Controls Overlay Drawer */}
          {showControls && (
            <div className="absolute top-4 right-4 z-20 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Keyboard className="w-4 h-4 text-emerald-400" />
                  <span>KEYBOARD & GAME CONTROLS</span>
                </div>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {game.controls?.map((ctrl, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{ctrl.action}</span>
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-[11px] text-emerald-400 font-semibold shadow-inner">
                      {ctrl.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Click inside game to focus</span>
                <span className="font-mono text-slate-400">Esc to close</span>
              </div>
            </div>
          )}
        </div>

        {/* Player Bottom Bar */}
        <div className="bg-[#090D18] px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Source:</span>
            <code className="text-[11px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {resolvedUrl}
            </code>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Open raw in new tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
