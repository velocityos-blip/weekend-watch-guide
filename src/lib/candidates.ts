import type { TasteProfile, Title, Mood } from '../types';
import { decayedGenreWeights, rankTitles } from './tasteEngine';
import { discover, getTrending } from './tmdb';

function dedupe(titles: Title[]): Title[] {
  return Array.from(new Map(titles.map((t) => [`${t.mediaType}-${t.id}`, t])).values());
}

function topPositiveGenreIds(profile: TasteProfile, limit = 4): number[] {
  const weights = decayedGenreWeights(profile);
  return Object.entries(weights)
    .filter(([, w]) => w > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => Number(id));
}

export async function fetchCandidatePool(profile: TasteProfile): Promise<Title[]> {
  const favored = topPositiveGenreIds(profile);

  const requests: Promise<Title[]>[] = [
    getTrending('movie', 'week'),
    getTrending('tv', 'week'),
    getTrending('movie', 'day'),
  ];

  if (favored.length > 0) {
    requests.push(
      discover('movie', { genreIds: favored, sortBy: 'popularity.desc' }),
      discover('tv', { genreIds: favored, sortBy: 'popularity.desc' }),
      discover('movie', { genreIds: favored, sortBy: 'vote_average.desc', minVoteCount: 300 }),
    );
  } else {
    requests.push(discover('movie', { sortBy: 'popularity.desc' }), discover('tv', { sortBy: 'popularity.desc' }));
  }

  const results = await Promise.allSettled(requests);
  const titles = results.filter((r): r is PromiseFulfilledResult<Title[]> => r.status === 'fulfilled').flatMap((r) => r.value);

  return rankTitles(profile, dedupe(titles));
}

export async function fetchMoodPool(profile: TasteProfile, mood: Mood): Promise<Title[]> {
  const [movies, tv] = await Promise.allSettled([
    discover('movie', { genreIds: mood.movieGenreIds, sortBy: 'popularity.desc' }),
    discover('tv', { genreIds: mood.tvGenreIds, sortBy: 'popularity.desc' }),
  ]);
  const titles = [
    ...(movies.status === 'fulfilled' ? movies.value : []),
    ...(tv.status === 'fulfilled' ? tv.value : []),
  ];
  return rankTitles(profile, dedupe(titles));
}
