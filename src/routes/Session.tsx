import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeviceId } from '../lib/deviceId';
import { getDisplayName, setDisplayName } from '../lib/displayName';
import { fetchPlayer, fetchSession, joinSession } from '../lib/session';
import type { SessionRow, PlayerRow } from '../types/db';
import NameGate from '../components/NameGate';
import SessionView from '../components/SessionView';

export default function Session() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [deviceId] = useState(() => getDeviceId());
  const [name, setName] = useState<string | null>(() => getDisplayName());
  const [session, setSession] = useState<SessionRow | null>(null);
  const [myPlayer, setMyPlayer] = useState<PlayerRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !name) return;
    let cancelled = false;

    async function boot(sid: string, n: string) {
      try {
        const s = await fetchSession(sid);
        const isLive = s.phase === 'lobby' || s.phase === 'playing';
        const p = isLive ? await joinSession(sid, deviceId, n) : await fetchPlayer(sid, deviceId);
        if (!cancelled) {
          setSession(s);
          setMyPlayer(p);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load session');
      }
    }

    void boot(sessionId, name);
    return () => {
      cancelled = true;
    };
  }, [sessionId, deviceId, name]);

  if (!sessionId) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-400">Missing session ID.</p>
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

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-400">Connecting…</p>
      </main>
    );
  }

  return (
    <SessionView
      initialSession={session}
      myPlayer={myPlayer}
      deviceId={deviceId}
      fallbackName={name}
    />
  );
}
