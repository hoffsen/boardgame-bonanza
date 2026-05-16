import { useState } from 'react';
import { endSession } from '../lib/session';

export default function EndSessionButton({ sessionId }: { sessionId: string }) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!confirm('End this session for everyone?')) return;
    setBusy(true);
    try {
      await endSession(sessionId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={busy}
      className="text-sm rounded-md bg-red-900/40 text-red-300 hover:bg-red-900/60 px-3 py-1 disabled:opacity-50"
    >
      End session
    </button>
  );
}
