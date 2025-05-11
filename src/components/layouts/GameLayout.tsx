import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Zap, Gamepad2, Swords, Home, Menu, X, Settings } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import SettingsModal from '../modals/SettingsModal';

const GameLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const player = usePlayerStore(state => state.player);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/collection', label: 'Collection', icon: <Shield className="w-5 h-5" /> },
    { path: '/battle', label: 'Battle', icon: <Swords className="w-5 h-5" /> },
    { path: '/mini-games', label: 'Mini-Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { path: '/shop', label: 'Shop', icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-xl font-bold">Monster Arena</h1>
          </div>

          {/* Player stats - desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {player && (
              <>
                <div className="flex items-center">
                  <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {player.level}
                  </div>
                  <div>
                    <p className="text-xs text-primary-200">Level</p>
                    <div className="w-24 h-2 bg-primary-500 rounded-full">
                      <div 
                        className="h-full bg-accent-400 rounded-full" 
                        style={{ width: `${(player.xp / player.xpToNextLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-primary-200">Energy</p>
                  <p className="font-semibold">{player.energy}/{player.maxEnergy}</p>
                </div>
                
                <div>
                  <p className="text-xs text-primary-200">Coins</p>
                  <p className="font-semibold">{player.coins}</p>
                </div>
              </>
            )}
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-primary-500 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-primary-500 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-primary-500 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-700 text-white">
            <div className="container mx-auto px-4 py-2">
              {player && (
                <div className="flex justify-between items-center py-3 border-b border-primary-500">
                  <div className="flex items-center">
                    <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {player.level}
                    </div>
                    <div>
                      <p className="text-sm">Level {player.level}</p>
                      <div className="w-24 h-2 bg-primary-600 rounded-full mt-1">
                        <div 
                          className="h-full bg-accent-400 rounded-full" 
                          style={{ width: `${(player.xp / player.xpToNextLevel) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div>
                      <p className="text-xs text-primary-300">Energy</p>
                      <p className="font-semibold">{player.energy}/{player.maxEnergy}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-primary-300">Coins</p>
                      <p className="font-semibold">{player.coins}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <nav className="py-2">
                <ul>
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-primary-600 text-white'
                            : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
        
        {/* Desktop navigation */}
        <div className="hidden md:block bg-primary-700">
          <div className="container mx-auto">
            <nav className="flex">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-6 py-3 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 Monster Arena. All rights reserved.</p>
          <p className="text-gray-400 mt-1 text-xs">
            Assets from <a href="https://opengameart.org/" className="underline hover:text-primary-300">OpenGameArt</a> and <a href="https://kenney.nl/" className="underline hover:text-primary-300">Kenney</a>. 
            Sounds from <a href="https://freesound.org/" className="underline hover:text-primary-300">Freesound</a>.
          </p>
        </div>
      </footer>
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default GameLayout;