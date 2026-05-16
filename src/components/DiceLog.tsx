import type { EventRow, DiceRollPayload } from '../types/db';

export default function DiceLog({ events }: { events: EventRow[] }) {
  if (events.length === 0) {
    return <p className="text-slate-500 text-sm">No rolls yet.</p>;
  }
  return (
    <ul className="space-y-1">
      {events.map((e) => {
        const p = e.payload as unknown as DiceRollPayload;
        return (
          <li
            key={e.id}
            className="flex items-center justify-between text-sm rounded-md bg-slate-900 px-3 py-2"
          >
            <span>{p.player_name}</span>
            <span className="font-mono text-indigo-300">
              d{p.sides} → {p.value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
