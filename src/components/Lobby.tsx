import { useSession } from '../hooks/useSession';
import { usePlayers } from '../hooks/usePlayers';
import { useEvents } from '../hooks/useEvents';
import type { SessionContext } from '../lib/session';
import PlayerList from './PlayerList';
import DiceButton from './DiceButton';
import DiceLog from './DiceLog';
import EndSessionButton from './EndSessionButton';

type Props = {
  ctx: SessionContext;
  deviceId: string;
  playerName: string;
  boardId: string;
};

export default function Lobby({ ctx, deviceId, playerName, boardId }: Props) {
  const session = useSession(ctx.session);
  const players = usePlayers(session.id);
  const diceEvents = useEvents(session.id, 'dice_roll');

  if (session.status !== 'active') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Session {session.status}</h1>
          <p className="text-slate-400">The host ended the session or it expired.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold truncate">Board {boardId}</h1>
        {ctx.role === 'host' && <EndSessionButton sessionId={session.id} />}
      </header>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Players</h2>
        <PlayerList
          players={players}
          hostDeviceId={session.host_device_id}
          myDeviceId={deviceId}
        />
      </section>

      <section className="space-y-3">
        <DiceButton sessionId={session.id} deviceId={deviceId} playerName={playerName} />
        <DiceLog events={diceEvents} />
      </section>
    </main>
  );
}
