import type { Title, TasteProfile } from '../types';

const PROFILE_KEY = 'wwg.tasteProfile.v1';
const WATCHLIST_KEY = 'wwg.watchlist.v1';
const LOVED_KEY = 'wwg.loved.v1';

export function emptyProfile(): TasteProfile {
  return {
    genreWeights: {},
    keywordWeights: {},
    seenIds: [],
    swipes: [],
    onboarded: false,
    favoriteGenreIds: [],
  };
}

export function loadProfile(): TasteProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile();
    return { ...emptyProfile(), ...JSON.parse(raw) };
  } catch {
    return emptyProfile();
  }
}

export function saveProfile(profile: TasteProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function loadTitleList(key: string): Title[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Title[]) : [];
  } catch {
    return [];
  }
}

function saveTitleList(key: string, list: Title[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function loadWatchlist(): Title[] {
  return loadTitleList(WATCHLIST_KEY);
}

export function addToWatchlist(title: Title) {
  const list = loadWatchlist();
  if (!list.some((t) => t.id === title.id && t.mediaType === title.mediaType)) {
    saveTitleList(WATCHLIST_KEY, [title, ...list]);
  }
}

export function removeFromWatchlist(id: number, mediaType: string) {
  const list = loadWatchlist().filter((t) => !(t.id === id && t.mediaType === mediaType));
  saveTitleList(WATCHLIST_KEY, list);
}

export function loadLoved(): Title[] {
  return loadTitleList(LOVED_KEY);
}

export function addToLoved(title: Title) {
  const list = loadLoved();
  if (!list.some((t) => t.id === title.id && t.mediaType === title.mediaType)) {
    saveTitleList(LOVED_KEY, [title, ...list]);
  }
}

export function resetAll() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(WATCHLIST_KEY);
  localStorage.removeItem(LOVED_KEY);
}
