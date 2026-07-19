export function ConfigNotice({ message }: { message: string }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-brand-2/40 bg-brand-2/10 p-6 text-center">
      <h2 className="text-lg font-semibold text-text">Setup needed</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-left text-sm text-muted">
        <li>
          Get a free API key at{' '}
          <a
            className="text-brand underline"
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noreferrer"
          >
            themoviedb.org
          </a>
        </li>
        <li>
          Copy <code className="rounded bg-panel-2 px-1">.env.example</code> to <code className="rounded bg-panel-2 px-1">.env</code>
        </li>
        <li>
          Set <code className="rounded bg-panel-2 px-1">VITE_TMDB_API_KEY</code> and restart the dev server
        </li>
      </ol>
    </div>
  );
}
