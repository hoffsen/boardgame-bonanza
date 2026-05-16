import type { SessionRow, PlayerRow } from '../../types/db';
import PlayerList from '../PlayerList';
import StartGameButton from '../StartGameButton';
import EndSessionButton from '../EndSessionButton';
import ShareLink from '../ShareLink';
import DicePicker from '../DicePicker';
import ThemePicker from '../ThemePicker';
import ModePicker from '../ModePicker';
import RandomizeTurnsButton from '../RandomizeTurnsButton';
import TurnOrder from '../TurnOrder';

type Props = {
  session: SessionRow;
  players: PlayerRow[];
  isHost: boolean;
  deviceId: string;
};

export default function Lobby({ session, players, isHost, deviceId }: Props) {
  const alreadyRandomized = players.some((p) => p.turn_order !== null);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto space-y-5">
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

      <section className="space-y-2">
        <h2 className="text-sm uppercase tracking-wide text-slate-400">Turn order</h2>
        <TurnOrder players={players} />
        {isHost && (
          <RandomizeTurnsButton
            sessionId={session.id}
            deviceId={deviceId}
            alreadyRandomized={alreadyRandomized}
          />
        )}
      </section>

      <ThemePicker sessionId={session.id} deviceId={deviceId} current={session.theme} />
      <ModePicker sessionId={session.id} deviceId={deviceId} current={session.deal_mode} />
      <DicePicker sessionId={session.id} deviceId={deviceId} current={session.dice_sides} />

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
