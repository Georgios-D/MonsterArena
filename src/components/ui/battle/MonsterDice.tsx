import React from 'react';

interface MonsterDiceProps {
  playerRoll: number | null;
  opponentRoll: number | null;
  isRolling: boolean;
  currentTurn: 'player' | 'opponent';
}

const MonsterDice: React.FC<MonsterDiceProps> = ({ 
  playerRoll, 
  opponentRoll, 
  isRolling,
  currentTurn
}) => {
  // Helper to render dice dots based on roll value
  const renderDiceDots = (roll: number | null) => {
    if (roll === null) return null;
    
    // Pattern of dots for each dice face
    const dotPatterns = {
      1: [<div key="center" className="dot center"></div>],
      2: [
        <div key="top-right" className="dot top right"></div>,
        <div key="bottom-left" className="dot bottom left"></div>
      ],
      3: [
        <div key="top-right" className="dot top right"></div>,
        <div key="center" className="dot center"></div>,
        <div key="bottom-left" className="dot bottom left"></div>
      ],
      4: [
        <div key="top-left" className="dot top left"></div>,
        <div key="top-right" className="dot top right"></div>,
        <div key="bottom-left" className="dot bottom left"></div>,
        <div key="bottom-right" className="dot bottom right"></div>
      ],
      5: [
        <div key="top-left" className="dot top left"></div>,
        <div key="top-right" className="dot top right"></div>,
        <div key="center" className="dot center"></div>,
        <div key="bottom-left" className="dot bottom left"></div>,
        <div key="bottom-right" className="dot bottom right"></div>
      ],
      6: [
        <div key="top-left" className="dot top left"></div>,
        <div key="top-right" className="dot top right"></div>,
        <div key="middle-left" className="dot middle left"></div>,
        <div key="middle-right" className="dot middle right"></div>,
        <div key="bottom-left" className="dot bottom left"></div>,
        <div key="bottom-right" className="dot bottom right"></div>
      ],
    };
    
    return dotPatterns[roll as keyof typeof dotPatterns] || null;
  };
  
  return (
    <div className="dice-container flex space-x-4 px-4">
      {/* Player's dice */}
      <div className="player-dice">
        <div 
          className={`battle-dice player-dice ${
            currentTurn === 'player' && isRolling ? 'animate-spin' : ''
          } ${
            playerRoll === 6 ? 'bg-yellow-100 border-yellow-400' : ''
          }`}
        >
          {isRolling && currentTurn === 'player' ? (
            <span className="text-primary-600">...</span>
          ) : (
            playerRoll !== null ? (
              <div className="dice-face">
                {renderDiceDots(playerRoll)}
              </div>
            ) : (
              <span className="text-gray-400">?</span>
            )
          )}
        </div>
        <div className="text-center mt-1 text-xs font-medium">
          Your Roll
        </div>
      </div>
      
      {/* Info text */}
      <div className="dice-info flex items-center">
        <div className="text-center text-sm px-2">
          {isRolling ? (
            <span className="animate-pulse">Rolling...</span>
          ) : (
            playerRoll !== null && opponentRoll !== null ? (
              <span className="font-medium">
                {playerRoll > opponentRoll ? 'You win the roll!' : 
                 opponentRoll > playerRoll ? 'Opponent wins the roll!' : 
                 'It\'s a tie!'}
              </span>
            ) : (
              currentTurn === 'player' ? 
                <span>Roll your dice!</span> : 
                <span>Opponent's turn...</span>
            )
          )}
        </div>
      </div>
      
      {/* Opponent's dice */}
      <div className="opponent-dice">
        <div 
          className={`battle-dice opponent-dice ${
            currentTurn === 'opponent' && isRolling ? 'animate-spin' : ''
          } ${
            opponentRoll === 6 ? 'bg-yellow-100 border-yellow-400' : ''
          }`}
        >
          {isRolling && currentTurn === 'opponent' ? (
            <span className="text-primary-600">...</span>
          ) : (
            opponentRoll !== null ? (
              <div className="dice-face">
                {renderDiceDots(opponentRoll)}
              </div>
            ) : (
              <span className="text-gray-400">?</span>
            )
          )}
        </div>
        <div className="text-center mt-1 text-xs font-medium">
          Opponent's Roll
        </div>
      </div>
    </div>
  );
};

export default MonsterDice;