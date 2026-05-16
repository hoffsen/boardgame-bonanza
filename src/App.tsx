import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import Session from './routes/Session';

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm text-center space-y-3">
        <h1 className="text-2xl font-semibold">Nothing here</h1>
        <p className="text-slate-400 text-sm">
          That link looks stale. Head back home to start a new game.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium"
        >
          Home
        </button>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s/:sessionId" element={<Session />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
