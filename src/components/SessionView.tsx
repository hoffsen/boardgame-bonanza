import { useSession } from '../hooks/useSession';
import { usePlayers } from '../hooks/usePlayers';
import type { SessionRow, PlayerRow } from '../types/db';
import Lobby from './phases/Lobby';
import Game from './phases/Game';
import Finished from './phases/Finished';

type Props = {
  initialSession: SessionRow;
  myPlayer: PlayerRow | null;
  deviceId: string;
  fallbackName: string;
};

export default function SessionView({ initialSession, myPlayer, deviceId, fallbackName }: Props) {
  const session = useSession(initialSession);
  const players = usePlayers(session.id);

  const me = players.find((p) => p.device_id === deviceId) ?? myPlayer;
  const isHost = session.host_device_id === deviceId;

  if (session.phase === 'lobby') {
    return (
      <Lobby
        session={session}
        players={players}
        isHost={isHost}
        deviceId={deviceId}
      />
    );
  }
  if (session.phase === 'playing') {
    return (
      <Game
        session={session}
        players={players}
        me={me}
        isHost={isHost}
        deviceId={deviceId}
      />
    );
  }
  return (
    <Finished
      session={session}
      players={players}
      fallbackName={me?.name ?? fallbackName}
    />
  );
}
