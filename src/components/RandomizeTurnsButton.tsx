import { useState } from 'react';
import { randomizeTurns } from '../lib/session';

type Props = { sessionId: string; deviceId: string; alreadyRandomized: boolean };

export default function RandomizeTurnsButton({
  sessionId,
  deviceId,
  alreadyRandomized,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      await randomizeTurns(sessionId, deviceId);
      setConfirming(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  function handleClick() {
    if (!alreadyRandomized || confirming) {
      void run();
    } else {
      setConfirming(true);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={`w-full rounded-lg py-2 text-sm font-medium disabled:opacity-50 ${
          confirming
            ? 'bg-amber-600 hover:bg-amber-500'
            : 'bg-slate-800 hover:bg-slate-700'
        }`}
      >
        {busy
          ? 'Shuffling…'
          : confirming
            ? 'Tap again to confirm'
            : alreadyRandomized
              ? 'Re-randomize turn order'
              : 'Randomize turn order'}
      </button>
      {confirming && (
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Cancel
        </button>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
