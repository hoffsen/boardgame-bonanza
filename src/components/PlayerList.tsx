import type { PlayerRow } from '../types/db';

type Props = {
  players: PlayerRow[];
  hostDeviceId: string;
  myDeviceId: string;
  highlightId: string | null;
};

export default function PlayerList({ players, hostDeviceId, myDeviceId, highlightId }: Props) {
  if (players.length === 0) {
    return <p className="text-slate-500 text-sm">No players yet.</p>;
  }
  return (
    <ul className="space-y-1">
      {players.map((p) => {
        const isCurrent = p.id === highlightId;
        const isMe = p.device_id === myDeviceId;
        const isHost = p.device_id === hostDeviceId;
        const isSpectator = p.turn_order === null;
        return (
          <li
            key={p.id}
            className={`flex items-center justify-between rounded-md px-3 py-2 ${
              isCurrent ? 'bg-emerald-900/40 ring-1 ring-emerald-700' : 'bg-slate-900'
            }`}
          >
            <span className="truncate">
              {p.name}
              {isMe && <span className="text-slate-500 text-sm"> (you)</span>}
              {isSpectator && p.position === 0 && (
                <span className="text-slate-500 text-xs"> · spectator</span>
              )}
            </span>
            <span className="flex items-center gap-2 shrink-0">
              {p.position > 0 && (
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
