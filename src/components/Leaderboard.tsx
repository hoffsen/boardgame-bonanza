import type { PlayerRow } from '../types/db';

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function Leaderboard({ players }: { players: PlayerRow[] }) {
  const finished = [...players]
    .filter((p) => p.finished_at !== null)
    .sort(
      (a, b) =>
        new Date(a.finished_at as string).getTime() -
        new Date(b.finished_at as string).getTime()
    );
  const unfinished = players.filter(
    (p) => p.finished_at === null && p.turn_order !== null
  );

  return (
    <ol className="space-y-1 text-left">
      {finished.map((p, i) => (
        <li
          key={p.id}
          className={`flex items-center justify-between rounded-md px-3 py-2 ${
            i === 0
              ? 'bg-emerald-900/40 ring-1 ring-emerald-700'
              : 'bg-slate-900'
          }`}
        >
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-slate-400 w-8">{ordinal(i + 1)}</span>
            <span className="font-medium">{p.name}</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {formatTime(p.finished_at as string)}
          </span>
        </li>
      ))}
      {unfinished.map((p) => (
        <li
          key={p.id}
          className="flex items-center justify-between rounded-md px-3 py-2 bg-slate-900/60"
        >
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-slate-500 w-8">—</span>
            <span className="text-slate-400">{p.name}</span>
          </span>
          <span className="text-xs text-slate-500">didn't finish (@ {p.position})</span>
        </li>
      ))}
    </ol>
  );
}
