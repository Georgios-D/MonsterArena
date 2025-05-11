import React, { useEffect, useRef } from 'react';
import { BattleLogEntry } from '../../../types/game';

interface BattleLogProps {
  battleLog: BattleLogEntry[];
}

const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLog]);
  
  // Get color for different log entry types
  const getLogEntryColor = (type: BattleLogEntry['type']) => {
    switch (type) {
      case 'player': return 'text-blue-500';
      case 'opponent': return 'text-red-500';
      case 'reward': return 'text-yellow-500';
      case 'system': return 'text-gray-300';
      case 'info': return 'text-green-400';
      default: return 'text-white';
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="battle-log bg-primary-900 border-t border-primary-700 p-4">
      <h3 className="text-white font-semibold mb-2">Battle Log</h3>
      
      <div 
        ref={logContainerRef}
        className="log-entries overflow-y-auto h-32 text-sm"
      >
        {battleLog.map((entry) => (
          <div key={entry.id} className="log-entry mb-1 flex">
            <span className="text-gray-500 text-xs mr-2">
              {formatTimestamp(entry.timestamp)}
            </span>
            <span className={`${getLogEntryColor(entry.type)}`}>
              {entry.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;