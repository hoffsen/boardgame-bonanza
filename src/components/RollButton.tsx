import { useState } from 'react';
import { takeTurn } from '../lib/session';

type Props = { sessionId: string; deviceId: string; sides: number };

export default function RollButton({ sessionId, deviceId, sides }: Props) {
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setRolling(true);
    setError(null);
    try {
      await takeTurn(sessionId, deviceId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setTimeout(() => setRolling(false), 1000);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={rolling}
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-4 text-xl font-bold disabled:opacity-50"
      >
        {rolling ? 'Rolling…' : `Roll d${sides}`}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
