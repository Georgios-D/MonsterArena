import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Swords, Gamepad2, Zap } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { useCardStore } from '../../stores/cardStore';
import { MonsterType } from '../../types/game';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const player = usePlayerStore(state => state.player);
  const ownedCards = useCardStore(state => state.ownedCards);
  const [hasName, setHasName] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const setPlayerNameAction = usePlayerStore(state => state.setPlayerName);
  
  useEffect(() => {
    // Check if player has a default name
    if (player && player.name === 'Player') {
      setHasName(false);
    }
  }, [player]);
  
  if (!player) {
    return <div>Loading...</div>;
  }
  
  // Handle new player setup
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setPlayerNameAction(playerName);
      setHasName(true);
    }
  };
  
  // Group monsters by type for the dashboard
  const monstersByType = ownedCards.reduce((acc, monster) => {
    if (!acc[monster.type]) {
      acc[monster.type] = [];
    }
    acc[monster.type].push(monster);
    return acc;
  }, {} as Record<MonsterType, typeof ownedCards>);
  
  // If player needs to set a name
  if (!hasName) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to Monster Arena!</h1>
          <p className="text-gray-600 mb-6 text-center">
            Before you begin your journey, please tell us your name.
          </p>
          
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all"
            >
              Start Your Adventure
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 rounded-xl shadow-lg p-6 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {player.name}!</h1>
        <p className="text-primary-100">Continue your monster collection adventure.</p>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-xs text-primary-200">Monsters</p>
            <p className="text-xl font-bold">{ownedCards.length}</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-xs text-primary-200">Battles Won</p>
            <p className="text-xl font-bold">{player.stats.battlesWon}</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-xs text-primary-200">Player Level</p>
            <p className="text-xl font-bold">{player.level}</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-xs text-primary-200">Mini-Games</p>
            <p className="text-xl font-bold">{player.stats.miniGamesCompleted}</p>
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => navigate('/battle')}
          className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center text-primary-600 mb-3">
            <Swords className="h-6 w-6 mr-2" />
            <h2 className="font-bold text-lg">Battle Arena</h2>
          </div>
          <p className="text-gray-600 mb-3">Challenge opponents and earn rewards.</p>
          <button className="flex items-center text-primary-600 hover:text-primary-700">
            <span className="mr-1">Start battle</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div 
          onClick={() => navigate('/collection')}
          className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center text-primary-600 mb-3">
            <Shield className="h-6 w-6 mr-2" />
            <h2 className="font-bold text-lg">Collection</h2>
          </div>
          <p className="text-gray-600 mb-3">View and upgrade your monster cards.</p>
          <button className="flex items-center text-primary-600 hover:text-primary-700">
            <span className="mr-1">View collection</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div 
          onClick={() => navigate('/mini-games')}
          className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center text-primary-600 mb-3">
            <Gamepad2 className="h-6 w-6 mr-2" />
            <h2 className="font-bold text-lg">Mini-Games</h2>
          </div>
          <p className="text-gray-600 mb-3">Play mini-games to earn energy and cards.</p>
          <button className="flex items-center text-primary-600 hover:text-primary-700">
            <span className="mr-1">Play games</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Monster collection summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Monster Collection</h2>
          <button 
            onClick={() => navigate('/collection')}
            className="text-primary-600 hover:text-primary-700 flex items-center"
          >
            <span className="mr-1">View all</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(monstersByType).slice(0, 4).map(([type, monsters]) => (
            <div key={type} className="border border-gray-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-700 mb-2">{type} Monsters</h3>
              <p className="text-gray-600 text-sm mb-1">You have {monsters.length} {type.toLowerCase()} monster{monsters.length !== 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {monsters.slice(0, 3).map(monster => (
                  <div 
                    key={monster.id} 
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold"
                    style={{ 
                      backgroundColor: 
                        type === 'FIRE' ? '#FEE2E2' : 
                        type === 'WATER' ? '#E0F2FE' : 
                        type === 'EARTH' ? '#D1FAE5' : 
                        type === 'AIR' ? '#F3F4F6' : 
                        type === 'ELECTRIC' ? '#FEF3C7' : 
                        type === 'SHADOW' ? '#E5E7EB' : 
                        type === 'LIGHT' ? '#FEFCE8' : 
                        '#F1F5F9',
                      color: 
                        type === 'FIRE' ? '#EF4444' : 
                        type === 'WATER' ? '#0EA5E9' : 
                        type === 'EARTH' ? '#10B981' : 
                        type === 'AIR' ? '#6B7280' : 
                        type === 'ELECTRIC' ? '#F59E0B' : 
                        type === 'SHADOW' ? '#4B5563' : 
                        type === 'LIGHT' ? '#EAB308' : 
                        '#64748B'
                    }}
                  >
                    {monster.name.charAt(0)}
                  </div>
                ))}
                {monsters.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                    +{monsters.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shop promo */}
      <div 
        onClick={() => navigate('/shop')}
        className="relative bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl shadow-lg overflow-hidden cursor-pointer"
      >
        <div className="p-6 text-white">
          <div className="flex items-center mb-3">
            <Zap className="h-6 w-6 mr-2" />
            <h2 className="font-bold text-xl">Shop Spotlight</h2>
          </div>
          <p className="mb-4">Discover new monster cards and power-ups in the shop!</p>
          <button className="bg-white text-accent-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
            <span className="mr-1">Visit Shop</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-accent-400 bg-opacity-30 md:block hidden"></div>
      </div>
    </div>
  );
};

export default HomePage;