import type { SessionRow, PlayerRow } from '../../types/db';
import PlayerList from '../PlayerList';
import PositionTrack from '../PositionTrack';
import TurnBanner from '../TurnBanner';
import RollButton from '../RollButton';
import TurnActions from '../TurnActions';
import HostSkipButton from '../HostSkipButton';
import ChallengeChain from '../ChallengeChain';
import EndSessionButton from '../EndSessionButton';
import DicePicker from '../DicePicker';

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
  const iAmFinished = !!me?.finished_at;

  const turnIsPending =
    !!session.last_turn &&
    !!session.current_player_id &&
    session.last_turn.by_player_id === session.current_player_id;
  const myRollIsPending = myTurn && turnIsPending;

  const currentPlayer = players.find((p) => p.id === session.current_player_id);
  const showHostSkip = isHost && turnIsPending && !myRollIsPending && !!currentPlayer;

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

      <DicePicker sessionId={session.id} deviceId={deviceId} current={session.dice_sides} />

      {iAmFinished ? (
        <p className="text-emerald-400 text-sm text-center font-medium">
          You finished — sit back and watch the rest play it out.
        </p>
      ) : isSpectator ? (
        <p className="text-slate-500 text-sm text-center">
          Spectating. You can join the next game.
        </p>
      ) : myRollIsPending ? (
        <TurnActions sessionId={session.id} deviceId={deviceId} />
      ) : myTurn ? (
        <RollButton sessionId={session.id} deviceId={deviceId} sides={session.dice_sides} />
      ) : null}

      {showHostSkip && currentPlayer && (
        <HostSkipButton
          sessionId={session.id}
          deviceId={deviceId}
          currentPlayerName={currentPlayer.name}
        />
      )}

      {session.last_turn && <ChallengeChain lastTurn={session.last_turn} />}
    </main>
  );
}
