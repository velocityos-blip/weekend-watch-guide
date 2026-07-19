import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Heart, Star, ThumbsDown } from 'lucide-react';
import { backdropUrl, getDetails, getSimilar, posterUrl } from '../lib/tmdb';
import type { MediaType, Title, TitleDetails } from '../types';
import { useApp } from '../context/AppContext';
import { rankTitles } from '../lib/tasteEngine';
import { Loading } from '../components/Loading';
import { ConfigNotice } from '../components/ConfigNotice';
import { PosterCard } from '../components/PosterCard';

export function TitleDetail() {
  const { mediaType, id } = useParams<{ mediaType: MediaType; id: string }>();
  const navigate = useNavigate();
  const { profile, swipe, markLoved, toggleWatchlist, isInWatchlist } = useApp();
  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [similar, setSimilar] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaType || !id) return;
    setLoading(true);
    Promise.all([getDetails(mediaType, Number(id)), getSimilar(mediaType, Number(id))])
      .then(([d, s]) => {
        setDetails(d);
        setSimilar(s);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load title'))
      .finally(() => setLoading(false));
  }, [mediaType, id]);

  if (error) return <ConfigNotice message={error} />;
  if (loading || !details) return <Loading label="Loading title…" />;

  const saved = isInWatchlist(details);
  const backdrop = backdropUrl(details.backdropPath, 'w780');
  const poster = posterUrl(details.posterPath, 'w342');
  const year = details.releaseDate ? details.releaseDate.slice(0, 4) : '';
  const rankedSimilar = rankTitles(profile, similar).slice(0, 9);

  const backButton = (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Back"
      className="rounded-full bg-black/60 p-2 text-white backdrop-blur"
    >
      <ArrowLeft size={18} />
    </button>
  );

  return (
    <div className="-mx-4 -mt-4">
      {backdrop ? (
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <img src={backdrop} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute left-4 top-4 z-10">{backButton}</div>
        </div>
      ) : (
        <div className="px-4 pt-4">{backButton}</div>
      )}

      <div className="px-4">
        <div className={`flex gap-4 ${backdrop ? '-mt-16 sm:-mt-20' : 'pt-4'}`}>
          {poster && <img src={poster} alt={details.title} className="w-28 shrink-0 rounded-lg border border-border shadow-xl sm:w-36" />}
          <div className="flex flex-1 flex-col justify-end pb-1">
            <h1 className="text-xl font-bold text-text sm:text-2xl">{details.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{year}</span>
              {details.runtime && <span>· {details.runtime} min</span>}
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-brand text-brand" />
                {details.voteAverage.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {details.genres.map((g) => (
            <span key={g.id} className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-muted">
              {g.name}
            </span>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => {
              swipe(details, 'like');
              markLoved(details);
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-400/50 bg-panel py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-400/10"
          >
            <Heart size={16} /> Loved it
          </button>
          <button
            type="button"
            onClick={() => swipe(details, 'dislike')}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-rose-400/50 bg-panel py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-400/10"
          >
            <ThumbsDown size={16} /> Not for me
          </button>
          <button
            type="button"
            onClick={() => toggleWatchlist(details)}
            aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
            className="flex items-center justify-center gap-2 rounded-full border border-brand/50 bg-panel px-4 py-2.5 text-sm font-medium text-brand hover:bg-brand/10"
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">{details.overview}</p>

        {details.providers.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-semibold text-text">Stream on</h2>
            <div className="flex flex-wrap gap-2">
              {details.providers.map((p) => (
                <span key={p.name} className="rounded-full bg-panel-2 px-3 py-1 text-xs text-muted">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {details.cast.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-1 text-sm font-semibold text-text">Cast</h2>
            <p className="text-sm text-muted">{details.cast.join(', ')}</p>
          </div>
        )}
        {details.director.length > 0 && (
          <div className="mt-3">
            <h2 className="mb-1 text-sm font-semibold text-text">
              {mediaType === 'movie' ? 'Director' : 'Creator'}
            </h2>
            <p className="text-sm text-muted">{details.director.join(', ')}</p>
          </div>
        )}

        {rankedSimilar.length > 0 && (
          <div className="mt-8 pb-4">
            <h2 className="mb-3 text-lg font-semibold text-text">More like this</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rankedSimilar.map((t) => (
                <PosterCard key={`${t.mediaType}-${t.id}`} title={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
