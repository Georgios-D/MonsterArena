import React, { useState, useEffect } from 'react';
import { Shield, Zap } from 'lucide-react';
import { Monster, MonsterRarity, MonsterType } from '../../../types/game';
import MonsterCard from '../MonsterCard';

interface OpponentSelectionProps {
  playerMonsters: Monster[];
  onSelectOpponent: (playerMonster: Monster, opponentMonster: Monster) => void;
  playerEnergy: number;
  energyCost: number;
}

const OpponentSelection: React.FC<OpponentSelectionProps> = ({
  playerMonsters,
  onSelectOpponent,
  playerEnergy,
  energyCost
}) => {
  const [selectedPlayerMonster, setSelectedPlayerMonster] = useState<Monster | null>(null);
  const [availableOpponents, setAvailableOpponents] = useState<Monster[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<Monster | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Generate opponent monsters based on difficulty and player's selected monster
  useEffect(() => {
    if (!selectedPlayerMonster) {
      setAvailableOpponents([]);
      return;
    }
    
    // Helper to generate an appropriate opponent based on the player's monster and difficulty
    const generateOpponents = () => {
      // Get rarity weight based on selected monster's rarity
      const rarityValue = {
        [MonsterRarity.COMMON]: 1,
        [MonsterRarity.UNCOMMON]: 2,
        [MonsterRarity.RARE]: 3,
        [MonsterRarity.EPIC]: 4,
        [MonsterRarity.LEGENDARY]: 5
      };
      
      // Get target rarity based on difficulty
      let targetRarity;
      const playerRarityValue = rarityValue[selectedPlayerMonster.rarity];
      
      switch (difficulty) {
        case 'easy':
          // Easier opponents - lower rarity
          targetRarity = Math.max(1, playerRarityValue - 1);
          break;
        case 'medium':
          // Equal opponents - same rarity
          targetRarity = playerRarityValue;
          break;
        case 'hard':
          // Harder opponents - higher rarity
          targetRarity = Math.min(5, playerRarityValue + 1);
          break;
        default:
          targetRarity = playerRarityValue;
      }
      
      // Convert target rarity value back to rarity enum
      const rarityKeys = Object.keys(rarityValue) as MonsterRarity[];
      const targetRarityEnum = rarityKeys.find(
        key => rarityValue[key] === targetRarity
      ) || MonsterRarity.COMMON;
      
      // Generate 3 opponents of appropriate rarity
      const opponents: Monster[] = [];
      const monsterTypes = Object.values(MonsterType);
      
      for (let i = 0; i < 3; i++) {
        // Use player monster as template, but with different type
        const opponentType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
        
        // Create opponent with appropriate level adjustment based on difficulty
        const levelAdjustment = 
          difficulty === 'easy' ? -1 : 
          difficulty === 'hard' ? 1 : 0;
        
        // Make sure level is at least 1
        const opponentLevel = Math.max(1, selectedPlayerMonster.level + levelAdjustment);
        
        // Generate opponent ID
        const opponentId = `opponent-${i}-${Date.now()}`;
        
        // Create opponent monster
        const opponent: Monster = {
          id: opponentId,
          name: getRandomMonsterName(opponentType),
          modelId: `monster_${opponentType.toLowerCase()}_${targetRarityEnum.toLowerCase()}`,
          rarity: targetRarityEnum,
          type: opponentType,
          level: opponentLevel,
          isOwned: false,
          description: `A ${opponentType.toLowerCase()} monster opponent.`,
          stats: {
            // Scale stats based on level and difficulty
            health: Math.floor(selectedPlayerMonster.stats.health * (difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1)),
            attack: Math.floor(selectedPlayerMonster.stats.attack * (difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1)),
            defense: Math.floor(selectedPlayerMonster.stats.defense * (difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1)),
            speed: Math.floor(selectedPlayerMonster.stats.speed * (difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1))
          },
          abilities: [
            // Copy abilities from player's monster but with different names
            {
              id: `ability-${opponentId}-1`,
              name: getRandomAbilityName(opponentType),
              description: 'An opponent ability',
              effect: {
                type: 'damage',
                value: 8,
                target: 'opponent'
              },
              cooldown: 2
            },
            {
              id: `ability-${opponentId}-2`,
              name: getRandomAbilityName(opponentType),
              description: 'An opponent ability',
              effect: {
                type: 'buff',
                value: 2,
                target: 'self'
              },
              cooldown: 3
            }
          ]
        };
        
        opponents.push(opponent);
      }
      
      return opponents;
    };
    
    // Generate new opponents when player monster or difficulty changes
    setAvailableOpponents(generateOpponents());
    setSelectedOpponent(null);
  }, [selectedPlayerMonster, difficulty]);
  
  // Helper to get random monster name based on type
  const getRandomMonsterName = (type: MonsterType): string => {
    const typeNames = {
      [MonsterType.FIRE]: ['Blazeborn', 'Emberwing', 'Flamehowl', 'Pyrocore', 'Infernox'],
      [MonsterType.WATER]: ['Tidecaller', 'Aqualance', 'Dewmander', 'Ripplefin', 'Wavecrest'],
      [MonsterType.EARTH]: ['Stonehorn', 'Boulderback', 'Pebblite', 'Rockshale', 'Quakefist'],
      [MonsterType.AIR]: ['Zephyrous', 'Gustwing', 'Cloudchaser', 'Stormshriek', 'Breezeling'],
      [MonsterType.ELECTRIC]: ['Voltspike', 'Zaptail', 'Thundermaw', 'Sparkfang', 'Shockscale'],
      [MonsterType.SHADOW]: ['Nightcloak', 'Shadebinder', 'Umbrawl', 'Voidfang', 'Duskshade'],
      [MonsterType.LIGHT]: ['Luminaire', 'Radiarray', 'Solarbeam', 'Dawnbright', 'Glowmane'],
      [MonsterType.METAL]: ['Ironhide', 'Steelclaw', 'Chromescale', 'Alloyhorn', 'Brasswing']
    };
    
    const names = typeNames[type] || ['Mysterion'];
    return names[Math.floor(Math.random() * names.length)];
  };
  
  // Helper to get random ability name based on type
  const getRandomAbilityName = (type: MonsterType): string => {
    const typeAbilities = {
      [MonsterType.FIRE]: ['Flame Burst', 'Infernal Strike', 'Heat Wave', 'Ember Blast', 'Fire Fang'],
      [MonsterType.WATER]: ['Hydro Pump', 'Tidal Wave', 'Bubble Beam', 'Aqua Jet', 'Whirlpool'],
      [MonsterType.EARTH]: ['Rock Throw', 'Stone Edge', 'Quake Slam', 'Terra Force', 'Boulder Crush'],
      [MonsterType.AIR]: ['Gust Strike', 'Tornado Spin', 'Air Slash', 'Cyclone Rush', 'Wind Blast'],
      [MonsterType.ELECTRIC]: ['Thunder Shock', 'Volt Tackle', 'Static Discharge', 'Lightning Bolt', 'Shock Wave'],
      [MonsterType.SHADOW]: ['Shadow Claw', 'Dark Pulse', 'Void Strike', 'Nightmare Grasp', 'Umbral Blast'],
      [MonsterType.LIGHT]: ['Radiant Beam', 'Solar Flare', 'Divine Light', 'Luminous Wave', 'Holy Strike'],
      [MonsterType.METAL]: ['Metal Claw', 'Steel Slam', 'Iron Tail', 'Chrome Crusher', 'Alloy Strike']
    };
    
    const abilities = typeAbilities[type] || ['Mystery Attack'];
    return abilities[Math.floor(Math.random() * abilities.length)];
  };
  
  // Start battle if both monsters are selected
  const startBattle = () => {
    if (selectedPlayerMonster && selectedOpponent) {
      onSelectOpponent(selectedPlayerMonster, selectedOpponent);
    }
  };
  
  // Check if player has enough energy
  const hasEnoughEnergy = playerEnergy >= energyCost;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-primary-700 text-white p-4">
        <h1 className="text-xl font-bold">Battle Arena</h1>
        <p className="text-primary-200">Select your monster and an opponent to battle.</p>
      </div>
      
      <div className="p-6">
        {/* Energy cost and player energy */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-primary-600 mr-2" />
            <span className="font-semibold">Battle Cost:</span>
            <span className="ml-2 text-primary-600 font-semibold">{energyCost} Energy</span>
          </div>
          
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-primary-600 mr-2" />
            <span className="font-semibold">Your Energy:</span>
            <span className={`ml-2 font-semibold ${hasEnoughEnergy ? 'text-green-600' : 'text-red-600'}`}>
              {playerEnergy} / {hasEnoughEnergy ? 'Ready' : 'Not enough'}
            </span>
          </div>
        </div>
        
        {/* Player monster selection */}
        <h2 className="text-lg font-semibold mb-3">Select Your Monster</h2>
        
        {playerMonsters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {playerMonsters.slice(0, 8).map((monster) => (
              <MonsterCard 
                key={monster.id} 
                monster={monster} 
                onClick={() => setSelectedPlayerMonster(monster)}
                isSelected={selectedPlayerMonster?.id === monster.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No monsters available.</p>
            <p className="text-sm text-gray-400 mt-1">Visit the shop to get your first monster.</p>
          </div>
        )}
        
        {/* Difficulty selection */}
        {selectedPlayerMonster && (
          <>
            <h2 className="text-lg font-semibold mb-3">Select Difficulty</h2>
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-lg ${
                  difficulty === 'easy' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-lg ${
                  difficulty === 'medium' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-lg ${
                  difficulty === 'hard' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hard
              </button>
            </div>
            
            {/* Opponent selection */}
            <h2 className="text-lg font-semibold mb-3">Select Your Opponent</h2>
            {availableOpponents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {availableOpponents.map((opponent) => (
                  <MonsterCard 
                    key={opponent.id} 
                    monster={opponent} 
                    onClick={() => setSelectedOpponent(opponent)}
                    isSelected={selectedOpponent?.id === opponent.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 mb-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Loading opponents...</p>
              </div>
            )}
          </>
        )}
        
        {/* Start battle button */}
        <div className="flex justify-center">
          <button
            onClick={startBattle}
            disabled={!selectedPlayerMonster || !selectedOpponent || !hasEnoughEnergy}
            className={`btn ${
              !selectedPlayerMonster || !selectedOpponent || !hasEnoughEnergy
                ? 'bg-gray-300 cursor-not-allowed'
                : 'btn-primary'
            } px-6 py-3`}
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpponentSelection;