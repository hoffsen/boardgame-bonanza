import { useState } from 'react';
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
import SettingsModal from '../SettingsModal';

type Props = {
  session: SessionRow;
  players: PlayerRow[];
  me: PlayerRow | null;
  isHost: boolean;
  deviceId: string;
};

function EmptyState({ currentName }: { currentName: string | undefined }) {
  return (
    <div className="rounded-lg bg-slate-900/40 ring-1 ring-slate-800 p-8 text-center">
      <p className="text-slate-400 text-sm">
        {currentName
          ? `Waiting for ${currentName} to roll…`
          : 'Game on. First roll coming up.'}
      </p>
    </div>
  );
}

export default function Game({ session, players, me, isHost, deviceId }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const showRoll = myTurn && !iAmFinished && !isSpectator && !myRollIsPending;
  const hasFooter = showRoll || myRollIsPending || showHostSkip;

  return (
    <>
      <main className="min-h-screen pb-32 max-w-2xl mx-auto">
        <header className="px-6 pt-4 pb-3 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Bonanza</h1>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-sm text-slate-200"
          >
            Settings
          </button>
        </header>

        <div className="px-6 mb-3">
          <TurnBanner session={session} players={players} myId={me?.id} />
        </div>

        <div className="px-2 mb-4">
          <PositionTrack
            players={players}
            currentPlayerId={session.current_player_id}
          />
        </div>

        <section className="px-6 space-y-3">
          {iAmFinished ? (
            <p className="text-emerald-400 text-sm text-center font-medium py-4">
              You finished — sit back and watch the rest play it out.
            </p>
          ) : isSpectator ? (
            <p className="text-slate-500 text-sm text-center py-4">
              Spectating. You can join the next game.
            </p>
          ) : session.last_turn ? (
            <ChallengeChain lastTurn={session.last_turn} />
          ) : (
            <EmptyState currentName={currentPlayer?.name} />
          )}
        </section>
      </main>

      {hasFooter && (
        <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur border-t border-slate-800 px-6 py-3"
             style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          <div className="max-w-2xl mx-auto space-y-2">
            {showRoll && (
              <RollButton
                sessionId={session.id}
                deviceId={deviceId}
                sides={session.dice_sides}
              />
            )}
            {myRollIsPending && (
              <TurnActions sessionId={session.id} deviceId={deviceId} />
            )}
            {showHostSkip && currentPlayer && (
              <HostSkipButton
                sessionId={session.id}
                deviceId={deviceId}
                currentPlayerName={currentPlayer.name}
              />
            )}
          </div>
        </div>
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <section className="space-y-2">
          <DicePicker
            sessionId={session.id}
            deviceId={deviceId}
            current={session.dice_sides}
          />
        </section>

        <section className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-slate-400">
            Players ({players.length})
          </h3>
          <PlayerList
            players={players}
            hostDeviceId={session.host_device_id}
            myDeviceId={deviceId}
            highlightId={session.current_player_id}
          />
        </section>

        <section>
          <EndSessionButton sessionId={session.id} />
        </section>
      </SettingsModal>
    </>
  );
}
