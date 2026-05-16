import type { SessionRow, PlayerRow } from '../../types/db';
import PlayerList from '../PlayerList';
import PositionTrack from '../PositionTrack';
import TurnBanner from '../TurnBanner';
import RollButton from '../RollButton';
import ChallengeChain from '../ChallengeChain';
import EndSessionButton from '../EndSessionButton';

type Props = {
  session: SessionRow;
  players: PlayerRow[];
  me: PlayerRow | null;
  isHost: boolean;
  deviceId: string;
};

export default function Game({ session, players, me, isHost, deviceId }: Props) {
  const myTurn = !!me && session.current_player_id === me.id;
  const isSpectator = !me || me.turn_order === null;

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto space-y-5">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold">Bonanza</h1>
        {isHost && <EndSessionButton sessionId={session.id} />}
      </header>

      <TurnBanner session={session} players={players} myId={me?.id} />

      <PositionTrack players={players} />

      <PlayerList
        players={players}
        hostDeviceId={session.host_device_id}
        myDeviceId={deviceId}
        highlightId={session.current_player_id}
      />

      {isSpectator ? (
        <p className="text-slate-500 text-sm text-center">
          You joined mid-game — spectating until someone wins.
        </p>
      ) : myTurn ? (
        <RollButton sessionId={session.id} deviceId={deviceId} />
      ) : null}

      {session.last_turn && <ChallengeChain lastTurn={session.last_turn} />}
    </main>
  );
}
