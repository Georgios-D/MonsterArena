import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, PlayerStats, Inventory } from '../types/game';

interface PlayerState {
  player: Player | null;
  isInitialized: boolean;
  
  // Actions
  initializePlayer: () => void;
  setPlayerName: (name: string) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  updateStats: (statUpdates: Partial<PlayerStats>) => void;
  addToInventory: (itemId: string, quantity: number) => void;
  removeFromInventory: (itemId: string, quantity: number) => boolean;
}

const DEFAULT_PLAYER: Player = {
  id: crypto.randomUUID(),
  name: 'Player',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  energy: 50,
  maxEnergy: 50,
  coins: 100,
  inventory: { items: [] },
  stats: {
    battlesWon: 0,
    battlesLost: 0,
    monstersCollected: 3, // Start with 3 monsters
    miniGamesCompleted: 0,
    totalDamageDealt: 0
  }
};

// Calculate XP needed for level
const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      isInitialized: false,
      
      initializePlayer: () => {
        if (get().isInitialized) return;
        
        set({
          player: DEFAULT_PLAYER,
          isInitialized: true
        });
      },
      
      setPlayerName: (name: string) => {
        if (!get().player) return;
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            name
          } : null
        }));
      },
      
      addXp: (amount: number) => {
        if (!get().player) return;
        
        const player = get().player!;
        let newXp = player.xp + amount;
        let newLevel = player.level;
        let newXpToNextLevel = player.xpToNextLevel;
        
        // Level up logic
        while (newXp >= newXpToNextLevel) {
          newXp -= newXpToNextLevel;
          newLevel++;
          newXpToNextLevel = calculateXpForLevel(newLevel);
        }
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            level: newLevel,
            xp: newXp,
            xpToNextLevel: newXpToNextLevel,
            // Increase max energy on level up
            maxEnergy: state.player.maxEnergy + (newLevel > player.level ? 5 : 0),
            // Refill energy on level up
            energy: newLevel > player.level ? 
              state.player.maxEnergy + 5 : 
              state.player.energy
          } : null
        }));
      },
      
      addCoins: (amount: number) => {
        if (!get().player) return;
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            coins: state.player.coins + amount
          } : null
        }));
      },
      
      spendCoins: (amount: number) => {
        if (!get().player) return false;
        
        const player = get().player!;
        if (player.coins < amount) return false;
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            coins: state.player.coins - amount
          } : null
        }));
        
        return true;
      },
      
      addEnergy: (amount: number) => {
        if (!get().player) return;
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            energy: Math.min(
              state.player.energy + amount,
              state.player.maxEnergy
            )
          } : null
        }));
      },
      
      spendEnergy: (amount: number) => {
        if (!get().player) return false;
        
        const player = get().player!;
        if (player.energy < amount) return false;
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            energy: state.player.energy - amount
          } : null
        }));
        
        return true;
      },
      
      updateStats: (statUpdates: Partial<PlayerStats>) => {
        if (!get().player) return;
        
        set(state => ({
          player: state.player ? {
            ...state.player,
            stats: {
              ...state.player.stats,
              ...statUpdates
            }
          } : null
        }));
      },
      
      addToInventory: (itemId: string, quantity: number) => {
        if (!get().player) return;
        
        set(state => {
          const player = state.player!;
          const inventory = player.inventory;
          
          // Check if item already exists
          const existingItemIndex = inventory.items.findIndex(
            item => item.itemId === itemId
          );
          
          let updatedItems;
          if (existingItemIndex >= 0) {
            // Update existing item
            updatedItems = [...inventory.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity
            };
          } else {
            // Add new item
            updatedItems = [
              ...inventory.items,
              {
                id: crypto.randomUUID(),
                itemId,
                quantity
              }
            ];
          }
          
          return {
            player: {
              ...player,
              inventory: {
                ...inventory,
                items: updatedItems
              }
            }
          };
        });
      },
      
      removeFromInventory: (itemId: string, quantity: number) => {
        if (!get().player) return false;
        
        const player = get().player!;
        const inventory = player.inventory;
        
        const existingItemIndex = inventory.items.findIndex(
          item => item.itemId === itemId
        );
        
        if (existingItemIndex < 0) return false;
        
        const existingItem = inventory.items[existingItemIndex];
        if (existingItem.quantity < quantity) return false;
        
        set(state => {
          const updatedItems = [...state.player!.inventory.items];
          
          if (existingItem.quantity === quantity) {
            // Remove item completely
            updatedItems.splice(existingItemIndex, 1);
          } else {
            // Update quantity
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity - quantity
            };
          }
          
          return {
            player: {
              ...state.player!,
              inventory: {
                ...state.player!.inventory,
                items: updatedItems
              }
            }
          };
        });
        
        return true;
      }
    }),
    {
      name: 'monster-game-player',
      partialize: (state) => ({
        player: state.player,
        isInitialized: state.isInitialized
      })
    }
  )
);