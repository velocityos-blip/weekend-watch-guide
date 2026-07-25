# Weekend Watch Guide

Stop browsing fatigue. An AI-powered movie & TV recommender that learns what you love as you swipe, and keeps the picks coming — no login required.

## How it works

- **Discover**: swipe through a ranked stream of movies and shows (like/dislike/save).
- **For You**: a ranked, mood-filterable grid with match % and "because you like X" explanations.
- **Watchlist**: everything you've saved or loved, persisted locally in your browser.
- **Search**: find anything on TMDB directly.

Recommendations come from [TMDB](https://www.themoviedb.org/)'s catalog. A lightweight taste engine (`src/lib/tasteEngine.ts`) turns your swipes into weighted genre preferences and re-ranks every candidate pool in real time — no account or server required, everything lives in `localStorage`.

## Setup

```bash
npm install
cp .env.example .env
```

Get a free API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) and set `VITE_TMDB_API_KEY` in `.env`.

```bash
npm run dev
```

## Notes

- This is a client-only app, so the TMDB key ships in the browser bundle like any Vite `VITE_`-prefixed variable. Fine for personal/demo use; for production, put TMDB calls behind a small proxy/serverless function to keep the key private and add your own rate limiting.
- No sign-up flow yet — taste profile and watchlist live in `localStorage` on one device/browser.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck + production build
- `npm run lint` — oxlint
