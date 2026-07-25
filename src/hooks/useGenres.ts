import { useEffect, useState } from 'react';
import type { Genre } from '../types';
import { getGenres } from '../lib/tmdb';

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([getGenres('movie'), getGenres('tv')]);
        if (cancelled) return;
        const merged = new Map<number, Genre>();
        for (const g of [...movieGenres, ...tvGenres]) merged.set(g.id, g);
        setGenres(Array.from(merged.values()));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load genres');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { genres, error };
}
