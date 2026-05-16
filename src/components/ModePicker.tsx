import { useState } from 'react';
import { setDealMode } from '../lib/session';
import { DEAL_MODES, type DealMode } from '../types/db';

const LABELS: Record<DealMode, { name: string; blurb: string }> = {
  fixed: {
    name: 'Same card per space',
    blurb: 'Dealt once. Everyone landing on space 7 gets the same card.',
  },
  random: {
    name: 'Random every roll',
    blurb: 'Fresh random card from the theme on every landing.',
  },
};

type Props = { sessionId: string; deviceId: string; current: DealMode };

export default function ModePicker({ sessionId, deviceId, current }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(mode: DealMode) {
    if (mode === current) return;
    setBusy(true);
    setError(null);
    try {
      await setDealMode(sessionId, deviceId, mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg bg-slate-900 p-3 space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">Card mode</p>
      <div className="space-y-1">
        {DEAL_MODES.map((m) => {
          const selected = m === current;
          return (
            <button
              key={m}
              type="button"
              disabled={busy}
              onClick={() => void pick(m)}
              className={`w-full text-left rounded-md px-3 py-2 ${
                selected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              } disabled:opacity-50`}
            >
              <div className="font-medium text-sm">{LABELS[m].name}</div>
              <div className={`text-xs ${selected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {LABELS[m].blurb}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
