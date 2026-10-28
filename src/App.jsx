import React, { useState, useEffect, useMemo } from 'react';
import initialGamesData from './data/games.json';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayerModal } from './components/GamePlayerModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { StealthDecoy } from './components/StealthDecoy.jsx';
import { Footer } from './components/Footer.jsx';
import {
  Play,
  Star,
  Search,
  ArrowUpDown,
  History,
  Gamepad2
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('vault_custom_games');
      const customList = savedCustom ? JSON.parse(savedCustom) : [];
      return [...initialGamesData, ...customList];
    } catch {
      return initialGamesData;
    }
  });

  const [activeGame, setActiveGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStealthOpen, setIsStealthOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_favorites');
      return saved ? JSON.parse(saved) : ['snake', 'tetris'];
    } catch {
      return ['snake', 'tetris'];
    }
  });

  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === ']') {
        setIsStealthOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('vault_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handlePlayGame = (game) => {
    setActiveGame(game);
    setRecentlyPlayedIds((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      const next = [game.id, ...filtered].slice(0, 6);
      localStorage.setItem('vault_recent', JSON.stringify(next));
      return next;
    });
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, plays: g.plays + 1 } : g))
    );
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.id.startsWith('custom-'));
      localStorage.setItem('vault_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    setActiveGame(newGame);
  };

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = game.title?.toLowerCase().includes(q);
          const matchesCategory = game.category?.toLowerCase().includes(q);
          const matchesDesc = game.description?.toLowerCase().includes(q);
          const matchesTags = game.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesTags) {
            return false;
          }
        }

        if (selectedCategory === 'Favorites') {
          return favorites.includes(game.id);
        }
        if (selectedCategory !== 'All' && game.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, searchQuery, selectedCategory, favorites, sortBy]);

  const featuredGame = useMemo(() => {
    return games.find((g) => g.id === 'tetris') || games[0];
  }, [games]);

  const recentGames = useMemo(() => {
    return recentlyPlayedIds
      .map((id) => games.find((g) => g.id === id))
      .filter(Boolean);
  }, [recentlyPlayedIds, games]);

  const categories = ['All', 'Arcade', 'Puzzle', 'Action', 'Retro', 'Favorites'];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar
        onAddGameClick={() => setIsAddModalOpen(true)}
        onStealthClick={() => setIsStealthOpen(true)}
        onFavoritesClick={() => setSelectedCategory('Favorites')}
        onAllGamesClick={() => {
          setSelectedCategory('All');
          setSearchQuery('');
        }}
        onCategoryClick={(cat) => setSelectedCategory(cat)}
        favoritesCount={favorites.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {!searchQuery && selectedCategory === 'All' && featuredGame && (
          <section className="relative rounded-2xl bg-[#0D1424] border border-slate-800/80 overflow-hidden mb-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                    <span className="text-emerald-400">{featuredGame.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {featuredGame.plays?.toLocaleString?.() || featuredGame.plays} plays
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display mb-4 leading-tight">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-6">
                    {featuredGame.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/60">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handlePlayGame(featuredGame)}
                      className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Now</span>
                    </button>

                    <button
                      onClick={(e) => toggleFavorite(featuredGame.id, e)}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(featuredGame.id)
                            ? 'fill-amber-400 text-amber-400'
                            : ''
                        }`}
                      />
                      <span>Favorite</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-medium text-slate-500">Controls:</span>
                    <span className="font-mono text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {featuredGame.controls?.[0]?.key}: {featuredGame.controls?.[0]?.action}
                    </span>
                    {featuredGame.controls?.[1] && (
                      <span className="font-mono text-slate-400 hidden sm:inline bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        {featuredGame.controls[1].key}: {featuredGame.controls[1].action}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-950">
                {featuredGame.thumbnail && (
                  <img
                    src={featuredGame.thumbnail}
                    alt={featuredGame.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover lg:absolute lg:inset-0 opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D1424] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </section>
        )}

        {recentGames.length > 0 && !searchQuery && selectedCategory === 'All' && (
          <section className="mb-10">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jump Back In</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {recentGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handlePlayGame(game)}
                  className="bg-[#0B101E] hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 text-left transition-all duration-150 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                    {game.thumbnail ? (
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gamepad2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {game.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {cat === 'Favorites' ? `★ Favorites (${favorites.length})` : cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            </span>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Played</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
                <option value="az">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B101D] p-12 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white font-display mb-1">
              No unblocked games found
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {searchQuery
                ? `No games match the query "${searchQuery}". Try another keyword or add a new game.`
                : 'No games in this category yet.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer
        totalGames={games.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <GamePlayerModal
        game={activeGame}
        onClose={() => setActiveGame(null)}
        isFavorite={activeGame ? favorites.includes(activeGame.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
        allGames={games}
      />

      <StealthDecoy
        isOpen={isStealthOpen}
        onExit={() => setIsStealthOpen(false)}
      />
    </div>
  );
}
