import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Title } from '../types';
import { useTasteProfile } from '../hooks/useTasteProfile';
import { useGenres } from '../hooks/useGenres';
import { addToLoved, addToWatchlist, loadLoved, loadWatchlist, removeFromWatchlist } from '../lib/storage';

interface AppContextValue extends ReturnType<typeof useTasteProfile> {
  genres: ReturnType<typeof useGenres>['genres'];
  genresError: string | null;
  watchlist: Title[];
  loved: Title[];
  toggleWatchlist: (title: Title) => void;
  isInWatchlist: (title: Title) => boolean;
  markLoved: (title: Title) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const tasteProfile = useTasteProfile();
  const { genres, error: genresError } = useGenres();
  const [watchlist, setWatchlist] = useState<Title[]>(() => loadWatchlist());
  const [loved, setLoved] = useState<Title[]>(() => loadLoved());

  const isInWatchlist = (title: Title) =>
    watchlist.some((t) => t.id === title.id && t.mediaType === title.mediaType);

  const toggleWatchlist = (title: Title) => {
    if (isInWatchlist(title)) {
      removeFromWatchlist(title.id, title.mediaType);
      setWatchlist((prev) => prev.filter((t) => !(t.id === title.id && t.mediaType === title.mediaType)));
    } else {
      addToWatchlist(title);
      setWatchlist((prev) => [title, ...prev]);
    }
  };

  const markLoved = (title: Title) => {
    addToLoved(title);
    setLoved((prev) => (prev.some((t) => t.id === title.id && t.mediaType === title.mediaType) ? prev : [title, ...prev]));
  };

  const value = useMemo<AppContextValue>(
    () => ({
      ...tasteProfile,
      genres,
      genresError,
      watchlist,
      loved,
      toggleWatchlist,
      isInWatchlist,
      markLoved,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasteProfile.profile, genres, genresError, watchlist, loved],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
