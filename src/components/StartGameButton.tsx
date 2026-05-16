import { useState } from 'react';
import { startGame } from '../lib/session';

type Props = { sessionId: string; deviceId: string; disabled?: boolean };

export default function StartGameButton({ sessionId, deviceId, disabled }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await startGame(sessionId, deviceId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start');
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy || disabled}
        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 text-lg font-medium disabled:opacity-50"
      >
        {busy ? 'Starting…' : 'Start game'}
      </button>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
