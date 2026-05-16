import { type ReactNode, useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function SettingsModal({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 ring-1 ring-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 flex items-center justify-between bg-slate-900 px-5 py-3 border-b border-slate-800">
          <h2 className="text-base font-semibold">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 px-2 py-1 text-lg"
            aria-label="Close settings"
          >
            ×
          </button>
        </header>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
