import { useState, useEffect } from 'react';
import { useCardStore } from '../stores/cardStore';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { initializeThreeJsLoader } from '../utils/threeJsUtils';
import { loadMonsterModels } from '../models/monsterLoader';

export const useGameInitialization = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const initializeCards = useCardStore(state => state.initializeCards);
  const initializePlayer = usePlayerStore(state => state.initializePlayer);
  const setGameLoaded = useGameStore(state => state.setGameLoaded);
  const isGameLoaded = useGameStore(state => state.isGameLoaded);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Skip initialization if game is already loaded
        if (isGameLoaded) {
          setIsLoading(false);
          return;
        }

        // Step 1: Initialize Three.js loaders
        await initializeThreeJsLoader();
        
        // Step 2: Load monster models
        await loadMonsterModels();
        
        // Step 3: Initialize player data from localStorage or with defaults
        initializePlayer();
        
        // Step 4: Initialize card collection
        initializeCards();
        
        // Step 5: Mark game as loaded
        setGameLoaded(true);
        
        // Finish loading
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError(err instanceof Error ? err : new Error('Unknown error during game initialization'));
        setIsLoading(false);
      }
    };

    initialize();
  }, [initializeCards, initializePlayer, setGameLoaded, isGameLoaded]);

  return { isLoading, error };
};