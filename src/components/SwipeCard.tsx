import { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import type { Title } from '../types';
import { posterUrl } from '../lib/tmdb';

interface Props {
  title: Title;
  onDecide: (action: 'like' | 'dislike') => void;
  active: boolean;
}

const SWIPE_THRESHOLD = 110;

export function SwipeCard({ title, onDecide, active }: Props) {
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const startRef = useRef({ x: 0, y: 0 });
  const poster = posterUrl(title.posterPath, 'w500');
  const year = title.releaseDate ? title.releaseDate.slice(0, 4) : '';

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag((d) => ({ ...d, dragging: true }));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.dragging || !active) return;
    setDrag({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
      dragging: true,
    });
  };

  const finishDrag = () => {
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) {
      onDecide(drag.x > 0 ? 'like' : 'dislike');
    }
    setDrag({ x: 0, y: 0, dragging: false });
  };

  const rotation = drag.x / 18;
  const likeOpacity = Math.min(Math.max(drag.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-drag.x / SWIPE_THRESHOLD, 0), 1);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      style={{
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg)`,
        transition: drag.dragging ? 'none' : 'transform 0.25s ease',
        touchAction: 'none',
      }}
      className="absolute inset-0 select-none overflow-hidden rounded-2xl border border-border bg-panel shadow-2xl cursor-grab active:cursor-grabbing"
    >
      {poster ? (
        <img src={poster} alt={title.title} className="h-full w-full object-cover pointer-events-none" draggable={false} />
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-center text-lg text-muted">{title.title}</div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16">
        <h3 className="text-xl font-bold text-white">{title.title}</h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-white/80">
          <span>{year}</span>
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-brand text-brand" />
            {title.voteAverage ? title.voteAverage.toFixed(1) : '—'}
          </span>
          <span className="uppercase tracking-wide text-xs">{title.mediaType}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">{title.overview}</p>
      </div>

      <div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-5 top-5 rotate-[-12deg] rounded-lg border-4 border-emerald-400 px-3 py-1 text-2xl font-black text-emerald-400"
      >
        LIKE
      </div>
      <div
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute right-5 top-5 rotate-[12deg] rounded-lg border-4 border-rose-400 px-3 py-1 text-2xl font-black text-rose-400"
      >
        NOPE
      </div>
    </div>
  );
}
