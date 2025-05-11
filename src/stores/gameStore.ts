import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BattleState } from '../types/game';

interface GameState {
  isGameLoaded: boolean;
  currentScreen: 'home' | 'collection' | 'battle' | 'minigames' | 'shop';
  battleState: BattleState | null;
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  lastPlayed: string | null;
  
  // Actions
  setGameLoaded: (isLoaded: boolean) => void;
  setCurrentScreen: (screen: GameState['currentScreen']) => void;
  setBattleState: (state: BattleState | null) => void;
  updateBattleState: (update: Partial<BattleState>) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setSoundVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setLastPlayed: (date: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      isGameLoaded: false,
      currentScreen: 'home',
      battleState: null,
      isSoundEnabled: true,
      isMusicEnabled: true,
      soundVolume: 0.7,
      musicVolume: 0.5,
      lastPlayed: null,
      
      setGameLoaded: (isLoaded: boolean) => {
        set({ isGameLoaded });
      },
      
      setCurrentScreen: (screen) => {
        set({ currentScreen: screen });
      },
      
      setBattleState: (state) => {
        set({ battleState: state });
      },
      
      updateBattleState: (update) => {
        const currentBattle = get().battleState;
        if (!currentBattle) return;
        
        set({
          battleState: {
            ...currentBattle,
            ...update
          }
        });
      },
      
      toggleSound: () => {
        set(state => ({
          isSoundEnabled: !state.isSoundEnabled
        }));
      },
      
      toggleMusic: () => {
        set(state => ({
          isMusicEnabled: !state.isMusicEnabled
        }));
      },
      
      setSoundVolume: (volume) => {
        set({ soundVolume: volume });
      },
      
      setMusicVolume: (volume) => {
        set({ musicVolume: volume });
      },
      
      setLastPlayed: (date) => {
        set({ lastPlayed: date });
      }
    }),
    {
      name: 'monster-game-state',
      partialize: (state) => ({
        isSoundEnabled: state.isSoundEnabled,
        isMusicEnabled: state.isMusicEnabled,
        soundVolume: state.soundVolume,
        musicVolume: state.musicVolume,
        lastPlayed: state.lastPlayed
      })
    }
  )
);