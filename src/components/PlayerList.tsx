import type { PlayerRow } from '../types/db';

type Props = {
  players: PlayerRow[];
  hostDeviceId: string;
  myDeviceId: string;
};

export default function PlayerList({ players, hostDeviceId, myDeviceId }: Props) {
  if (players.length === 0) {
    return <p className="text-slate-500 text-sm">No players yet.</p>;
  }
  return (
    <ul className="space-y-1">
      {players.map((p) => (
        <li
          key={p.id}
          className="flex items-center justify-between rounded-md bg-slate-900 px-3 py-2"
        >
          <span>
            {p.name}
            {p.device_id === myDeviceId && (
              <span className="text-slate-500 text-sm"> (you)</span>
            )}
          </span>
          {p.device_id === hostDeviceId && (
            <span className="text-xs rounded-full bg-emerald-900 text-emerald-300 px-2 py-0.5">
              host
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
