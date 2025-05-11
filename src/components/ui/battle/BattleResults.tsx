import React from 'react';
import { Award, Coins, Zap, ArrowRight, Shield } from 'lucide-react';
import { Monster } from '../../../types/game';

interface BattleResultsProps {
  result: 'ready' | 'active' | 'playerWon' | 'opponentWon';
  playerMonster: Monster;
  opponentMonster: Monster;
  rewards: {
    xp: number;
    coins: number;
    cardDrop: Monster | null;
  };
  onContinue: () => void;
}

const BattleResults: React.FC<BattleResultsProps> = ({
  result,
  playerMonster,
  opponentMonster,
  rewards,
  onContinue
}) => {
  const isVictory = result === 'playerWon';
  
  return (
    <div className="battle-results bg-white rounded-xl shadow-md overflow-hidden">
      <div 
        className={`p-6 text-white ${isVictory ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gradient-to-r from-red-500 to-red-700'}`}
      >
        <h1 className="text-2xl font-bold mb-2">
          {isVictory ? 'Victory!' : 'Defeat!'}
        </h1>
        <p>
          {isVictory 
            ? `Your ${playerMonster.name} defeated the opponent's ${opponentMonster.name}!` 
            : `Your ${playerMonster.name} was defeated by the opponent's ${opponentMonster.name}.`}
        </p>
      </div>
      
      <div className="p-6">
        {/* Battle summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Your Monster</h3>
            <div className="flex space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{
                  backgroundColor: getTypeColor(playerMonster.type)
                }}
              >
                {playerMonster.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{playerMonster.name}</p>
                <p className="text-sm text-gray-600">Level {playerMonster.level}</p>
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                  <span>HP: {playerMonster.stats.health}</span>
                  <span>ATK: {playerMonster.stats.attack}</span>
                  <span>DEF: {playerMonster.stats.defense}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Opponent Monster</h3>
            <div className="flex space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{
                  backgroundColor: getTypeColor(opponentMonster.type)
                }}
              >
                {opponentMonster.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{opponentMonster.name}</p>
                <p className="text-sm text-gray-600">Level {opponentMonster.level}</p>
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                  <span>HP: {opponentMonster.stats.health}</span>
                  <span>ATK: {opponentMonster.stats.attack}</span>
                  <span>DEF: {opponentMonster.stats.defense}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rewards section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            <Award className="inline-block w-6 h-6 mr-2 text-primary-600" />
            Rewards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-4 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-xl font-bold text-primary-700">+{rewards.xp} XP</p>
              </div>
            </div>
            
            <div className="bg-primary-50 p-4 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Coins</p>
                <p className="text-xl font-bold text-primary-700">+{rewards.coins}</p>
              </div>
            </div>
          </div>
          
          {/* Card drop */}
          {rewards.cardDrop && (
            <div className="mt-6 bg-accent-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-accent-600 mr-2" />
                <h3 className="font-semibold">New Monster Card!</h3>
              </div>
              <div className="flex mt-3 items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4"
                  style={{
                    backgroundColor: getTypeColor(rewards.cardDrop.type)
                  }}
                >
                  {rewards.cardDrop.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{rewards.cardDrop.name}</p>
                  <p className="text-sm text-gray-600">
                    {rewards.cardDrop.type.charAt(0).toUpperCase() + rewards.cardDrop.type.slice(1).toLowerCase()} • 
                    {rewards.cardDrop.rarity.charAt(0).toUpperCase() + rewards.cardDrop.rarity.slice(1).toLowerCase()}
                  </p>
                  <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                    <span>HP: {rewards.cardDrop.stats.health}</span>
                    <span>ATK: {rewards.cardDrop.stats.attack}</span>
                    <span>DEF: {rewards.cardDrop.stats.defense}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Continue button */}
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="btn btn-primary px-6 py-3 flex items-center"
          >
            <span className="mr-2">Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper to get color based on monster type
const getTypeColor = (type: string): string => {
  switch (type.toUpperCase()) {
    case 'FIRE': return '#EF4444';
    case 'WATER': return '#0EA5E9';
    case 'EARTH': return '#10B981';
    case 'AIR': return '#6B7280';
    case 'ELECTRIC': return '#F59E0B';
    case 'SHADOW': return '#4B5563';
    case 'LIGHT': return '#EAB308';
    case 'METAL': return '#64748B';
    default: return '#8B5CF6';
  }
};

export default BattleResults;