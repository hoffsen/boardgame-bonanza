import type { LastTurn } from '../types/db';

export default function ChallengeChain({ lastTurn }: { lastTurn: LastTurn }) {
  return (
    <section className="space-y-2">
      <p className="text-sm text-slate-400">
        <span className="text-slate-200 font-medium">{lastTurn.by_player_name}</span> rolled{' '}
        <span className="font-mono text-indigo-300">{lastTurn.roll}</span>
        {lastTurn.outcome === 'win' && <span className="text-emerald-300"> — and won! 🎉</span>}
      </p>
      {lastTurn.cards.map((c, i) => (
        <div
          key={i}
          className="rounded-lg bg-slate-900 p-4 space-y-1 ring-1 ring-slate-800"
        >
          <p className="text-xs text-slate-500">
            Space {c.space}
            {c.move_back > 0 && (
              <span className="text-amber-400"> → move back {c.move_back}</span>
            )}
          </p>
          <p className="text-base">{c.prompt}</p>
        </div>
      ))}
    </section>
  );
}
