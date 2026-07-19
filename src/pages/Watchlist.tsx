import { useApp } from '../context/AppContext';
import { PosterCard } from '../components/PosterCard';

export function Watchlist() {
  const { watchlist, loved } = useApp();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-3 text-xl font-bold text-text">Watchlist</h1>
        {watchlist.length === 0 ? (
          <p className="text-muted text-sm">
            Nothing saved yet. Bookmark titles while swiping or browsing For You.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {watchlist.map((title) => (
              <PosterCard key={`${title.mediaType}-${title.id}`} title={title} />
            ))}
          </div>
        )}
      </div>

      {loved.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-text">Loved</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {loved.map((title) => (
              <PosterCard key={`${title.mediaType}-${title.id}`} title={title} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
