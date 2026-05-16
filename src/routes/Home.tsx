import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeviceId } from '../lib/deviceId';
import { getDisplayName, setDisplayName } from '../lib/displayName';
import { createSession } from '../lib/session';
import NameGate from '../components/NameGate';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(() => getDisplayName());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNewGame() {
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      const sessionId = await createSession(getDeviceId(), name);
      navigate(`/s/${sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create session');
      setBusy(false);
    }
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

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm text-center space-y-5 w-full">
        <h1 className="text-3xl font-bold">Board Game Bonanza</h1>
        <p className="text-slate-400">
          Hi <span className="text-slate-200">{name}</span>. Spin up a new game and share the URL
          with your friends.
        </p>
        <button
          type="button"
          onClick={() => void handleNewGame()}
          disabled={busy}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 text-lg font-medium disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'New game'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="button"
          onClick={() => {
            setDisplayName('');
            setName(null);
          }}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          (change name)
        </button>
      </div>
    </main>
  );
}
