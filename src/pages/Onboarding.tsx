import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfigNotice } from '../components/ConfigNotice';
import { Loading } from '../components/Loading';

const CURATED_GENRE_IDS = [28, 12, 35, 18, 27, 10749, 878, 53, 16, 99, 9648, 10759, 10765, 80];

export function Onboarding() {
  const { genres, genresError, completeOnboarding } = useApp();
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();

  if (genresError) {
    const message = genresError.includes('Missing TMDB')
      ? genresError
      : 'Could not load genres from TMDB. Check your API key and network connection.';
    return <ConfigNotice message={message} />;
  }

  if (genres.length === 0) return <Loading label="Warming up the projector…" />;

  const curated = CURATED_GENRE_IDS.map((id) => genres.find((g) => g.id === id)).filter(
    (g): g is (typeof genres)[number] => Boolean(g),
  );

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  const submit = () => {
    completeOnboarding(selected);
    navigate('/discover');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pt-10 text-center">
      <Clapperboard size={40} className="text-brand" />
      <h1 className="mt-4 text-2xl font-bold text-text">Let's learn your taste</h1>
      <p className="mt-2 text-sm text-muted">
        Pick a few genres you love. You'll fine-tune it further as you swipe — no account needed.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {curated.map((genre) => {
          const active = selected.includes(genre.id);
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggle(genre.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'border-brand bg-brand text-ink'
                  : 'border-border bg-panel text-text hover:border-brand/60'
              }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={selected.length < 2}
        onClick={submit}
        className="mt-8 w-full rounded-full bg-brand py-3 font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selected.length < 2 ? 'Pick at least 2 genres' : 'Start swiping'}
      </button>
      <button type="button" onClick={() => navigate('/discover')} className="mt-3 text-xs text-muted underline">
        Skip for now
      </button>
    </div>
  );
}
