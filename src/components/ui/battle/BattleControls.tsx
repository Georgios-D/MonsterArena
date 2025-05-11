import React from 'react';
import { Dice5, Swords, ArrowRight } from 'lucide-react';
import { BattleState } from '../../../types/game';

interface BattleControlsProps {
  battleState: BattleState;
  onRoll: () => void;
  onAttack: () => void;
  onEndTurn: () => void;
  isRolling: boolean;
}

const BattleControls: React.FC<BattleControlsProps> = ({
  battleState,
  onRoll,
  onAttack,
  onEndTurn,
  isRolling
}) => {
  const { currentTurn, turnPhase, battleStatus } = battleState;
  
  // Only show controls if it's the player's turn and battle is active
  const isPlayerTurn = currentTurn === 'player';
  const isActive = battleStatus === 'active';
  
  // Calculate current attack damage (roll * attack stat)
  const calculateAttackDamage = () => {
    if (!battleState.playerDiceRoll) return 0;
    
    const rawDamage = battleState.playerMonster.stats.attack * battleState.playerDiceRoll;
    const damage = Math.max(1, rawDamage - battleState.opponentMonster.stats.defense);
    return damage;
  };
  
  if (!isActive || !isPlayerTurn) {
    return (
      <div className="battle-controls bg-primary-700 text-white p-4">
        <div className="flex justify-center">
          {battleStatus === 'active' ? (
            <div className="text-primary-100">
              Opponent's turn... 
              <span className="inline-block animate-bounce">•</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
            </div>
          ) : (
            <div className="text-primary-100">
              Battle {battleStatus === 'playerWon' ? 'won!' : 'lost!'}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="battle-controls bg-primary-700 text-white p-4">
      <div className="flex justify-center space-x-4">
        {/* Roll phase */}
        {turnPhase === 'roll' && (
          <button
            onClick={onRoll}
            disabled={isRolling}
            className={`btn ${isRolling ? 'opacity-50 cursor-not-allowed' : 'btn-accent'} 
                      flex items-center py-2 px-6`}
          >
            <Dice5 className="mr-2 h-5 w-5" />
            <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
          </button>
        )}
        
        {/* Attack phase */}
        {turnPhase === 'attack' && (
          <button
            onClick={onAttack}
            className="btn btn-accent flex items-center py-2 px-6"
          >
            <Swords className="mr-2 h-5 w-5" />
            <span>Attack ({calculateAttackDamage()} DMG)</span>
          </button>
        )}
        
        {/* End phase */}
        {turnPhase === 'end' && (
          <button
            onClick={onEndTurn}
            className="btn btn-outline flex items-center py-2 px-6 text-white border-white hover:bg-primary-600"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            <span>End Turn</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BattleControls;