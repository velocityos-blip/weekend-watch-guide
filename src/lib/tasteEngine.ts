import type { Genre, SwipeAction, TasteProfile, Title } from '../types';

const WEIGHT_BY_ACTION: Record<SwipeAction, number> = {
  like: 3,
  watchlist: 4,
  dislike: -2.5,
  skip: -0.4,
};

const MAX_WEIGHT = 20;
const MIN_WEIGHT = -10;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function applyOnboarding(profile: TasteProfile, favoriteGenreIds: number[]): TasteProfile {
  const genreWeights = { ...profile.genreWeights };
  for (const id of favoriteGenreIds) {
    genreWeights[id] = clamp((genreWeights[id] ?? 0) + 5, MIN_WEIGHT, MAX_WEIGHT);
  }
  return { ...profile, genreWeights, favoriteGenreIds, onboarded: true };
}

export function recordSwipe(profile: TasteProfile, title: Title, action: SwipeAction): TasteProfile {
  const genreWeights = { ...profile.genreWeights };
  const delta = WEIGHT_BY_ACTION[action];
  for (const genreId of title.genreIds) {
    genreWeights[genreId] = clamp((genreWeights[genreId] ?? 0) + delta, MIN_WEIGHT, MAX_WEIGHT);
  }

  const seenIds = profile.seenIds.includes(title.id) ? profile.seenIds : [...profile.seenIds, title.id];
  const swipes = [
    ...profile.swipes,
    { titleId: title.id, mediaType: title.mediaType, action, at: Date.now(), genreIds: title.genreIds },
  ].slice(-500);

  return { ...profile, genreWeights, seenIds, swipes };
}

/**
 * Lightweight recency decay so very old signals slowly matter less than
 * the last few dozen swipes, without a backend to run real model training.
 */
export function decayedGenreWeights(profile: TasteProfile): Record<number, number> {
  const recentSwipes = profile.swipes.slice(-200);
  const weights: Record<number, number> = {};
  recentSwipes.forEach((swipe, index) => {
    const recencyBoost = 0.5 + (index / Math.max(recentSwipes.length, 1)) * 0.5;
    const delta = WEIGHT_BY_ACTION[swipe.action] * recencyBoost;
    for (const genreId of swipe.genreIds) {
      weights[genreId] = (weights[genreId] ?? 0) + delta;
    }
  });
  for (const id of profile.favoriteGenreIds) {
    weights[id] = (weights[id] ?? 0) + 5;
  }
  return weights;
}

export function scoreTitle(profile: TasteProfile, title: Title): number {
  const weights = decayedGenreWeights(profile);
  const genreScore = title.genreIds.reduce((sum, id) => sum + (weights[id] ?? 0), 0);
  const qualityScore = (title.voteAverage / 10) * 4 * Math.min(1, title.voteCount / 200);
  const popularityScore = Math.log10(Math.max(title.popularity, 1)) * 0.6;
  return genreScore + qualityScore + popularityScore;
}

export function rankTitles(profile: TasteProfile, titles: Title[]): Title[] {
  const unseen = titles.filter((t) => !profile.seenIds.includes(t.id));
  const deduped = Array.from(new Map(unseen.map((t) => [`${t.mediaType}-${t.id}`, t])).values());
  return deduped.sort((a, b) => scoreTitle(profile, b) - scoreTitle(profile, a));
}

export function topGenres(profile: TasteProfile, genres: Genre[], count = 3): Genre[] {
  const weights = decayedGenreWeights(profile);
  return genres
    .filter((g) => (weights[g.id] ?? 0) > 0)
    .sort((a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0))
    .slice(0, count);
}

export function matchPercent(profile: TasteProfile, title: Title): number {
  const score = scoreTitle(profile, title);
  const normalized = 50 + score * 3.5;
  return Math.round(clamp(normalized, 35, 99));
}

export function explainRecommendation(profile: TasteProfile, title: Title, genres: Genre[]): string {
  const weights = decayedGenreWeights(profile);
  const bestGenre = title.genreIds
    .map((id) => ({ id, weight: weights[id] ?? 0 }))
    .sort((a, b) => b.weight - a.weight)[0];

  if (bestGenre && bestGenre.weight > 1) {
    const genre = genres.find((g) => g.id === bestGenre.id);
    if (genre) return `Because you like ${genre.name}`;
  }
  if (title.voteAverage >= 7.5) return 'Highly rated pick';
  return 'Trending right now';
}
