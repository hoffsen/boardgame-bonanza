import type { PlayerRow } from '../types/db';

type Props = { players: PlayerRow[]; currentPlayerId?: string | null };

export default function PositionTrack({ players, currentPlayerId }: Props) {
  const spaces = Array.from({ length: 41 }, (_, i) => i + 1);
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-1 min-w-max pb-2">
        {spaces.map((n) => {
          const here = players.filter((p) => p.position === n);
          const isWin = n === 41;
          return (
            <div
              key={n}
              className={`w-10 h-14 shrink-0 rounded-md flex flex-col items-center justify-start py-1 ${
                isWin ? 'bg-emerald-700' : 'bg-slate-800'
              }`}
              title={isWin ? 'Win square' : `Space ${n}`}
            >
              <span className="text-[10px] text-slate-300">{isWin ? 'WIN' : n}</span>
              <div className="flex flex-wrap gap-px justify-center mt-1">
                {here.map((p) => (
                  <span
                    key={p.id}
                    className={`bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold ${
                      p.id === currentPlayerId ? 'ring-2 ring-amber-400' : ''
                    }`}
                    title={p.name}
                  >
                    {p.name[0]?.toUpperCase() ?? '?'}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
