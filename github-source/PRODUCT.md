# Weekend Watch Guide — product direction

## Promise and audience

Help an English-speaking global audience decide what to watch in under two minutes. Success is a satisfying watch, not more scrolling. Show one confident pick and two alternatives, each with an honest explanation. International stories remain available through the language filter.

## Pilot delivered

Accounts, editable taste profile, mood/format/time filters, three-title shortlist, pick-for-me, saved watchlist, manually entered viewing history, private notes and ratings, an interpretable recommendation model, and optional browser speech input/output. The pilot catalog is small and curated. Preferences and ratings update recommendations immediately.

## Next release: launch essentials

1. Managed identity or verified email sign-in with recovery and account deletion. Confirm durable database storage, backups and restore procedures before real users register.
2. Connect a licensed movie metadata provider. Store stable provider IDs, genres, languages, content certifications, runtimes, posters, and regional availability with source and last-checked timestamps. Display required provider attribution. Catalog and streaming access are separate licensing questions; verify terms before commercial launch.
3. Collect country and streaming subscriptions so “where to watch” is actionable. Never infer global availability from US availability. Keep subscription filters off until the source is connected.
4. Add opt-in weekly digests: at most three picks, user timezone, frequency limits, unsubscribe, delivery logs, retry handling and no-send when nothing meaningful changed. A scheduler reads a consented notification outbox; request handlers do not send email directly. No unsolicited messages.
5. Add manual history import from a user-supplied export with a preview and deduplication. Do not claim automatic Netflix or other streaming history access.

## Recommendation development

Start with explicit preferences, mood/context filters and weighted tag affinity from feedback. Make “watched”, “disliked”, “not tonight”, and “hide forever” separate signals in the next iteration. Add controlled diversity and a small exploration slot so the engine does not trap users in one genre. Ask why a film missed: too slow, too dark, wrong humour, already seen. Learn humour style, pacing, tone, themes and preferred length. Keep textual review sentiment out of ranking until consent and quality checks exist.

Once sufficient opt-in data exists, test collaborative filtering against the interpretable baseline using temporal holdouts. Avoid claiming recommendation accuracy from tiny samples. Track whether a suggestion was accepted and later enjoyed. Distinguish inferred preference from stated preference and let users reset either.

## Differentiating additions

- Couple/group mode: find overlap without revealing each person's private history.
- “Finish tonight” and “one episode” modes; episode duration should be validated per season.
- Spoiler-free content and mood controls, with reliable content advisories rather than guessed family suitability.
- A Friday shortlist, new-season alerts, and a “leaving your service” alert only when licensed availability data supports it.
- Conversational voice that asks one useful question, then offers one grounded recommendation. Keep deterministic title lookup and eligibility checks behind any language model. Do not let generated text invent streaming availability.

## Metrics and business

Primary: median time to accepted pick, post-watch satisfaction, and weekly return rate. Secondary: shortlist acceptance, repeated rejection, diversity, notification opt-outs, and latency. Instrument without sending private reviews to analytics. Consider a free core and paid shared profiles/digests later; validate repeat value before subscriptions. Affiliate links must be disclosed and must not secretly override relevance.

## Sources checked for deployment/data planning

- Hostinger Node deployment: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- TMDB FAQ and licensing: https://developer.themoviedb.org/docs/faq
- TMDB region-based watch providers and attribution: https://developer.themoviedb.org/reference/tv-series-watch-providers
