import type { Genre, MediaType, Title, TitleDetails, WatchProvider } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined;

export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'original' = 'w342') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: 'w780' | 'original' = 'w780') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export class TmdbConfigError extends Error {}

async function tmdb<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  if (!API_KEY && !READ_TOKEN) {
    throw new TmdbConfigError(
      'Missing TMDB credentials. Set VITE_TMDB_API_KEY (or VITE_TMDB_READ_TOKEN) in a .env file.',
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  if (API_KEY && !READ_TOKEN) url.searchParams.set('api_key', API_KEY);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : undefined,
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed (${res.status}): ${path}`);
  }
  return res.json() as Promise<T>;
}

function mapResult(raw: any, mediaType: MediaType): Title | null {
  const title = mediaType === 'movie' ? raw.title : raw.name;
  const releaseDate = mediaType === 'movie' ? raw.release_date : raw.first_air_date;
  if (!title || !raw.id) return null;
  return {
    id: raw.id,
    mediaType,
    title,
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: releaseDate ?? '',
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    genreIds: raw.genre_ids ?? [],
    popularity: raw.popularity ?? 0,
    originalLanguage: raw.original_language ?? '',
  };
}

function mapListResponse(raw: any, mediaType: MediaType): Title[] {
  const results = Array.isArray(raw?.results) ? raw.results : [];
  return results
    .map((r: any) => mapResult(r, mediaType))
    .filter((t: Title | null): t is Title => t !== null);
}

export async function getGenres(mediaType: MediaType): Promise<Genre[]> {
  const raw = await tmdb<{ genres: Genre[] }>(`/genre/${mediaType}/list`);
  return raw.genres;
}

export async function getTrending(mediaType: MediaType, window: 'day' | 'week' = 'week', page = 1) {
  const raw = await tmdb<any>(`/trending/${mediaType}/${window}`, { page });
  return mapListResponse(raw, mediaType);
}

export interface DiscoverParams {
  genreIds?: number[];
  excludeGenreIds?: number[];
  minVoteCount?: number;
  minVoteAverage?: number;
  sortBy?: string;
  page?: number;
  withKeywords?: string;
}

export async function discover(mediaType: MediaType, params: DiscoverParams = {}): Promise<Title[]> {
  const raw = await tmdb<any>(`/discover/${mediaType}`, {
    with_genres: params.genreIds?.join(','),
    without_genres: params.excludeGenreIds?.join(','),
    'vote_count.gte': params.minVoteCount ?? 50,
    'vote_average.gte': params.minVoteAverage,
    sort_by: params.sortBy ?? 'popularity.desc',
    with_keywords: params.withKeywords,
    page: params.page ?? 1,
    include_adult: 'false',
  });
  return mapListResponse(raw, mediaType);
}

export async function searchMulti(query: string, page = 1): Promise<Title[]> {
  const raw = await tmdb<any>('/search/multi', { query, page, include_adult: 'false' });
  const results = Array.isArray(raw?.results) ? raw.results : [];
  return results
    .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
    .map((r: any) => mapResult(r, r.media_type))
    .filter((t: Title | null): t is Title => t !== null);
}

export async function getSimilar(mediaType: MediaType, id: number): Promise<Title[]> {
  const raw = await tmdb<any>(`/${mediaType}/${id}/similar`);
  return mapListResponse(raw, mediaType);
}

export async function getRecommendations(mediaType: MediaType, id: number): Promise<Title[]> {
  const raw = await tmdb<any>(`/${mediaType}/${id}/recommendations`);
  return mapListResponse(raw, mediaType);
}

export async function getDetails(mediaType: MediaType, id: number): Promise<TitleDetails> {
  const raw = await tmdb<any>(`/${mediaType}/${id}`, {
    append_to_response: 'keywords,credits,watch/providers',
  });
  const base = mapResult(raw, mediaType)!;
  const keywordList = mediaType === 'movie' ? raw.keywords?.keywords : raw.keywords?.results;
  const cast = (raw.credits?.cast ?? []).slice(0, 6).map((c: any) => c.name);
  const director =
    mediaType === 'movie'
      ? (raw.credits?.crew ?? []).filter((c: any) => c.job === 'Director').map((c: any) => c.name)
      : (raw.created_by ?? []).map((c: any) => c.name);
  const providers: WatchProvider[] = (raw['watch/providers']?.results?.US?.flatrate ?? []).map((p: any) => ({
    name: p.provider_name,
    logoPath: p.logo_path ?? null,
  }));

  return {
    ...base,
    genres: raw.genres ?? [],
    runtime: raw.runtime ?? raw.episode_run_time?.[0] ?? null,
    keywords: (keywordList ?? []).map((k: any) => k.name),
    cast,
    director,
    providers,
  };
}
