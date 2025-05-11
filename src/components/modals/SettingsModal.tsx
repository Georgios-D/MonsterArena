import React from 'react';
import { X, Volume2, Music, VolumeX, Music2 } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { 
    isSoundEnabled, 
    isMusicEnabled, 
    soundVolume, 
    musicVolume, 
    toggleSound, 
    toggleMusic, 
    setSoundVolume, 
    setMusicVolume 
  } = useGameStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleSound}
                  className={`p-2 rounded-full ${
                    isSoundEnabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <div>
                  <p className="font-medium text-gray-800">Sound Effects</p>
                  <p className="text-sm text-gray-500">{isSoundEnabled ? 'On' : 'Off'}</p>
                </div>
              </div>
              
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSoundEnabled}
                  onChange={toggleSound}
                  className="sr-only peer" 
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            {isSoundEnabled && (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="text-xs text-gray-500">{Math.round(soundVolume * 100)}%</span>
              </div>
            )}
          </div>
          
          {/* Music Settings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleMusic}
                  className={`p-2 rounded-full ${
                    isMusicEnabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isMusicEnabled ? <Music className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
                </button>
                <div>
                  <p className="font-medium text-gray-800">Background Music</p>
                  <p className="text-sm text-gray-500">{isMusicEnabled ? 'On' : 'Off'}</p>
                </div>
              </div>
              
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isMusicEnabled}
                  onChange={toggleMusic}
                  className="sr-only peer" 
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            {isMusicEnabled && (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="text-xs text-gray-500">{Math.round(musicVolume * 100)}%</span>
              </div>
            )}
          </div>
          
          {/* Game data management */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Game Data</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                Reset Progress
              </button>
              
              <button
                onClick={() => {
                  // Mock export - in a real app, this would export a JSON file
                  alert('Game data export would be implemented here.');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;