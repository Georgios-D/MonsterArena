import React from 'react';
import { Heart, Swords, Shield } from 'lucide-react';
import { Monster, MonsterRarity } from '../../types/game';

interface MonsterCardProps {
  monster: Monster;
  onClick?: () => void;
  isSelected?: boolean;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onClick, isSelected = false }) => {
  // Get appropriate background color based on monster type
  const getTypeColor = () => {
    switch (monster.type) {
      case 'FIRE':
        return 'from-red-500 to-orange-500';
      case 'WATER':
        return 'from-blue-500 to-cyan-500';
      case 'EARTH':
        return 'from-green-500 to-emerald-500';
      case 'AIR':
        return 'from-gray-400 to-slate-500';
      case 'ELECTRIC':
        return 'from-yellow-400 to-amber-500';
      case 'SHADOW':
        return 'from-gray-700 to-gray-900';
      case 'LIGHT':
        return 'from-yellow-300 to-amber-400';
      case 'METAL':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-primary-500 to-primary-700';
    }
  };

  // Get appropriate border color based on monster rarity
  const getRarityBorder = () => {
    switch (monster.rarity) {
      case MonsterRarity.COMMON:
        return 'border-gray-300';
      case MonsterRarity.UNCOMMON:
        return 'border-green-400';
      case MonsterRarity.RARE:
        return 'border-blue-400';
      case MonsterRarity.EPIC:
        return 'border-purple-400';
      case MonsterRarity.LEGENDARY:
        return 'border-yellow-400';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`monster-card ${isSelected ? 'ring-2 ring-primary-500 transform scale-[1.02]' : ''}`}
    >
      {/* Card header with monster type and rarity */}
      <div className={`bg-gradient-to-r ${getTypeColor()} text-white p-4 relative`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold truncate">{monster.name}</h3>
            <span className="text-xs opacity-80">{monster.type.charAt(0) + monster.type.slice(1).toLowerCase()}</span>
          </div>
          <div className={`w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center 
                          text-xs font-semibold ${isSelected ? 'animate-pulse-slow' : ''}`}>
            Lv{monster.level}
          </div>
        </div>
        
        {/* Monster image placeholder */}
        <div className="mt-4 h-32 flex items-center justify-center">
          {/* Placeholder for the 3D model - would be replaced with actual Three.js component */}
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white text-2xl font-bold">
            {monster.name.charAt(0)}
          </div>
        </div>
        
        {/* Rarity badge */}
        <div 
          className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full 
                     ${monster.rarity === MonsterRarity.COMMON ? 'bg-gray-600' : 
                       monster.rarity === MonsterRarity.UNCOMMON ? 'bg-green-600' : 
                       monster.rarity === MonsterRarity.RARE ? 'bg-blue-600' : 
                       monster.rarity === MonsterRarity.EPIC ? 'bg-purple-600' : 
                       'bg-yellow-600'} text-white`}
        >
          {monster.rarity.charAt(0) + monster.rarity.slice(1).toLowerCase()}
        </div>
      </div>
      
      {/* Card body with stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="monster-stat">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{monster.stats.health}</span>
          </div>
          
          <div className="monster-stat">
            <Swords className="w-4 h-4 text-blue-500" />
            <span>{monster.stats.attack}</span>
          </div>
          
          <div className="monster-stat">
            <Shield className="w-4 h-4 text-green-500" />
            <span>{monster.stats.defense}</span>
          </div>
          
          <div className="monster-stat">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{monster.stats.speed}</span>
          </div>
        </div>
        
        {/* Abilities preview */}
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">Abilities:</p>
          <ul className="list-disc list-inside">
            {monster.abilities.slice(0, 2).map(ability => (
              <li key={ability.id} className="truncate">{ability.name}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Card footer */}
      <div className={`p-2 text-center border-t ${getRarityBorder()}`}>
        <button 
          className="text-primary-600 text-sm hover:text-primary-700 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default MonsterCard;