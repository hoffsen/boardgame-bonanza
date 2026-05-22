import { useState } from 'react';
import { takeTurn } from '../lib/session';

type Props = { sessionId: string; deviceId: string };

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function RollButton({ sessionId, deviceId }: Props) {
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
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-4 text-xl font-bold disabled:opacity-50 flex items-center justify-center gap-3"
      >
        <DiceIcon className="w-6 h-6" />
        {rolling ? 'Rolling…' : 'Roll dice'}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
