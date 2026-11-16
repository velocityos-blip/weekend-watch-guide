# Weekend Watch Guide

An English-first, global movie discovery pilot: three choices, mood and time filters, account-specific watchlists, private reviews, watch history, explainable content-based ranking, and a browser voice guide.

## Run

Node.js 22.13+ (24 recommended). Install dependencies with `npm install` (Express).

```
npm install
npm start
npm test
```

Local app: http://localhost:3001. `npm run build` validates the server and browser scripts.

## Hostinger deployment

Upload the source ZIP as a Node.js app. Start command: `npm start`. Entry: `server.js`. Node: 24 or 22.13+. Build command: `npm run build`. No static output directory; this is a server app.

Set `NODE_ENV=production`, `APP_ORIGIN=https://weekendwatchguide.com`, and `DATA_DIR` to a verified writable, persistent directory **outside release folders and public_html**. The platform supplies `PORT`. If using a temporary domain, APP_ORIGIN must match it exactly until the custom domain is connected. Sessions use secure cookies in production. Never deploy test databases or credentials.

The app uses SQLite for a single-instance pilot. Verify storage survives restart AND redeploy before accepting real accounts. Configure backups and perform a restore test. For multiple instances or ephemeral Hostinger storage, migrate to managed MySQL/Postgres before public launch. The app should not be marketed as production-ready until this is resolved.

## Implemented

- Salted scrypt passwords, opaque hashed session tokens, HttpOnly cookies, origin checks, account-scoped storage, request bounds, basic sign-in throttling, HTML escaping and restrictive CSP.
- Explicit taste selection and positive/negative ratings change tag affinity; watched/dismissed titles are removed from discovery. Reviews are private notes, not sentiment analysis.
- Curated 24-title catalog with original editorial descriptions and art. English filter defaults on. No fabricated availability or match percentages.
- Browser speech recognition and read-aloud with text fallback. Voice parser supports a small set of moods, format and time buckets; it is not an LLM conversation service.
- Export of account data. Signup/login and watch history work locally without external keys.

## Known launch work

- Email verification, password recovery, account deletion, persistent/distributed abuse controls and operational monitoring.
- Licensed movie metadata/posters, current regional streaming availability, broader catalog and ingestion jobs.
- Opt-in email/push digests and unsubscribe flow. No notifications are sent in this version.
- Data retention policy and operator contact, public legal copy, accessibility audit and production load testing.
- Validated persistent hosting database and backups. Authentication is an early-access pilot, not an audited identity service.

See PRODUCT.md for the CTO product and launch plan.

## Metadata sources

The app ships with a matched metadata snapshot in `metadata/titles.json`.
Movie cast comes from the MIT-licensed servant-42/wikipedia-movie-data GitHub
archive (American films through 2023). Series cast, rating, status and poster
links come from TVmaze under CC BY-SA 4.0. Source links and retrieval dates are
shown in title details, with licensing in `/metadata-credits.html`.
No API keys or IMDb scraping are required. No movie poster reuse is assumed.
Run `node scripts/sync-metadata.js` to update the snapshot, then redeploy.
Exact title/year matches prevent remake confusion; failed lookups retain prior
metadata. The snapshot enriches the curated catalog; it does not add titles or
provide automatic new-release notifications. Metadata ratings do not affect
taste ranking. Source genres are retained separately from editorial mood tags.
