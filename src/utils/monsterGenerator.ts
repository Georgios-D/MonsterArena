import { Monster, MonsterRarity, MonsterType, Ability } from '../types/game';

// Configuration for stat generation based on rarity
const STAT_CONFIGS = {
  [MonsterRarity.COMMON]: {
    health: { min: 50, max: 100 },
    attack: { min: 5, max: 15 },
    defense: { min: 0, max: 5 },
    speed: { min: 1, max: 5 }
  },
  [MonsterRarity.UNCOMMON]: {
    health: { min: 80, max: 150 },
    attack: { min: 10, max: 20 },
    defense: { min: 3, max: 8 },
    speed: { min: 3, max: 7 }
  },
  [MonsterRarity.RARE]: {
    health: { min: 120, max: 200 },
    attack: { min: 15, max: 25 },
    defense: { min: 5, max: 12 },
    speed: { min: 5, max: 10 }
  },
  [MonsterRarity.EPIC]: {
    health: { min: 180, max: 250 },
    attack: { min: 20, max: 32 },
    defense: { min: 8, max: 15 },
    speed: { min: 8, max: 12 }
  },
  [MonsterRarity.LEGENDARY]: {
    health: { min: 250, max: 300 },
    attack: { min: 30, max: 40 },
    defense: { min: 12, max: 20 },
    speed: { min: 10, max: 15 }
  }
};

// Example abilities for each monster type
const TYPE_ABILITIES: Record<MonsterType, Ability[]> = {
  [MonsterType.FIRE]: [
    {
      id: 'fire-blast',
      name: 'Fire Blast',
      description: 'Deals fire damage to the opponent.',
      effect: { type: 'damage', value: 10, target: 'opponent' },
      cooldown: 2
    },
    {
      id: 'heat-wave',
      name: 'Heat Wave',
      description: 'Reduces opponent\'s defense for 3 turns.',
      effect: { type: 'debuff', value: -2, target: 'opponent', duration: 3 },
      cooldown: 4
    }
  ],
  [MonsterType.WATER]: [
    {
      id: 'hydro-pump',
      name: 'Hydro Pump',
      description: 'Deals water damage to the opponent.',
      effect: { type: 'damage', value: 8, target: 'opponent' },
      cooldown: 1
    },
    {
      id: 'aqua-shield',
      name: 'Aqua Shield',
      description: 'Increases defense for 3 turns.',
      effect: { type: 'buff', value: 3, target: 'self', duration: 3 },
      cooldown: 3
    }
  ],
  [MonsterType.EARTH]: [
    {
      id: 'rock-throw',
      name: 'Rock Throw',
      description: 'Deals earth damage to the opponent.',
      effect: { type: 'damage', value: 7, target: 'opponent' },
      cooldown: 1
    },
    {
      id: 'stone-armor',
      name: 'Stone Armor',
      description: 'Significantly increases defense for 2 turns.',
      effect: { type: 'buff', value: 5, target: 'self', duration: 2 },
      cooldown: 4
    }
  ],
  [MonsterType.AIR]: [
    {
      id: 'gust',
      name: 'Gust',
      description: 'Deals air damage to the opponent.',
      effect: { type: 'damage', value: 6, target: 'opponent' },
      cooldown: 1
    },
    {
      id: 'tailwind',
      name: 'Tailwind',
      description: 'Increases speed for 3 turns.',
      effect: { type: 'buff', value: 3, target: 'self', duration: 3 },
      cooldown: 3
    }
  ],
  [MonsterType.ELECTRIC]: [
    {
      id: 'thunderbolt',
      name: 'Thunderbolt',
      description: 'Deals electric damage to the opponent.',
      effect: { type: 'damage', value: 9, target: 'opponent' },
      cooldown: 2
    },
    {
      id: 'overcharge',
      name: 'Overcharge',
      description: 'Increases attack for 2 turns.',
      effect: { type: 'buff', value: 4, target: 'self', duration: 2 },
      cooldown: 3
    }
  ],
  [MonsterType.SHADOW]: [
    {
      id: 'shadow-strike',
      name: 'Shadow Strike',
      description: 'Deals shadow damage to the opponent.',
      effect: { type: 'damage', value: 12, target: 'opponent' },
      cooldown: 3
    },
    {
      id: 'dark-shroud',
      name: 'Dark Shroud',
      description: 'Reduces opponent\'s accuracy for 2 turns.',
      effect: { type: 'debuff', value: -3, target: 'opponent', duration: 2 },
      cooldown: 4
    }
  ],
  [MonsterType.LIGHT]: [
    {
      id: 'radiant-beam',
      name: 'Radiant Beam',
      description: 'Deals light damage to the opponent.',
      effect: { type: 'damage', value: 11, target: 'opponent' },
      cooldown: 2
    },
    {
      id: 'healing-light',
      name: 'Healing Light',
      description: 'Restores health to self.',
      effect: { type: 'heal', value: 15, target: 'self' },
      cooldown: 4
    }
  ],
  [MonsterType.METAL]: [
    {
      id: 'metal-slash',
      name: 'Metal Slash',
      description: 'Deals metal damage to the opponent.',
      effect: { type: 'damage', value: 10, target: 'opponent' },
      cooldown: 2
    },
    {
      id: 'iron-defense',
      name: 'Iron Defense',
      description: 'Greatly increases defense for 2 turns.',
      effect: { type: 'buff', value: 6, target: 'self', duration: 2 },
      cooldown: 5
    }
  ]
};

