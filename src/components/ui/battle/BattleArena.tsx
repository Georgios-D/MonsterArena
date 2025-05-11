import React from 'react';
import { Monster } from '../../../types/game';
import MonsterModel from './MonsterModel';

interface BattleArenaProps {
  playerMonster: Monster;
  opponentMonster: Monster;
  playerHealth: number;
  opponentHealth: number;
  playerMaxHealth: number;
  opponentMaxHealth: number;
  currentTurn: 'player' | 'opponent';
  battleStatus: 'ready' | 'active' | 'playerWon' | 'opponentWon';
}

const BattleArena: React.FC<BattleArenaProps> = ({
  playerMonster,
  opponentMonster,
  playerHealth,
  opponentHealth,
  playerMaxHealth,
  opponentMaxHealth,
  currentTurn,
  battleStatus
}) => {
  // Helper to get type-specific colors
  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'FIRE': return 'from-red-500 to-red-700';
      case 'WATER': return 'from-blue-500 to-blue-700';
      case 'EARTH': return 'from-green-500 to-green-700';
      case 'AIR': return 'from-gray-400 to-gray-600';
      case 'ELECTRIC': return 'from-yellow-400 to-yellow-600';
      case 'SHADOW': return 'from-gray-700 to-gray-900';
      case 'LIGHT': return 'from-yellow-300 to-yellow-500';
      case 'METAL': return 'from-gray-400 to-gray-600';
      default: return 'from-primary-500 to-primary-700';
    }
  };

  // Get health percentage for display
  const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;
  const opponentHealthPercent = (opponentHealth / opponentMaxHealth) * 100;

  // Determine health bar color based on remaining health
  const getHealthBarColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="battle-stage relative">
      {/* Battle outcome overlay */}
      {battleStatus === 'playerWon' && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-30 z-10 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">VICTORY!</div>
        </div>
      )}
      {battleStatus === 'opponentWon' && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-30 z-10 flex items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">DEFEAT!</div>
        </div>
      )}

      {/* Player's monster */}
      <div className={`monster-container player-monster ${currentTurn === 'player' ? 'active-turn' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="monster-stats bg-primary-800 text-white p-2 rounded-lg mb-2 w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold truncate max-w-[120px]">{playerMonster.name}</span>
              <span className="text-xs">Lvl {playerMonster.level}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getHealthBarColor(playerHealthPercent)}`}
                style={{ width: `${playerHealthPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>{playerHealth}/{playerMaxHealth}</span>
              <span className={`${playerMonster.type.toLowerCase()} capitalize`}>
                {playerMonster.type.toLowerCase()}
              </span>
            </div>
          </div>
          
          <div 
            className={`relative bg-gradient-to-br ${getTypeColor(playerMonster.type)} 
                      w-32 h-32 rounded-full flex items-center justify-center
                      ${currentTurn === 'player' ? 'ring-4 ring-white ring-opacity-50 shadow-lg' : ''}
                      ${battleStatus === 'playerWon' ? 'animate-bounce-slow' : 
                        battleStatus === 'opponentWon' ? 'opacity-50' : ''}`}
          >
            <MonsterModel 
              modelId={playerMonster.modelId} 
              type={playerMonster.type}
              isActive={currentTurn === 'player'}
            />
          </div>
        </div>
        
        {/* Player stats summary */}
        <div className="stats-summary mt-2 bg-white bg-opacity-10 p-2 rounded-lg text-white text-xs flex justify-around">
          <div className="stat">
            <span className="value">{playerMonster.stats.attack}</span>
            <span className="label">ATK</span>
          </div>
          <div className="stat">
            <span className="value">{playerMonster.stats.defense}</span>
            <span className="label">DEF</span>
          </div>
          <div className="stat">
            <span className="value">{playerMonster.stats.speed}</span>
            <span className="label">SPD</span>
          </div>
        </div>
      </div>

      {/* VS indicator */}
      <div className="vs-indicator text-white text-2xl font-bold">VS</div>

      {/* Opponent's monster */}
      <div className={`monster-container opponent-monster ${currentTurn === 'opponent' ? 'active-turn' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="monster-stats bg-primary-800 text-white p-2 rounded-lg mb-2 w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold truncate max-w-[120px]">{opponentMonster.name}</span>
              <span className="text-xs">Lvl {opponentMonster.level}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getHealthBarColor(opponentHealthPercent)}`}
                style={{ width: `${opponentHealthPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>{opponentHealth}/{opponentMaxHealth}</span>
              <span className={`${opponentMonster.type.toLowerCase()} capitalize`}>
                {opponentMonster.type.toLowerCase()}
              </span>
            </div>
          </div>
          
          <div 
            className={`relative bg-gradient-to-br ${getTypeColor(opponentMonster.type)} 
                      w-32 h-32 rounded-full flex items-center justify-center
                      ${currentTurn === 'opponent' ? 'ring-4 ring-white ring-opacity-50 shadow-lg' : ''}
                      ${battleStatus === 'opponentWon' ? 'animate-bounce-slow' : 
                        battleStatus === 'playerWon' ? 'opacity-50' : ''}`}
          >
            <MonsterModel 
              modelId={opponentMonster.modelId} 
              type={opponentMonster.type}
              isActive={currentTurn === 'opponent'}
            />
          </div>
        </div>
        
        {/* Opponent stats summary */}
        <div className="stats-summary mt-2 bg-white bg-opacity-10 p-2 rounded-lg text-white text-xs flex justify-around">
          <div className="stat">
            <span className="value">{opponentMonster.stats.attack}</span>
            <span className="label">ATK</span>
          </div>
          <div className="stat">
            <span className="value">{opponentMonster.stats.defense}</span>
            <span className="label">DEF</span>
          </div>
          <div className="stat">
            <span className="value">{opponentMonster.stats.speed}</span>
            <span className="label">SPD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;