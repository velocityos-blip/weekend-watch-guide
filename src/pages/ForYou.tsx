import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchCandidatePool, fetchMoodPool } from '../lib/candidates';
import { explainRecommendation, matchPercent, topGenres } from '../lib/tasteEngine';
import { MOODS } from '../lib/moods';
import type { Title } from '../types';
import { PosterCard } from '../components/PosterCard';
import { Loading } from '../components/Loading';
import { ConfigNotice } from '../components/ConfigNotice';

export function ForYou() {
  const { profile, genres } = useApp();
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const load = async (moodId: string | null) => {
    setLoading(true);
    try {
      const mood = MOODS.find((m) => m.id === moodId);
      const pool = mood ? await fetchMoodPool(profile, mood) : await fetchCandidatePool(profile);
      setTitles(pool.slice(0, 24));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(activeMood);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMood]);

  if (error) return <ConfigNotice message={error} />;

  const favoriteGenres = topGenres(profile, genres, 3);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">For You</h1>
        {favoriteGenres.length > 0 ? (
          <p className="text-sm text-muted">
            Tuned to your love of {favoriteGenres.map((g) => g.name).join(', ')}
          </p>
        ) : (
          <p className="text-sm text-muted">Swipe a few titles in Discover to sharpen these picks.</p>
        )}
      </div>

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveMood(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
            activeMood === null ? 'border-brand bg-brand text-ink' : 'border-border bg-panel text-muted'
          }`}
        >
          ✨ Top picks
        </button>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            onClick={() => setActiveMood(mood.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
              activeMood === mood.id ? 'border-brand bg-brand text-ink' : 'border-border bg-panel text-muted'
            }`}
          >
            {mood.emoji} {mood.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading label="Ranking your picks…" />
      ) : titles.length === 0 ? (
        <p className="py-10 text-center text-muted">Nothing here yet — try another mood.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {titles.map((title) => (
            <PosterCard
              key={`${title.mediaType}-${title.id}`}
              title={title}
              subtitle={`${matchPercent(profile, title)}% match · ${explainRecommendation(profile, title, genres)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
