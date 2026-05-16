import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Board from './routes/Board';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/b/:boardId" element={<Board />} />
      </Routes>
    </HashRouter>
  );
}
