import React, { useState } from 'react';
import { X, Plus, Download, FileJson, Check } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
  allGames,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [iframeInput, setIframeInput] = useState('');
  const [controlsKey, setControlsKey] = useState('Arrow Keys');
  const [controlsAction, setControlsAction] = useState('Move');
  const [tagsInput, setTagsInput] = useState('Unblocked, Web Game');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }

    let src = iframeInput.trim();
    if (!src) {
      setError('Please provide an iframe URL or embed code.');
      return;
    }

    if (src.includes('<iframe') && src.includes('src=')) {
      const match = src.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        src = match[1];
      }
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim() || 'Custom added unblocked web game.',
      iframeSrc: src,
      thumbnail: '',
      controls: [
        { key: controlsKey.trim() || 'Keyboard', action: controlsAction.trim() || 'Play' }
      ],
      rating: 5.0,
      plays: 1,
      releaseYear: 2026,
      badge: 'Custom',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onAddGame(newGame);
    onClose();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allGames, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(allGames, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#0D1424] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#090D18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white font-display">
              Add Iframe Game to JSON Catalog
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Slope Runner, Drift Hunters, Retro Kart"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Classic">Classic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Unblocked, 3D, Skill"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Iframe Source URL or &lt;iframe&gt; code *
            </label>
            <textarea
              rows={3}
              placeholder="https://... or /games/custom.html or <iframe src='...'></iframe>"
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Supports any unblocked embed link or relative HTML file path.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief description of gameplay mechanics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Key Control
              </label>
              <input
                type="text"
                placeholder="Arrow Keys / WASD"
                value={controlsKey}
                onChange={(e) => setControlsKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Key Action
              </label>
              <input
                type="text"
                placeholder="Steer / Jump"
                value={controlsAction}
                onChange={(e) => setControlsAction(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadJson}
                title="Download current games.json"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={handleCopyJson}
                title="Copy JSON to clipboard"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileJson className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors"
              >
                Save & Add Game
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
