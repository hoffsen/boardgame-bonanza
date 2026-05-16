import type { LastTurn } from '../types/db';

export default function ChallengeChain({ lastTurn }: { lastTurn: LastTurn }) {
  return (
    <section className="space-y-3">
      <div className="rounded-lg bg-indigo-950/60 ring-1 ring-indigo-800 p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-indigo-300">
          {lastTurn.by_player_name} rolled
        </p>
        <p className="text-5xl font-bold font-mono leading-none mt-1">{lastTurn.roll}</p>
        {lastTurn.outcome === 'win' && (
          <p className="text-emerald-400 text-sm mt-2 font-medium">— and won!</p>
        )}
      </div>

      {lastTurn.cards.map((c, i) => {
        const prev = i > 0 ? lastTurn.cards[i - 1] : undefined;
        const isMoveBack = prev !== undefined && prev.move_back > 0;
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
              {isMoveBack && prev !== undefined ? (
                <span className="text-amber-400">
                  ↩ Moved back {prev.move_back} → space {c.space}
                </span>
              ) : (
                <span className="text-slate-400">Landed on space {c.space}</span>
              )}
            </div>
            <div className="rounded-lg bg-slate-900 ring-1 ring-slate-800 p-4 space-y-2">
              <p className="text-base leading-relaxed">{c.prompt}</p>
              {c.move_back > 0 && (
                <p className="text-xs text-amber-400 uppercase tracking-wide pt-1 border-t border-slate-800">
                  this card sends you back {c.move_back}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
