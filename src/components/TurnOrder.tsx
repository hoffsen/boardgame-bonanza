import type { PlayerRow } from '../types/db';

export default function TurnOrder({ players }: { players: PlayerRow[] }) {
  const ordered = [...players]
    .filter((p) => p.turn_order !== null)
    .sort((a, b) => (a.turn_order ?? 0) - (b.turn_order ?? 0));

  if (ordered.length === 0) {
    return (
      <p className="text-slate-500 text-xs">
        Turn order will be set when the game starts (or hit randomize).
      </p>
    );
  }

  return (
    <ol className="flex flex-wrap gap-1 text-xs">
      {ordered.map((p, i) => (
        <li key={p.id} className="rounded-md bg-slate-800 px-2 py-1">
          <span className="text-slate-500 mr-1">{i + 1}.</span>
          {p.name}
        </li>
      ))}
    </ol>
  );
}
