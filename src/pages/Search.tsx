import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { searchMulti } from '../lib/tmdb';
import type { Title } from '../types';
import { PosterCard } from '../components/PosterCard';
import { Loading } from '../components/Loading';
import { ConfigNotice } from '../components/ConfigNotice';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await searchMulti(trimmed);
        setResults(res);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  if (error) return <ConfigNotice message={error} />;

  return (
    <div>
      <div className="relative mb-5">
        <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies & shows…"
          className="w-full rounded-full border border-border bg-panel py-2.5 pl-10 pr-4 text-sm text-text outline-none focus:border-brand"
        />
      </div>

      {loading && <Loading label="Searching…" />}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <p className="py-10 text-center text-muted">No matches for "{query}"</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {results.map((title) => (
          <PosterCard key={`${title.mediaType}-${title.id}`} title={title} />
        ))}
      </div>
    </div>
  );
}
