import { useState } from 'react';
import { hostForceAdvance } from '../lib/session';

type Props = { sessionId: string; deviceId: string; currentPlayerName: string };

export default function HostSkipButton({
  sessionId,
  deviceId,
  currentPlayerName,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!confirm(`Skip ${currentPlayerName}'s turn? They keep their position; no penalty.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await hostForceAdvance(sessionId, deviceId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy}
        className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs text-slate-300 disabled:opacity-50"
      >
        Skip {currentPlayerName}'s turn (host)
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
