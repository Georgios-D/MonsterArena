import React, { useEffect, useRef } from 'react';
import { getMonsterModel } from '../../../models/monsterLoader';
import { MonsterType } from '../../../types/game';

interface MonsterModelProps {
  modelId: string;
  type: string;
  isActive: boolean;
}

const MonsterModel: React.FC<MonsterModelProps> = ({ modelId, type, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // In a real implementation, this would use Three.js to render the 3D model
  // For now, we'll render a placeholder based on the monster type
  
  useEffect(() => {
    if (containerRef.current) {
      // This would initialize Three.js and load the model
      // For the placeholder, we'll just add some animation classes
      
      // In a real implementation:
      // 1. Create Three.js scene, camera, renderer
      // 2. Load the model using the modelId
      // 3. Add lighting and set up animations
      // 4. Handle resize events
      
      // Placeholder: we're just calling getMonsterModel to simulate model loading
      const model = getMonsterModel(modelId);
      console.log(`Loaded model placeholder for ${modelId}:`, model);
    }
  }, [modelId]);
  
  // Get color based on monster type
  const getTypeColor = () => {
    switch (type.toUpperCase()) {
      case 'FIRE': return '#EF4444';
      case 'WATER': return '#0EA5E9';
      case 'EARTH': return '#10B981';
      case 'AIR': return '#6B7280';
      case 'ELECTRIC': return '#F59E0B';
      case 'SHADOW': return '#4B5563';
      case 'LIGHT': return '#EAB308';
      case 'METAL': return '#64748B';
      default: return '#8B5CF6';
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`monster-model w-full h-full flex items-center justify-center 
                ${isActive ? 'animate-pulse-slow' : ''}`}
    >
      {/* Placeholder for Three.js model */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center text-white"
        style={{ 
          backgroundColor: getTypeColor(),
          boxShadow: isActive ? `0 0 15px ${getTypeColor()}` : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <span className="text-2xl font-bold">{type.charAt(0)}</span>
      </div>
    </div>
  );
};

export default MonsterModel;