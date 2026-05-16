import { useState } from 'react';

type Props = { onSubmit: (name: string) => void };

export default function NameGate({ onSubmit }: Props) {
  const [value, setValue] = useState('');
  const trimmed = value.trim();
  const valid = trimmed.length >= 1 && trimmed.length <= 40;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit(trimmed);
        }}
      >
        <h1 className="text-xl font-semibold">What's your name?</h1>
        <input
          type="text"
          className="w-full rounded-lg bg-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          autoFocus
          maxLength={40}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Sam"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-medium disabled:opacity-50"
          disabled={!valid}
        >
          Join
        </button>
      </form>
    </main>
  );
}
