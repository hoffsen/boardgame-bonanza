import { useState } from 'react';
import { finishTurn } from '../lib/session';
import type { TurnOutcome } from '../types/db';

type Props = { sessionId: string; deviceId: string };

export default function TurnActions({ sessionId, deviceId }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(outcome: TurnOutcome) {
    setBusy(true);
    setError(null);
    try {
      await finishTurn(sessionId, deviceId, outcome);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void run('did_it')}
        disabled={busy}
        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 text-base font-semibold disabled:opacity-50"
      >
        Did it
      </button>
      <button
        type="button"
        onClick={() => void run('skip')}
        disabled={busy}
        className="w-full rounded-lg bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 py-2 text-sm disabled:opacity-50"
      >
        Nope — drink penalty (lose next turn)
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
