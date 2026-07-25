import { NavLink, Outlet } from 'react-router-dom';
import { Clapperboard, Compass, Sparkles, Bookmark, Search } from 'lucide-react';

const links = [
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/for-you', label: 'For You', icon: Sparkles },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
];

export function NavShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-ink/90 px-4 py-3 backdrop-blur">
        <NavLink to="/discover" className="flex items-center gap-2 font-bold tracking-tight text-text">
          <Clapperboard className="text-brand" size={22} />
          <span>Weekend Watch Guide</span>
        </NavLink>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-3xl items-center justify-around border-t border-border bg-panel/95 py-2 backdrop-blur">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                isActive ? 'text-brand' : 'text-muted hover:text-text'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
