import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GameLayout from './components/layouts/GameLayout';
import HomePage from './components/pages/HomePage';
import CollectionPage from './components/pages/CollectionPage';
import BattlePage from './components/pages/BattlePage';
import MiniGamesPage from './components/pages/MiniGamesPage';
import ShopPage from './components/pages/ShopPage';
import NotFoundPage from './components/pages/NotFoundPage';
import { useGameInitialization } from './hooks/useGameInitialization';

function App() {
  // Initialize game data and resources
  const { isLoading, error } = useGameInitialization();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-24 h-24 mb-8 animate-spin rounded-full border-t-4 border-accent-400"></div>
        <h1 className="text-3xl font-bold mb-2">Monster Arena</h1>
        <p className="text-lg text-primary-200">Loading game assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-24 h-24 mb-8 text-error flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Failed to Load Game</h1>
        <p className="text-lg text-primary-200 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-accent"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<GameLayout />}>
        <Route index element={<HomePage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="battle" element={<BattlePage />} />
        <Route path="mini-games" element={<MiniGamesPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;