import { useEffect, useRef, useState } from 'react';
import { Heart, RotateCcw, X, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchCandidatePool } from '../lib/candidates';
import type { SwipeAction, Title } from '../types';
import { SwipeCard } from '../components/SwipeCard';
import { Loading } from '../components/Loading';
import { ConfigNotice } from '../components/ConfigNotice';

const REFILL_THRESHOLD = 3;

export function Discover() {
  const { profile, swipe, markLoved, toggleWatchlist, isInWatchlist } = useApp();
  const [queue, setQueue] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRemoved, setLastRemoved] = useState<{ title: Title; action: SwipeAction } | null>(null);
  const loadingMore = useRef(false);

  const loadPool = async (initial = false) => {
    if (loadingMore.current) return;
    loadingMore.current = true;
    if (initial) setLoading(true);
    try {
      const pool = await fetchCandidatePool(profile);
      setError(null);
      setQueue((prev) => {
        const existingIds = new Set(prev.map((t) => `${t.mediaType}-${t.id}`));
        const fresh = pool.filter((t) => !existingIds.has(`${t.mediaType}-${t.id}`));
        return [...prev, ...fresh];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      loadingMore.current = false;
      if (initial) setLoading(false);
    }
  };

  useEffect(() => {
    loadPool(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (queue.length <= REFILL_THRESHOLD && !loading) loadPool(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length, loading]);

  const decide = (title: Title, action: SwipeAction) => {
    swipe(title, action);
    if (action === 'like') markLoved(title);
    if (action === 'watchlist') toggleWatchlist(title);
    setLastRemoved({ title, action });
    setQueue((prev) => prev.filter((t) => !(t.id === title.id && t.mediaType === title.mediaType)));
  };

  const undo = () => {
    if (!lastRemoved) return;
    setQueue((prev) => [lastRemoved.title, ...prev]);
    setLastRemoved(null);
  };

  if (error) return <ConfigNotice message={error} />;
  if (loading) return <Loading label="Finding great picks for you…" />;

  const visible = queue.slice(0, 3);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center text-sm text-muted">Swipe right to like, left to skip.</p>

      <div className="relative h-[68vh] w-full max-w-sm">
        {visible.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-center text-muted">
            <p>You're all caught up.</p>
            <p className="text-xs">Check back later for fresh picks.</p>
          </div>
        ) : (
          visible
            .slice()
            .reverse()
            .map((title, idx) => {
              const isTop = idx === visible.length - 1;
              return (
                <div
                  key={`${title.mediaType}-${title.id}`}
                  style={{
                    transform: isTop ? undefined : `translateY(${(visible.length - 1 - idx) * 8}px) scale(${1 - (visible.length - 1 - idx) * 0.03})`,
                    zIndex: idx,
                  }}
                  className="absolute inset-0"
                >
                  <SwipeCard title={title} active={isTop} onDecide={(action) => decide(title, action)} />
                </div>
              );
            })
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={undo}
          disabled={!lastRemoved}
          aria-label="Undo"
          className="rounded-full border border-border bg-panel p-3 text-muted transition hover:text-text disabled:opacity-30"
        >
          <RotateCcw size={20} />
        </button>
        <button
          type="button"
          onClick={() => visible[visible.length - 1] && decide(visible[visible.length - 1], 'dislike')}
          disabled={visible.length === 0}
          aria-label="Dislike"
          className="rounded-full border border-rose-400/50 bg-panel p-4 text-rose-400 transition hover:bg-rose-400/10 disabled:opacity-30"
        >
          <X size={26} />
        </button>
        <button
          type="button"
          onClick={() => {
            const top = visible[visible.length - 1];
            if (top) decide(top, isInWatchlist(top) ? 'skip' : 'watchlist');
          }}
          disabled={visible.length === 0}
          aria-label="Save for later"
          className="rounded-full border border-brand/50 bg-panel p-3 text-brand transition hover:bg-brand/10 disabled:opacity-30"
        >
          <Bookmark size={20} />
        </button>
        <button
          type="button"
          onClick={() => visible[visible.length - 1] && decide(visible[visible.length - 1], 'like')}
          disabled={visible.length === 0}
          aria-label="Like"
          className="rounded-full border border-emerald-400/50 bg-panel p-4 text-emerald-400 transition hover:bg-emerald-400/10 disabled:opacity-30"
        >
          <Heart size={26} />
        </button>
      </div>
    </div>
  );
}
