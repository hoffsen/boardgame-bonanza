import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { supabaseConfigError } from './lib/supabase';
import './styles/index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('root element missing');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      {supabaseConfigError ? (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md space-y-3">
            <h1 className="text-xl font-semibold text-red-400">Configuration missing</h1>
            <p className="text-sm text-slate-300">{supabaseConfigError}</p>
            <p className="text-xs text-slate-500">
              Repo secrets <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>{' '}
              must be set, then re-deploy.
            </p>
          </div>
        </main>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
