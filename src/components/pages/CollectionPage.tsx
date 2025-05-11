import React, { useState } from 'react';
import { Search, ShieldCheck, Heart, Swords, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useCardStore } from '../../stores/cardStore';
import { usePlayerStore } from '../../stores/playerStore';
import { Monster, MonsterRarity, MonsterType } from '../../types/game';
import MonsterCard from '../ui/MonsterCard';

const CollectionPage: React.FC = () => {
  const ownedCards = useCardStore(state => state.ownedCards);
  const player = usePlayerStore(state => state.player);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<MonsterType | 'ALL'>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<MonsterRarity | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'attack' | 'health'>('level');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

  // Filter monsters based on search, type, and rarity
  const filteredMonsters = ownedCards.filter(monster => {
    const matchesSearch = monster.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || monster.type === selectedType;
    const matchesRarity = selectedRarity === 'ALL' || monster.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });

  // Sort monsters
  const sortedMonsters = [...filteredMonsters].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = a.name;
        valueB = b.name;
        break;
      case 'level':
        valueA = a.level;
        valueB = b.level;
        break;
      case 'attack':
        valueA = a.stats.attack;
        valueB = b.stats.attack;
        break;
      case 'health':
        valueA = a.stats.health;
        valueB = b.stats.health;
        break;
      default:
        valueA = a.level;
        valueB = b.level;
    }
    
    if (sortOrder === 'asc') {
      return typeof valueA === 'string' 
        ? valueA.localeCompare(valueB as string) 
        : (valueA as number) - (valueB as number);
    } else {
      return typeof valueA === 'string' 
        ? valueB.localeCompare(valueA as string) 
        : (valueB as number) - (valueA as number);
    }
  });

  // Toggle sort order
  const toggleSort = (criteria: typeof sortBy) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('desc'); // Default to descending when changing criteria
    }
  };

  // Type filters
  const monsterTypes = [
    { value: 'ALL', label: 'All Types' },
    ...Object.values(MonsterType).map(type => ({ 
      value: type, 
      label: type.charAt(0) + type.slice(1).toLowerCase() 
    }))
  ];

  // Rarity filters
  const rarityTypes = [
    { value: 'ALL', label: 'All Rarities' },
    ...Object.values(MonsterRarity).map(rarity => ({ 
      value: rarity, 
      label: rarity.charAt(0) + rarity.slice(1).toLowerCase() 
    }))
  ];

  // Collection stats
  const totalCards = ownedCards.length;
  const rarityDistribution = ownedCards.reduce((acc, monster) => {
    acc[monster.rarity] = (acc[monster.rarity] || 0) + 1;
    return acc;
  }, {} as Record<MonsterRarity, number>);

  // Handle monster selection
  const handleSelectMonster = (monster: Monster) => {
    setSelectedMonster(monster);
  };

  // Clear monster selection
  const clearSelection = () => {
    setSelectedMonster(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Monster Collection</h1>
        <p className="text-gray-600 mb-4">Manage and upgrade your monsters.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 mr-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Cards</p>
              <p className="text-xl font-bold">{totalCards}</p>
            </div>
          </div>
          
          <div className="bg-primary-50 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 mr-3">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Highest Health</p>
              <p className="text-xl font-bold">
                {ownedCards.length > 0 
                  ? Math.max(...ownedCards.map(m => m.stats.health))
                  : 0}
              </p>
            </div>
          </div>
          
          <div className="bg-primary-50 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 mr-3">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Highest Attack</p>
              <p className="text-xl font-bold">
                {ownedCards.length > 0 
                  ? Math.max(...ownedCards.map(m => m.stats.attack))
                  : 0}
              </p>
            </div>
          </div>
          
          <div className="bg-primary-50 rounded-lg p-4 flex flex-col">
            <p className="text-xs text-gray-500 mb-1">Rarity Distribution</p>
            <div className="flex-1 flex items-end space-x-1">
              {Object.values(MonsterRarity).map(rarity => (
                <div 
                  key={rarity}
                  className="flex-1 relative group"
                >
                  <div 
                    className="w-full bg-gradient-to-t rounded-t-sm"
                    style={{
                      height: `${((rarityDistribution[rarity] || 0) / totalCards) * 100}%`,
                      backgroundColor: 
                        rarity === MonsterRarity.COMMON ? '#9CA3AF' :
                        rarity === MonsterRarity.UNCOMMON ? '#34D399' :
                        rarity === MonsterRarity.RARE ? '#3B82F6' :
                        rarity === MonsterRarity.EPIC ? '#A855F7' :
                        '#F59E0B',
                      minHeight: '4px'
                    }}
                  ></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {rarity.charAt(0) + rarity.slice(1).toLowerCase()}: {rarityDistribution[rarity] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search monsters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as MonsterType | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {monsterTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as MonsterRarity | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {rarityTypes.map(rarity => (
                <option key={rarity.value} value={rarity.value}>{rarity.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Sort options */}
        <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 pb-3">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button 
            onClick={() => toggleSort('name')}
            className={`flex items-center text-sm ${sortBy === 'name' ? 'font-semibold text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Name
            {sortBy === 'name' && (
              sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
          
          <button 
            onClick={() => toggleSort('level')}
            className={`flex items-center text-sm ${sortBy === 'level' ? 'font-semibold text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Level
            {sortBy === 'level' && (
              sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
          
          <button 
            onClick={() => toggleSort('health')}
            className={`flex items-center text-sm ${sortBy === 'health' ? 'font-semibold text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Health
            {sortBy === 'health' && (
              sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
          
          <button 
            onClick={() => toggleSort('attack')}
            className={`flex items-center text-sm ${sortBy === 'attack' ? 'font-semibold text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Attack
            {sortBy === 'attack' && (
              sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
        
        {/* Monster card grid */}
        {sortedMonsters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedMonsters.map(monster => (
              <MonsterCard 
                key={monster.id} 
                monster={monster} 
                onClick={() => handleSelectMonster(monster)}
                isSelected={selectedMonster?.id === monster.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">No monsters found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or win more monsters in battles.</p>
          </div>
        )}
      </div>
      
      {/* Selected monster details */}
      {selectedMonster && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">Monster Details</h2>
            <button
              onClick={clearSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                {/* Placeholder for 3D model - would be a Three.js component in full implementation */}
                <div className="text-4xl font-bold text-gray-300 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full mb-4"
                    style={{ 
                      backgroundColor: 
                        selectedMonster.type === 'FIRE' ? '#FEE2E2' : 
                        selectedMonster.type === 'WATER' ? '#E0F2FE' : 
                        selectedMonster.type === 'EARTH' ? '#D1FAE5' : 
                        selectedMonster.type === 'AIR' ? '#F3F4F6' : 
                        selectedMonster.type === 'ELECTRIC' ? '#FEF3C7' : 
                        selectedMonster.type === 'SHADOW' ? '#E5E7EB' : 
                        selectedMonster.type === 'LIGHT' ? '#FEFCE8' : 
                        '#F1F5F9'
                    }}
                  >
                    <span className="flex h-full items-center justify-center text-5xl"
                      style={{ 
                        color: 
                          selectedMonster.type === 'FIRE' ? '#EF4444' : 
                          selectedMonster.type === 'WATER' ? '#0EA5E9' : 
                          selectedMonster.type === 'EARTH' ? '#10B981' : 
                          selectedMonster.type === 'AIR' ? '#6B7280' : 
                          selectedMonster.type === 'ELECTRIC' ? '#F59E0B' : 
                          selectedMonster.type === 'SHADOW' ? '#4B5563' : 
                          selectedMonster.type === 'LIGHT' ? '#EAB308' : 
                          '#64748B'
                      }}
                    >
                      {selectedMonster.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">3D model preview</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">{selectedMonster.type.charAt(0) + selectedMonster.type.slice(1).toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rarity:</span>
                  <span 
                    className="font-medium"
                    style={{
                      color: 
                        selectedMonster.rarity === MonsterRarity.COMMON ? '#6B7280' :
                        selectedMonster.rarity === MonsterRarity.UNCOMMON ? '#10B981' :
                        selectedMonster.rarity === MonsterRarity.RARE ? '#3B82F6' :
                        selectedMonster.rarity === MonsterRarity.EPIC ? '#8B5CF6' :
                        '#F59E0B'
                    }}
                  >
                    {selectedMonster.rarity.charAt(0) + selectedMonster.rarity.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-medium">{selectedMonster.level}</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-8">
              <h3 className="text-2xl font-bold mb-2">{selectedMonster.name}</h3>
              <p className="text-gray-600 mb-6">{selectedMonster.description}</p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Stats</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500 text-sm">Health</span>
                    <span className="font-medium">{selectedMonster.stats.health}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedMonster.stats.health / 300) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500 text-sm">Attack</span>
                    <span className="font-medium">{selectedMonster.stats.attack}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedMonster.stats.attack / 40) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500 text-sm">Defense</span>
                    <span className="font-medium">{selectedMonster.stats.defense}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedMonster.stats.defense / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500 text-sm">Speed</span>
                    <span className="font-medium">{selectedMonster.stats.speed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedMonster.stats.speed / 15) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-3">Abilities</h4>
              <div className="space-y-3 mb-6">
                {selectedMonster.abilities.map(ability => (
                  <div key={ability.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{ability.name}</span>
                      <span className="text-xs text-gray-500">Cooldown: {ability.cooldown} turns</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ability.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block px-2 py-1 bg-gray-200 rounded mr-2">
                        {ability.effect.type.charAt(0).toUpperCase() + ability.effect.type.slice(1)}
                      </span>
                      <span>
                        {ability.effect.value} {ability.effect.type === 'buff' || ability.effect.type === 'debuff' ? 'points' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Upgrade options */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Upgrade Monster</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Spend energy points to upgrade this monster's stats.
                  You have <span className="font-semibold">{player?.energy || 0}</span> energy points available.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      // This would trigger the upgrade logic
                      alert('Upgrade logic would go here');
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                  >
                    <span className="mr-1">Upgrade Health</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      // This would trigger the upgrade logic
                      alert('Upgrade logic would go here');
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                  >
                    <span className="mr-1">Upgrade Attack</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      // This would trigger the upgrade logic
                      alert('Upgrade logic would go here');
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                  >
                    <span className="mr-1">Upgrade Defense</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;