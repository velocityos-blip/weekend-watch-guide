# Weekend Watch Guide

**[Find tonight’s watch at weekendwatchguide.com](https://weekendwatchguide.com/)**

Have half an hour and want a laugh? Choose **Laugh out loud**, **Series**, and **Up to 30 min** to get a short list of shows that fit. Browse without an account, or sign in to save picks and rate what you’ve watched. Your ratings help shape your next shortlist.

## Run your own copy

Install Node.js 22.13 or newer. Fork and clone the repository, then run these commands from its top-level folder. The included catalog works without API keys.

```sh
npm ci
npm run build
npm test
npm start
```

Open [localhost:3001](http://localhost:3001) to try the guide. The [app source](github-source/) contains the recommendation engine, catalog, and tests. The [running and hosting guide](github-source/RUNNING.md) covers configuration and data storage.

## Join the community

Movie lovers, first-time contributors, and developers are welcome. Try the guide, [fork this repository](https://github.com/velocityos-blip/weekend-watch-guide/fork), and help make choosing a movie or series easier.

- **Suggest a pick** in [Discussions](https://github.com/velocityos-blip/weekend-watch-guide/discussions). Include the title, year, language, and the mood it fits. Tell us why, without spoilers.
- **Report a problem** in [Issues](https://github.com/velocityos-blip/weekend-watch-guide/issues). For example, if a time filter misses the mark, share the filter, the title you saw, and what you expected. Please leave out private account details.
- **Contribute a change** from your fork. Open a [pull request](https://github.com/velocityos-blip/weekend-watch-guide/pulls) describing what you changed and how you checked it. Documentation improvements, accessibility feedback, and metadata corrections with sources are good first contributions.

## License

You can fork, modify, and distribute the app, including commercially, under the [MIT License](LICENSE). Include the copyright and permission notice with copies or substantial portions of the software. Third-party movie and series metadata carry their own [licenses and attribution](github-source/public/metadata-credits.html).
