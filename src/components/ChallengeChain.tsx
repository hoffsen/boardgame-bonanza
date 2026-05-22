import type { LastTurn, ChallengeCard } from '../types/db';
import InspirationButton from './InspirationButton';

const CATEGORY_LABELS: Record<string, string> = {
  truth: 'Truth',
  pickup_line: 'Pickup line',
  philosophical: 'Deep question',
  drink_reason: 'Drink reason',
  confession: 'Confession',
};

function categoryLabel(c: string): string {
  return CATEGORY_LABELS[c] ?? c.replace('_', ' ');
}

function StandardCard({
  card,
  prev,
  sessionId,
  deviceId,
  hasDrawnInspiration,
}: {
  card: ChallengeCard;
  prev: ChallengeCard | undefined;
  sessionId: string;
  deviceId: string;
  hasDrawnInspiration: boolean;
}) {
  const isMoveBack = prev !== undefined && prev.move_back > 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
        {isMoveBack && prev !== undefined ? (
          <span className="text-amber-400">
            ↩ Moved back {prev.move_back} → space {card.space}
          </span>
        ) : (
          <span className="text-slate-400">Landed on space {card.space}</span>
        )}
        {card.inspiration_category && (
          <span className="text-amber-300 ml-auto">
            {categoryLabel(card.inspiration_category)}
          </span>
        )}
      </div>
      <div className="rounded-lg bg-slate-900 ring-1 ring-slate-800 p-4 space-y-3">
        <p className="text-base leading-relaxed">{card.prompt}</p>
        {card.inspiration_category && (
          <InspirationButton
            sessionId={sessionId}
            deviceId={deviceId}
            category={card.inspiration_category}
            hasDrawn={hasDrawnInspiration}
          />
        )}
        {card.move_back > 0 && (
          <p className="text-xs text-amber-400 uppercase tracking-wide pt-1 border-t border-slate-800">
            this card sends you back {card.move_back}
          </p>
        )}
      </div>
    </div>
  );
}

function DojoCard({
  card,
  rollerName,
  sessionId,
  deviceId,
  hasDrawnInspiration,
}: {
  card: ChallengeCard;
  rollerName: string;
  sessionId: string;
  deviceId: string;
  hasDrawnInspiration: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
        <span className="text-rose-300">Stepped into the dojo — space {card.space}</span>
        {card.inspiration_category && (
          <span className="text-amber-300 ml-auto">
            {categoryLabel(card.inspiration_category)}
          </span>
        )}
      </div>
      <div className="rounded-lg bg-gradient-to-b from-rose-950 to-slate-900 ring-2 ring-rose-600 p-4 space-y-3">
        <div className="text-center text-rose-300 text-[10px] uppercase tracking-[0.3em] font-bold">
          ⚔ Dojo
        </div>
        <p className="text-center text-lg font-semibold">
          {rollerName}{' '}
          <span className="text-rose-400 text-sm uppercase tracking-wide">vs</span>{' '}
          {card.opponent_name ?? '(no one — solo session)'}
        </p>
        <p className="text-base leading-relaxed text-center pt-1 border-t border-rose-900/60">
          {card.prompt}
        </p>
        {card.inspiration_category && (
          <div className="flex justify-center">
            <InspirationButton
              sessionId={sessionId}
              deviceId={deviceId}
              category={card.inspiration_category}
              hasDrawn={hasDrawnInspiration}
            />
          </div>
        )}
      </div>
    </div>
  );
}

type Props = {
  lastTurn: LastTurn;
  sessionId: string;
  deviceId: string;
};

export default function ChallengeChain({ lastTurn, sessionId, deviceId }: Props) {
  const hasDrawnInspiration = !!lastTurn.drawn_inspiration;

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
        if (c.kind === 'dojo') {
          return (
            <DojoCard
              key={i}
              card={c}
              rollerName={lastTurn.by_player_name}
              sessionId={sessionId}
              deviceId={deviceId}
              hasDrawnInspiration={hasDrawnInspiration}
            />
          );
        }
        return (
          <StandardCard
            key={i}
            card={c}
            prev={prev}
            sessionId={sessionId}
            deviceId={deviceId}
            hasDrawnInspiration={hasDrawnInspiration}
          />
        );
      })}

      {lastTurn.drawn_inspiration && (
        <div className="rounded-lg bg-amber-950/60 ring-1 ring-amber-700 p-4">
          <p className="text-xs uppercase tracking-wide text-amber-300 mb-1">
            Inspiration
          </p>
          <p className="text-base leading-relaxed">{lastTurn.drawn_inspiration}</p>
        </div>
      )}
    </section>
  );
}
