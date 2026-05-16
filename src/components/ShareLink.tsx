import { useState } from 'react';

export default function ShareLink({ sessionId }: { sessionId: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}#/s/${sessionId}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; nothing to do */
    }
  }

  return (
    <div className="rounded-lg bg-slate-900 p-3 space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">Share with friends</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs truncate text-slate-300">{url}</code>
        <button
          type="button"
          onClick={() => void copy()}
          className="text-xs rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
