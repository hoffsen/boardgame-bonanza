import { useState } from 'react';
import { rollDice } from '../lib/session';

type Props = { sessionId: string; deviceId: string; playerName: string };

export default function DiceButton({ sessionId, deviceId, playerName }: Props) {
  const [rolling, setRolling] = useState(false);

  async function handleClick() {
    setRolling(true);
    try {
      await rollDice(sessionId, deviceId, playerName);
    } finally {
      setRolling(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={rolling}
      className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-lg font-medium disabled:opacity-50"
    >
      {rolling ? 'Rolling…' : 'Roll d6'}
    </button>
  );
}
