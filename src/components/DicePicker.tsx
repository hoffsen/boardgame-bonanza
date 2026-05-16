import { useState } from 'react';
import { setDice } from '../lib/session';

const PRESETS = [4, 6, 8, 10, 12, 20];
const MIN = 2;
const MAX = 24;

type Props = { sessionId: string; deviceId: string; current: number };

export default function DicePicker({ sessionId, deviceId, current }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function change(sides: number) {
    if (sides === current) return;
    if (sides < MIN || sides > MAX) return;
    setBusy(true);
    setError(null);
    try {
      await setDice(sessionId, deviceId, sides);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg bg-slate-900 p-3 space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-400">Dice</p>
        <p className="text-sm font-mono text-indigo-300">d{current}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            disabled={busy}
            onClick={() => void change(n)}
            className={`px-2 py-1 rounded-md text-xs font-mono ${
              n === current
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            } disabled:opacity-50`}
          >
            d{n}
          </button>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            disabled={busy || current <= MIN}
            onClick={() => void change(current - 1)}
            className="px-2 py-1 rounded-md text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
            aria-label="Decrease dice sides"
          >
            −
          </button>
          <button
            type="button"
            disabled={busy || current >= MAX}
            onClick={() => void change(current + 1)}
            className="px-2 py-1 rounded-md text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
            aria-label="Increase dice sides"
          >
            +
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
