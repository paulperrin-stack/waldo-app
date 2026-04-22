import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

export default function App() {
  return (
    <Routes>
      {/* /shows the level picker */}
      <Route path='/'             element={<HomePage />} />
      {/* /game/level1 shows the game */}
      <Route path='/game/:slug'   element={<GamePage />} />
    </Routes>
  );
};