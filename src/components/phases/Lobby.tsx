import type { SessionRow, PlayerRow } from '../../types/db';
import PlayerList from '../PlayerList';
import StartGameButton from '../StartGameButton';
import EndSessionButton from '../EndSessionButton';
import ShareLink from '../ShareLink';

type Props = {
  session: SessionRow;
  players: PlayerRow[];
  isHost: boolean;
  deviceId: string;
};

export default function Lobby({ session, players, isHost, deviceId }: Props) {
  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold">Lobby</h1>
        {isHost && <EndSessionButton sessionId={session.id} />}
      </header>

      <ShareLink sessionId={session.id} />

      <section>
        <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">
          Players ({players.length})
        </h2>
        <PlayerList
          players={players}
          hostDeviceId={session.host_device_id}
          myDeviceId={deviceId}
          highlightId={null}
        />
      </section>

      {isHost ? (
        <StartGameButton
          sessionId={session.id}
          deviceId={deviceId}
          disabled={players.length < 1}
        />
      ) : (
        <p className="text-slate-500 text-sm text-center">Waiting for host to start…</p>
      )}
    </main>
  );
}