// Generate random number within a range
const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get description based on type and rarity
const getMonsterDescription = (type: MonsterType, rarity: MonsterRarity): string => {
  const typeDescriptions = {
    [MonsterType.FIRE]: 'A fiery creature with a blazing spirit.',
    [MonsterType.WATER]: 'A aquatic being that flows like water.',
    [MonsterType.EARTH]: 'A sturdy monster with the strength of stone.',
    [MonsterType.AIR]: 'A swift creature that rides the winds.',
    [MonsterType.ELECTRIC]: 'An energetic monster crackling with electricity.',
    [MonsterType.SHADOW]: 'A mysterious being born from darkness.',
    [MonsterType.LIGHT]: 'A radiant creature shining with pure light.',
    [MonsterType.METAL]: 'A resilient monster with metallic features.',
  };
  
  const rarityAdjectives = {
    [MonsterRarity.COMMON]: 'Common',
    [MonsterRarity.UNCOMMON]: 'Remarkable',
    [MonsterRarity.RARE]: 'Exceptional',
    [MonsterRarity.EPIC]: 'Extraordinary',
    [MonsterRarity.LEGENDARY]: 'Legendary',
  };
  
  return `${rarityAdjectives[rarity]} ${typeDescriptions[type]}`;
};

// Generate model ID based on monster attributes
const getModelId = (type: MonsterType, rarity: MonsterRarity): string => {
  // In a real game, this would reference specific model files
  // For now, we'll create placeholder model IDs
  return `monster_${type.toLowerCase()}_${rarity.toLowerCase()}`;
};

interface GenerateMonsterOptions {
  name?: string;
  type?: MonsterType;
  rarity?: MonsterRarity;
  isOwned?: boolean;
}

export const generateMonsterCard = (options: GenerateMonsterOptions = {}): Monster => {
  // Use provided values or generate random ones
  const rarity = options.rarity || 
    Object.values(MonsterRarity)[Math.floor(Math.random() * 5)];
  
  const type = options.type || 
    Object.values(MonsterType)[Math.floor(Math.random() * 8)];
  
  const name = options.name || `Monster-${Math.floor(Math.random() * 1000)}`;
  
  // Get stat range based on rarity
  const statConfig = STAT_CONFIGS[rarity];
  
  // Generate basic stats
  const stats = {
    health: getRandomInRange(statConfig.health.min, statConfig.health.max),
    attack: getRandomInRange(statConfig.attack.min, statConfig.attack.max),
    defense: getRandomInRange(statConfig.defense.min, statConfig.defense.max),
    speed: getRandomInRange(statConfig.speed.min, statConfig.speed.max)
  };
  
  // Select abilities based on type
  const abilities = TYPE_ABILITIES[type];
  
  // Create the monster card
  return {
    id: crypto.randomUUID(),
    name,
    modelId: getModelId(type, rarity),
    rarity,
    type,
    stats,
    abilities,
    description: getMonsterDescription(type, rarity),
    isOwned: options.isOwned || false,
    level: 1
  };
};