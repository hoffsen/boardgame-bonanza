import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeviceId } from '../lib/deviceId';
import { getDisplayName, setDisplayName } from '../lib/displayName';
import { createOrJoinSession, joinAsPlayer } from '../lib/session';
import type { SessionContext } from '../lib/session';
import NameGate from '../components/NameGate';
import Lobby from '../components/Lobby';

export default function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const [deviceId] = useState(() => getDeviceId());
  const [name, setName] = useState<string | null>(() => getDisplayName());
  const [ctx, setCtx] = useState<SessionContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId || !name) return;
    let cancelled = false;

    async function go(boardIdArg: string, nameArg: string) {
      try {
        const result = await createOrJoinSession(boardIdArg, deviceId);
        await joinAsPlayer(result.session.id, deviceId, nameArg);
        if (!cancelled) setCtx(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to join');
      }
    }

    void go(boardId, name);
    return () => {
      cancelled = true;
    };
  }, [boardId, deviceId, name]);

  if (!boardId) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-400">Missing board ID.</p>
      </main>
    );
  }

  if (!name) {
    return (
      <NameGate
        onSubmit={(n) => {
          setDisplayName(n);
          setName(n);
        }}
      />
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-400">Error: {error}</p>
      </main>
    );
  }

  if (!ctx) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-400">Connecting…</p>
      </main>
    );
  }

  return <Lobby ctx={ctx} deviceId={deviceId} playerName={name} boardId={boardId} />;
}
