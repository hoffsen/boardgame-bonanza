import type { PlayerRow } from '../types/db';

type Props = {
  players: PlayerRow[];
  hostDeviceId: string;
  myDeviceId: string;
  highlightId: string | null;
};

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

function computeFinishedRanks(players: PlayerRow[]): Map<string, number> {
  const sorted = [...players]
    .filter((p) => p.finished_at !== null)
    .sort(
      (a, b) =>
        new Date(a.finished_at as string).getTime() -
        new Date(b.finished_at as string).getTime()
    );
  const ranks = new Map<string, number>();
  sorted.forEach((p, i) => ranks.set(p.id, i + 1));
  return ranks;
}

export default function PlayerList({
  players,
  hostDeviceId,
  myDeviceId,
  highlightId,
}: Props) {
  if (players.length === 0) {
    return <p className="text-slate-500 text-sm">No players yet.</p>;
  }
  const ranks = computeFinishedRanks(players);

  return (
    <ul className="space-y-1">
      {players.map((p) => {
        const isCurrent = p.id === highlightId;
        const isMe = p.device_id === myDeviceId;
        const isHost = p.device_id === hostDeviceId;
        const isSpectator = p.turn_order === null;
        const isFinished = p.finished_at !== null;
        const rank = ranks.get(p.id);

        return (
          <li
            key={p.id}
            className={`flex items-center justify-between rounded-md px-3 py-2 ${
              isCurrent
                ? 'bg-emerald-900/40 ring-1 ring-emerald-700'
                : isFinished
                  ? 'bg-slate-900/40 text-slate-400'
                  : 'bg-slate-900'
            }`}
          >
            <span className="truncate flex items-center gap-2">
              {isFinished && rank !== undefined && (
                <span className="text-xs font-mono text-emerald-400 w-9">
                  {ordinal(rank)}
                </span>
              )}
              <span>
                {p.name}
                {isMe && <span className="text-slate-500 text-sm"> (you)</span>}
                {isSpectator && !isFinished && (
                  <span className="text-slate-500 text-xs"> · spectator</span>
                )}
                {p.skip_next_turn && (
                  <span className="text-rose-400 text-xs"> · skipping next</span>
                )}
              </span>
            </span>
            <span className="flex items-center gap-2 shrink-0">
              {!isFinished && p.position > 0 && (
                <span className="text-xs text-slate-500 font-mono">@ {p.position}</span>
              )}
              {isHost && (
                <span className="text-xs rounded-full bg-emerald-900 text-emerald-300 px-2 py-0.5">
                  host
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
