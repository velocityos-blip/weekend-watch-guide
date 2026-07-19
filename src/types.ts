export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface Title {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  popularity: number;
  originalLanguage: string;
}

export interface TitleDetails extends Title {
  genres: Genre[];
  runtime: number | null;
  keywords: string[];
  cast: string[];
  director: string[];
  providers: WatchProvider[];
}

export interface WatchProvider {
  name: string;
  logoPath: string | null;
}

export type SwipeAction = 'like' | 'dislike' | 'skip' | 'watchlist';

export interface SwipeRecord {
  titleId: number;
  mediaType: MediaType;
  action: SwipeAction;
  at: number;
  genreIds: number[];
}

export interface TasteProfile {
  genreWeights: Record<number, number>;
  keywordWeights: Record<string, number>;
  seenIds: number[];
  swipes: SwipeRecord[];
  onboarded: boolean;
  favoriteGenreIds: number[];
}

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  movieGenreIds: number[];
  tvGenreIds: number[];
}
