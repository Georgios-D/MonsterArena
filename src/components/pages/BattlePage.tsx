import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Swords, Dice5, Zap, Award, ArrowRight, X } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { useCardStore } from '../../stores/cardStore';
import { useGameStore } from '../../stores/gameStore';
import { Monster, BattleState, BattleLogEntry, MonsterRarity } from '../../types/game';
import MonsterDice from '../ui/battle/MonsterDice';
import BattleArena from '../ui/battle/BattleArena';
import BattleLog from '../ui/battle/BattleLog';
import BattleControls from '../ui/battle/BattleControls';
import OpponentSelection from '../ui/battle/OpponentSelection';
import BattleResults from '../ui/battle/BattleResults';

const ENERGY_COST = 5;
const BASE_XP_REWARD = 20;
const BASE_COIN_REWARD = 15;

const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const player = usePlayerStore(state => state.player);
  const addXp = usePlayerStore(state => state.addXp);
  const addCoins = usePlayerStore(state => state.addCoins);
  const spendEnergy = usePlayerStore(state => state.spendEnergy);
  const updateStats = usePlayerStore(state => state.updateStats);
  const ownedCards = useCardStore(state => state.ownedCards);
  const battleState = useGameStore(state => state.battleState);
  const setBattleState = useGameStore(state => state.setBattleState);
  const updateBattleState = useGameStore(state => state.updateBattleState);
  const [showSelection, setShowSelection] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [rewards, setRewards] = useState({ xp: 0, coins: 0, cardDrop: null as Monster | null });
  const [isRolling, setIsRolling] = useState(false);

  // Initialize battle when an opponent is selected
  const initBattle = (playerMonster: Monster, opponentMonster: Monster) => {
    // Check if player has enough energy
    if (player && player.energy < ENERGY_COST) {
      alert('Not enough energy to start a battle! Play mini-games to gain more energy.');
      return;
    }

    // Spend energy to start the battle
    spendEnergy(ENERGY_COST);

    // Create the initial battle state
    const initialBattleState: BattleState = {
      playerMonster,
      opponentMonster,
      playerHealth: playerMonster.stats.health,
      opponentHealth: opponentMonster.stats.health,
      currentTurn: 'player', // Player starts
      playerDiceRoll: null,
      opponentDiceRoll: null,
      battleLog: [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          message: 'Battle started! Roll the dice to attack!',
          type: 'system'
        }
      ],
      battleStatus: 'active',
      turnPhase: 'roll'
    };

    // Set the battle state in the store
    setBattleState(initialBattleState);
    setShowSelection(false);
  };

  // Roll dice for player or opponent
  const rollDice = () => {
    if (!battleState || battleState.battleStatus !== 'active') return;
    
    // Only roll if it's the correct turn and phase
    if (battleState.currentTurn === 'player' && battleState.turnPhase === 'roll') {
      // Roll animation
      setIsRolling(true);
      
      setTimeout(() => {
        // Generate random roll between 1-6
        const roll = Math.floor(Math.random() * 6) + 1;
        
        // Update battle state with roll
        updateBattleState({
          playerDiceRoll: roll,
          turnPhase: 'attack',
          battleLog: [
            ...battleState.battleLog,
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              message: `You rolled a ${roll}!`,
              type: 'player'
            }
          ]
        });
        
        setIsRolling(false);
      }, 1500); // Duration of dice roll animation
    }
  };

  // Perform attack based on current dice roll
  const performAttack = () => {
    if (!battleState || battleState.battleStatus !== 'active' || battleState.turnPhase !== 'attack') return;

    // Get the current attacker and defender based on turn
    const { playerMonster, opponentMonster, playerDiceRoll, opponentDiceRoll } = battleState;
    const attacker = battleState.currentTurn === 'player' ? playerMonster : opponentMonster;
    const attackRoll = battleState.currentTurn === 'player' ? playerDiceRoll : opponentDiceRoll;
    
    if (attackRoll === null) return;

    // Calculate damage: attack * dice roll - defender's defense
    const rawDamage = attacker.stats.attack * attackRoll;
    const defender = battleState.currentTurn === 'player' ? opponentMonster : playerMonster;
    const damage = Math.max(1, rawDamage - defender.stats.defense); // Minimum damage is 1
    
    // Update health and log
    if (battleState.currentTurn === 'player') {
      const newOpponentHealth = Math.max(0, battleState.opponentHealth - damage);
      const isCritical = attackRoll === 6;
      
      // Update the battle state
      updateBattleState({
        opponentHealth: newOpponentHealth,
        turnPhase: 'end',
        battleLog: [
          ...battleState.battleLog,
          {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message: `${isCritical ? 'CRITICAL HIT! ' : ''}Your ${playerMonster.name} dealt ${damage} damage to opponent's ${opponentMonster.name}!`,
            type: 'player'
          }
        ]
      });
      
      // Check if opponent is defeated
      if (newOpponentHealth <= 0) {
        endBattle('playerWon');
        return;
      }
    } else {
      const newPlayerHealth = Math.max(0, battleState.playerHealth - damage);
      const isCritical = attackRoll === 6;
      
      // Update the battle state
      updateBattleState({
        playerHealth: newPlayerHealth,
        turnPhase: 'end',
        battleLog: [
          ...battleState.battleLog,
          {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message: `${isCritical ? 'CRITICAL HIT! ' : ''}Opponent's ${opponentMonster.name} dealt ${damage} damage to your ${playerMonster.name}!`,
            type: 'opponent'
          }
        ]
      });
      
      // Check if player is defeated
      if (newPlayerHealth <= 0) {
        endBattle('opponentWon');
        return;
      }
    }
  };

  // Switch turns at the end of a turn
  const endTurn = () => {
    if (!battleState || battleState.battleStatus !== 'active' || battleState.turnPhase !== 'end') return;
    
    // Switch turns
    const nextTurn = battleState.currentTurn === 'player' ? 'opponent' : 'player';
    
    updateBattleState({
      currentTurn: nextTurn,
      playerDiceRoll: nextTurn === 'player' ? null : battleState.playerDiceRoll,
      opponentDiceRoll: nextTurn === 'opponent' ? null : battleState.opponentDiceRoll,
      turnPhase: 'roll',
      battleLog: [
        ...battleState.battleLog,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          message: `${nextTurn === 'player' ? 'Your' : 'Opponent\'s'} turn.`,
          type: 'system'
        }
      ]
    });
  };

  // Handle opponent's turn
  useEffect(() => {
    // AI logic for opponent's turn
    if (battleState && battleState.battleStatus === 'active' && battleState.currentTurn === 'opponent') {
      // Add a delay to make the opponent's turn feel natural
      const rollTimeout = setTimeout(() => {
        if (battleState.turnPhase === 'roll') {
          // AI rolls the dice
          const aiRoll = Math.floor(Math.random() * 6) + 1;
          
          updateBattleState({
            opponentDiceRoll: aiRoll,
            turnPhase: 'attack',
            battleLog: [
              ...battleState.battleLog,
              {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                message: `Opponent rolled a ${aiRoll}!`,
                type: 'opponent'
              }
            ]
          });
        }
      }, 1500);
      
      // After rolling, perform attack
      const attackTimeout = setTimeout(() => {
        if (battleState.turnPhase === 'attack') {
          performAttack();
        }
      }, 3000);
      
      // End turn
      const endTurnTimeout = setTimeout(() => {
        if (battleState.turnPhase === 'end') {
          endTurn();
        }
      }, 4500);
      
      // Clean up timeouts
      return () => {
        clearTimeout(rollTimeout);
        clearTimeout(attackTimeout);
        clearTimeout(endTurnTimeout);
      };
    }
  }, [battleState?.currentTurn, battleState?.turnPhase]);

  // Calculate and distribute rewards when battle ends
  const calculateRewards = (battleResult: 'playerWon' | 'opponentWon') => {
    if (!battleState || !player) return;
    
    if (battleResult === 'playerWon') {
      // Calculate XP based on opponent's rarity and level
      const rarityMultiplier = {
        [MonsterRarity.COMMON]: 1,
        [MonsterRarity.UNCOMMON]: 1.5,
        [MonsterRarity.RARE]: 2,
        [MonsterRarity.EPIC]: 3,
        [MonsterRarity.LEGENDARY]: 5
      };
      
      const opponentRarity = battleState.opponentMonster.rarity;
      const opponentLevel = battleState.opponentMonster.level;
      
      const xpReward = Math.floor(
        BASE_XP_REWARD * 
        rarityMultiplier[opponentRarity] * 
        (1 + opponentLevel * 0.1)
      );
      
      // Calculate coin reward
      const coinReward = Math.floor(
        BASE_COIN_REWARD * 
        rarityMultiplier[opponentRarity] * 
        (1 + opponentLevel * 0.05)
      );
      
      // Determine if player gets a card drop (chance based on rarity)
      let cardDrop: Monster | null = null;
      const dropChance = Math.random();
      if (
        (opponentRarity === MonsterRarity.LEGENDARY && dropChance < 0.05) ||
        (opponentRarity === MonsterRarity.EPIC && dropChance < 0.10) ||
        (opponentRarity === MonsterRarity.RARE && dropChance < 0.20) ||
        (opponentRarity === MonsterRarity.UNCOMMON && dropChance < 0.30) ||
        (opponentRarity === MonsterRarity.COMMON && dropChance < 0.50)
      ) {
        // Clone the opponent's monster as a drop
        cardDrop = { ...battleState.opponentMonster };
      }
      
      // Save rewards for display
      setRewards({
        xp: xpReward,
        coins: coinReward,
        cardDrop
      });
      
      // Update player stats
      addXp(xpReward);
      addCoins(coinReward);
      updateStats({
        battlesWon: player.stats.battlesWon + 1,
        totalDamageDealt: player.stats.totalDamageDealt + 
          (battleState.opponentMonster.stats.health - battleState.opponentHealth)
      });
      
      // Add card to collection if there's a drop
      if (cardDrop) {
        const addCard = useCardStore.getState().addCard;
        addCard(cardDrop);
        updateStats({
          monstersCollected: player.stats.monstersCollected + 1
        });
      }
    } else {
      // Player lost - still give some XP for trying
      const xpReward = Math.floor(BASE_XP_REWARD * 0.25);
      
      // Save rewards
      setRewards({
        xp: xpReward,
        coins: 0,
        cardDrop: null
      });
      
      // Update player stats
      addXp(xpReward);
      updateStats({
        battlesLost: player.stats.battlesLost + 1,
        totalDamageDealt: player.stats.totalDamageDealt + 
          (battleState.opponentMonster.stats.health - battleState.opponentHealth)
      });
    }
  };

  // End the battle and show results
  const endBattle = (result: 'playerWon' | 'opponentWon') => {
    if (!battleState) return;
    
    // Update battle status
    updateBattleState({
      battleStatus: result,
      battleLog: [
        ...battleState.battleLog,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          message: result === 'playerWon' 
            ? `Victory! You defeated the opponent's ${battleState.opponentMonster.name}!` 
            : `Defeat! Your ${battleState.playerMonster.name} was defeated.`,
          type: result === 'playerWon' ? 'system' : 'opponent'
        }
      ]
    });
    
    // Calculate and distribute rewards
    calculateRewards(result);
    
    // Show results screen after a short delay
    setTimeout(() => {
      setShowResults(true);
    }, 2000);
  };

  // Reset the battle state and return to selection
  const resetBattle = () => {
    setBattleState(null);
    setShowSelection(true);
    setShowResults(false);
  };

  // If player has no monsters, redirect to collection
  useEffect(() => {
    if (ownedCards.length === 0) {
      navigate('/collection');
    }
  }, [ownedCards, navigate]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {showSelection && (
        <OpponentSelection 
          playerMonsters={ownedCards}
          onSelectOpponent={initBattle}
          playerEnergy={player.energy}
          energyCost={ENERGY_COST}
        />
      )}

      {battleState && !showSelection && !showResults && (
        <div className="battle-container">
          <div className="relative">
            {/* Top bar with battle info */}
            <div className="bg-primary-800 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Swords className="w-5 h-5 mr-2" />
                <h1 className="text-xl font-bold">Monster Battle</h1>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to forfeit this battle?')) {
                    resetBattle();
                  }
                }}
                className="p-2 hover:bg-primary-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Battle arena */}
            <BattleArena 
              playerMonster={battleState.playerMonster}
              opponentMonster={battleState.opponentMonster}
              playerHealth={battleState.playerHealth}
              opponentHealth={battleState.opponentHealth}
              playerMaxHealth={battleState.playerMonster.stats.health}
              opponentMaxHealth={battleState.opponentMonster.stats.health}
              currentTurn={battleState.currentTurn}
              battleStatus={battleState.battleStatus}
            />

            {/* Battle controls */}
            <BattleControls 
              battleState={battleState}
              onRoll={rollDice}
              onAttack={performAttack}
              onEndTurn={endTurn}
              isRolling={isRolling}
            />

            {/* Battle dice */}
            <div className="flex justify-center -mt-8 mb-4 relative z-10">
              <MonsterDice 
                playerRoll={battleState.playerDiceRoll}
                opponentRoll={battleState.opponentDiceRoll}
                isRolling={isRolling}
                currentTurn={battleState.currentTurn}
              />
            </div>

            {/* Battle log */}
            <BattleLog battleLog={battleState.battleLog} />
          </div>
        </div>
      )}

      {showResults && battleState && (
        <BattleResults 
          result={battleState.battleStatus}
          playerMonster={battleState.playerMonster}
          opponentMonster={battleState.opponentMonster}
          rewards={rewards}
          onContinue={resetBattle}
        />
      )}
    </div>
  );
};

export default BattlePage;