import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SessionRow, PlayerRow } from '../../types/db';
import { createSession } from '../../lib/session';
import { getDeviceId } from '../../lib/deviceId';
import Leaderboard from '../Leaderboard';

type Props = {
  session: SessionRow;
  players: PlayerRow[];
  fallbackName: string;
};

export default function Finished({ session, players, fallbackName }: Props) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishedCount = players.filter((p) => p.finished_at !== null).length;
  const winner = players.find((p) => p.id === session.winner_player_id);

  const heading =
    session.phase === 'finished'
      ? winner
        ? `${winner.name} took first!`
        : 'Game over'
      : session.phase === 'ended'
        ? 'Session ended'
        : 'Session expired';

  async function newGame() {
    setBusy(true);
    setError(null);
    try {
      const sid = await createSession(getDeviceId(), fallbackName);
      navigate(`/s/${sid}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create');
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-start justify-center p-6 pt-12">
      <div className="w-full max-w-md space-y-5">
        <h1 className="text-3xl font-semibold text-center">{heading}</h1>

        {finishedCount > 0 && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Final standings</p>
            <Leaderboard players={players} />
          </section>
        )}

        <button
          type="button"
          onClick={() => void newGame()}
          disabled={busy}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 text-lg font-medium disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'New game'}
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="block mx-auto text-xs text-slate-500 hover:text-slate-300"
        >
          Back to home
        </button>
      </div>
    </main>
  );
}
