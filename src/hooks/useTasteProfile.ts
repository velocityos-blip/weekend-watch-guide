import { useCallback, useState } from 'react';
import type { SwipeAction, TasteProfile, Title } from '../types';
import { loadProfile, saveProfile } from '../lib/storage';
import { applyOnboarding, recordSwipe } from '../lib/tasteEngine';

export function useTasteProfile() {
  const [profile, setProfile] = useState<TasteProfile>(() => loadProfile());

  const swipe = useCallback((title: Title, action: SwipeAction) => {
    setProfile((prev) => {
      const next = recordSwipe(prev, title, action);
      saveProfile(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback((favoriteGenreIds: number[]) => {
    setProfile((prev) => {
      const next = applyOnboarding(prev, favoriteGenreIds);
      saveProfile(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = { ...loadProfile() };
    setProfile(next);
  }, []);

  return { profile, swipe, completeOnboarding, reset, setProfile };
}
