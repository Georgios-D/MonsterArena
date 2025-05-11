// Types for the game's core objects and systems

// Monster card definition
export interface Monster {
  id: string;
  name: string;
  modelId: string; // Reference to the 3D model
  rarity: MonsterRarity;
  type: MonsterType;
  stats: MonsterStats;
  abilities: Ability[];
  description: string;
  isOwned: boolean;
  level: number;
}

export interface MonsterStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

export enum MonsterRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum MonsterType {
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  ELECTRIC = 'electric',
  SHADOW = 'shadow',
  LIGHT = 'light',
  METAL = 'metal'
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  effect: AbilityEffect;
  cooldown: number;
}

export type AbilityEffect = {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
  value: number;
  target: 'self' | 'opponent' | 'all';
  duration?: number;
}

// Battle system types
export interface BattleState {
  playerMonster: Monster;
  opponentMonster: Monster;
  playerHealth: number;
  opponentHealth: number;
  currentTurn: 'player' | 'opponent';
  playerDiceRoll: number | null;
  opponentDiceRoll: number | null;
  battleLog: BattleLogEntry[];
  battleStatus: 'ready' | 'active' | 'playerWon' | 'opponentWon';
  turnPhase: 'roll' | 'attack' | 'defense' | 'ability' | 'end';
}

export interface BattleLogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'player' | 'opponent' | 'system' | 'reward';
}

// Player profile
export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number;
  maxEnergy: number;
  coins: number;
  inventory: Inventory;
  stats: PlayerStats;
}

export interface PlayerStats {
  battlesWon: number;
  battlesLost: number;
  monstersCollected: number;
  miniGamesCompleted: number;
  totalDamageDealt: number;
}

export interface Inventory {
  items: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  itemId: string;
  quantity: number;
}

// Game items
export interface GameItem {
  id: string;
  name: string;
  description: string;
  type: 'card' | 'potion' | 'upgrade' | 'special';
  rarity: ItemRarity;
  effect: ItemEffect;
  price: number;
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export type ItemEffect = {
  type: 'heal' | 'buff' | 'card' | 'energy' | 'coin';
  value: number;
  target?: string;
}

// Mini-game types
export interface MiniGame {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: GameReward[];
  energyCost: number;
}

export interface GameReward {
  type: 'card' | 'item' | 'energy' | 'coin' | 'xp';
  value: number;
  itemId?: string;
}