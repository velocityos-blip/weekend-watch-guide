import type { Mood } from '../types';

export const MOODS: Mood[] = [
  { id: 'cozy', label: 'Cozy night in', emoji: '🛋️', movieGenreIds: [10749, 35], tvGenreIds: [35] },
  { id: 'edge-of-seat', label: 'Edge of my seat', emoji: '😬', movieGenreIds: [53, 9648], tvGenreIds: [9648, 80] },
  { id: 'laugh', label: 'Make me laugh', emoji: '😂', movieGenreIds: [35], tvGenreIds: [35] },
  { id: 'cry', label: 'Ugly cry', emoji: '😭', movieGenreIds: [18], tvGenreIds: [18] },
  { id: 'scared', label: 'Scare me', emoji: '👻', movieGenreIds: [27], tvGenreIds: [9648] },
  { id: 'mind-bend', label: 'Mind-bending', emoji: '🌀', movieGenreIds: [878, 9648], tvGenreIds: [10765] },
  { id: 'epic', label: 'Epic adventure', emoji: '⚔️', movieGenreIds: [12, 14], tvGenreIds: [10759] },
  { id: 'true-story', label: 'True stories', emoji: '📽️', movieGenreIds: [99, 36], tvGenreIds: [99] },
];

export const GENRE_ID_TO_MOVIE_ICON: Record<number, string> = {
  28: '💥',
  12: '🧭',
  16: '🎨',
  35: '😂',
  80: '🕵️',
  99: '📽️',
  18: '🎭',
  10751: '👨‍👩‍👧',
  14: '🪄',
  36: '🏛️',
  27: '👻',
  10402: '🎵',
  9648: '🔍',
  10749: '💘',
  878: '👽',
  10770: '📺',
  53: '😬',
  10752: '🎖️',
  37: '🤠',
};
