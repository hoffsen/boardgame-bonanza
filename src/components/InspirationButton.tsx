import { useState } from 'react';
import { drawInspiration } from '../lib/session';

type Props = {
  sessionId: string;
  deviceId: string;
  category: string;
  hasDrawn: boolean;
};

export default function InspirationButton({
  sessionId,
  deviceId,
  category,
  hasDrawn,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await drawInspiration(sessionId, deviceId, category);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy}
        className="text-xs rounded-md bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 px-3 py-1.5 disabled:opacity-50"
      >
        {busy ? '…' : hasDrawn ? 'Try another' : 'Need inspiration?'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
