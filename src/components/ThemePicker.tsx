import { useState } from 'react';
import { setTheme } from '../lib/session';
import { THEMES, type Theme } from '../types/db';

const LABELS: Record<Theme, { name: string; blurb: string }> = {
  goofy: { name: 'Goofy', blurb: 'Silly party prompts. Mostly tame.' },
  spicy: { name: 'Spicy', blurb: 'Dares, embarrassing stories, physical challenges.' },
  heavy: { name: 'Heavy', blurb: 'More drinks, fewer dares.' },
};

type Props = { sessionId: string; deviceId: string; current: Theme };

export default function ThemePicker({ sessionId, deviceId, current }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(theme: Theme) {
    if (theme === current) return;
    setBusy(true);
    setError(null);
    try {
      await setTheme(sessionId, deviceId, theme);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg bg-slate-900 p-3 space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">Theme</p>
      <div className="space-y-1">
        {THEMES.map((t) => {
          const selected = t === current;
          return (
            <button
              key={t}
              type="button"
              disabled={busy}
              onClick={() => void pick(t)}
              className={`w-full text-left rounded-md px-3 py-2 ${
                selected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              } disabled:opacity-50`}
            >
              <div className="font-medium text-sm">{LABELS[t].name}</div>
              <div className={`text-xs ${selected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {LABELS[t].blurb}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
