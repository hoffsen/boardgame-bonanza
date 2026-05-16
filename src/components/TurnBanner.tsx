import type { SessionRow, PlayerRow } from '../types/db';

type Props = {
  session: SessionRow;
  players: PlayerRow[];
  myId: string | undefined;
};

export default function TurnBanner({ session, players, myId }: Props) {
  const current = players.find((p) => p.id === session.current_player_id);
  if (!current) return null;
  const myTurn = !!myId && session.current_player_id === myId;

  return (
    <div
      className={`rounded-lg p-4 text-center ${
        myTurn ? 'bg-emerald-900/40 ring-1 ring-emerald-700' : 'bg-slate-900'
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">It's</p>
      <p className="text-2xl font-bold">{myTurn ? 'YOUR turn' : `${current.name}'s turn`}</p>
    </div>
  );
}
