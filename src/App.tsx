import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Session from './routes/Session';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s/:sessionId" element={<Session />} />
      </Routes>
    </HashRouter>
  );
}
