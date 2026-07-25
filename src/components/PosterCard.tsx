import { Link } from 'react-router-dom';
import { Star, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Title } from '../types';
import { posterUrl } from '../lib/tmdb';
import { useApp } from '../context/AppContext';

interface Props {
  title: Title;
  subtitle?: string;
}

export function PosterCard({ title, subtitle }: Props) {
  const { toggleWatchlist, isInWatchlist } = useApp();
  const year = title.releaseDate ? title.releaseDate.slice(0, 4) : '—';
  const poster = posterUrl(title.posterPath, 'w342');
  const saved = isInWatchlist(title);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-panel border border-border">
      <Link to={`/title/${title.mediaType}/${title.id}`} className="block aspect-[2/3] overflow-hidden bg-panel-2">
        {poster ? (
          <img
            src={poster}
            alt={title.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted p-2 text-center">
            {title.title}
          </div>
        )}
      </Link>
      <button
        type="button"
        onClick={() => toggleWatchlist(title)}
        aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur transition hover:bg-black/80"
      >
        {saved ? <BookmarkCheck size={16} className="text-brand" /> : <Bookmark size={16} />}
      </button>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/title/${title.mediaType}/${title.id}`} className="line-clamp-1 text-sm font-semibold text-text">
          {title.title}
        </Link>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{year}</span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-brand text-brand" />
            {title.voteAverage ? title.voteAverage.toFixed(1) : '—'}
          </span>
        </div>
        {subtitle && <span className="line-clamp-2 text-xs text-brand-2">{subtitle}</span>}
      </div>
    </div>
  );
}
