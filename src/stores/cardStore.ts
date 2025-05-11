import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Monster, MonsterRarity, MonsterType } from '../types/game';
import { generateMonsterCard } from '../utils/monsterGenerator';

interface CardState {
  cards: Monster[];
  ownedCards: Monster[];
  isInitialized: boolean;
  
  // Actions
  initializeCards: () => void;
  addCard: (card: Monster) => void;
  removeCard: (cardId: string) => void;
  upgradeCard: (cardId: string, statToUpgrade: keyof Monster['stats']) => boolean;
  
  // Selectors
  getCardById: (cardId: string) => Monster | undefined;
  getOwnedCards: () => Monster[];
  getCardsByRarity: (rarity: MonsterRarity) => Monster[];
  getCardsByType: (type: MonsterType) => Monster[];
}

export const useCardStore = create<CardState>()(
  persist(
    (set, get) => ({
      cards: [],
      ownedCards: [],
      isInitialized: false,
      
      initializeCards: () => {
        // Only initialize if not already done
        if (get().isInitialized) return;
        
        // Generate starter deck - 3 basic monsters
        const starterDeck = [
          generateMonsterCard({
            name: 'Flameling',
            type: MonsterType.FIRE,
            rarity: MonsterRarity.COMMON,
            isOwned: true
          }),
          generateMonsterCard({
            name: 'Aquafin',
            type: MonsterType.WATER,
            rarity: MonsterRarity.COMMON,
            isOwned: true
          }),
          generateMonsterCard({
            name: 'Terrastump',
            type: MonsterType.EARTH,
            rarity: MonsterRarity.COMMON,
            isOwned: true
          })
        ];
        
        // Generate all possible monster cards for the game
        const allMonsterCards = [
          ...starterDeck,
          // Fire monsters
          generateMonsterCard({ name: 'Emberclaw', type: MonsterType.FIRE, rarity: MonsterRarity.UNCOMMON }),
          generateMonsterCard({ name: 'Pyrovex', type: MonsterType.FIRE, rarity: MonsterRarity.RARE }),
          generateMonsterCard({ name: 'Infernotron', type: MonsterType.FIRE, rarity: MonsterRarity.EPIC }),
          
          // Water monsters
          generateMonsterCard({ name: 'Bubbletide', type: MonsterType.WATER, rarity: MonsterRarity.UNCOMMON }),
          generateMonsterCard({ name: 'Surgewave', type: MonsterType.WATER, rarity: MonsterRarity.RARE }),
          generateMonsterCard({ name: 'Abyssalord', type: MonsterType.WATER, rarity: MonsterRarity.EPIC }),
          
          // Earth monsters
          generateMonsterCard({ name: 'Pebblehide', type: MonsterType.EARTH, rarity: MonsterRarity.UNCOMMON }),
          generateMonsterCard({ name: 'Crystalback', type: MonsterType.EARTH, rarity: MonsterRarity.RARE }),
          generateMonsterCard({ name: 'Monolithus', type: MonsterType.EARTH, rarity: MonsterRarity.EPIC }),
          
          // Air monsters
          generateMonsterCard({ name: 'Breezefluff', type: MonsterType.AIR, rarity: MonsterRarity.UNCOMMON }),
          generateMonsterCard({ name: 'Cyclomaw', type: MonsterType.AIR, rarity: MonsterRarity.RARE }),
          generateMonsterCard({ name: 'Stormraptor', type: MonsterType.AIR, rarity: MonsterRarity.EPIC }),
          
          // Electric monsters
          generateMonsterCard({ name: 'Sparkpup', type: MonsterType.ELECTRIC, rarity: MonsterRarity.UNCOMMON }),
          generateMonsterCard({ name: 'Voltclaw', type: MonsterType.ELECTRIC, rarity: MonsterRarity.RARE }),
          generateMonsterCard({ name: 'Thundertusk', type: MonsterType.ELECTRIC, rarity: MonsterRarity.EPIC }),
          
          // Legendary monsters (one of each type)
          generateMonsterCard({ name: 'Volcanos', type: MonsterType.FIRE, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Tsunamix', type: MonsterType.WATER, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Terraquake', type: MonsterType.EARTH, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Hurricanix', type: MonsterType.AIR, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Gigavoltra', type: MonsterType.ELECTRIC, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Umbrawisp', type: MonsterType.SHADOW, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Solarflare', type: MonsterType.LIGHT, rarity: MonsterRarity.LEGENDARY }),
          generateMonsterCard({ name: 'Chromasteel', type: MonsterType.METAL, rarity: MonsterRarity.LEGENDARY }),
        ];
        
        set({
          cards: allMonsterCards,
          ownedCards: starterDeck,
          isInitialized: true
        });
      },
      
      addCard: (card: Monster) => {
        const updatedCard = { ...card, isOwned: true };
        
        set(state => {
          // Update in the main cards array
          const updatedCards = state.cards.map(c => 
            c.id === card.id ? updatedCard : c
          );
          
          // If this is a new card, add to owned cards
          let newOwnedCards = [...state.ownedCards];
          if (!state.ownedCards.some(c => c.id === card.id)) {
            newOwnedCards.push(updatedCard);
          }
          
          return {
            cards: updatedCards,
            ownedCards: newOwnedCards
          };
        });
      },
      
      removeCard: (cardId: string) => {
        set(state => ({
          ownedCards: state.ownedCards.filter(card => card.id !== cardId),
          cards: state.cards.map(card => 
            card.id === cardId 
              ? { ...card, isOwned: false }
              : card
          )
        }));
      },
      
      upgradeCard: (cardId: string, statToUpgrade: keyof Monster['stats']) => {
        const card = get().cards.find(c => c.id === cardId);
        
        if (!card || !card.isOwned) {
          return false;
        }
        
        set(state => ({
          cards: state.cards.map(c => 
            c.id === cardId 
              ? {
                  ...c,
                  stats: {
                    ...c.stats,
                    [statToUpgrade]: c.stats[statToUpgrade] + 
                      (statToUpgrade === 'health' ? 10 : 
                       statToUpgrade === 'attack' ? 3 : 
                       statToUpgrade === 'defense' ? 2 : 1)
                  },
                  level: c.level + 1
                }
              : c
          ),
          ownedCards: state.ownedCards.map(c => 
            c.id === cardId 
              ? {
                  ...c,
                  stats: {
                    ...c.stats,
                    [statToUpgrade]: c.stats[statToUpgrade] + 
                      (statToUpgrade === 'health' ? 10 : 
                       statToUpgrade === 'attack' ? 3 : 
                       statToUpgrade === 'defense' ? 2 : 1)
                  },
                  level: c.level + 1
                }
              : c
          )
        }));
        
        return true;
      },
      
      getCardById: (cardId: string) => {
        return get().cards.find(card => card.id === cardId);
      },
      
      getOwnedCards: () => {
        return get().ownedCards;
      },
      
      getCardsByRarity: (rarity: MonsterRarity) => {
        return get().cards.filter(card => card.rarity === rarity);
      },
      
      getCardsByType: (type: MonsterType) => {
        return get().cards.filter(card => card.type === type);
      }
    }),
    {
      name: 'monster-cards-storage',
      partialize: (state) => ({ 
        cards: state.cards,
        ownedCards: state.ownedCards,
        isInitialized: state.isInitialized
      })
    }
  )
);