import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Flame, Volume2, VolumeX, Trees } from 'lucide-react';

const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Yağmur', icon: CloudRain, url: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg' },
  { id: 'fire', label: 'Şömine', icon: Flame, url: 'https://actions.google.com/sounds/v1/foley/fire_burning.ogg' },
  { id: 'forest', label: 'Orman', icon: Trees, url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg' }
];

const AmbientSound = () => {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (activeSound) {
        audioRef.current.play().catch(e => console.log('Audio play error:', e));
        audioRef.current.volume = volume;
      } else {
        audioRef.current.pause();
      }
    }
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSound = (sound) => {
    if (activeSound?.id === sound.id) {
      setActiveSound(null);
    } else {
      setActiveSound(sound);
    }
  };

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Odaklanma Sesleri</h3>
        {activeSound && (
          <div className="flex items-center space-x-2">
            <VolumeX size={14} className="text-gray-400" />
            <input 
              type="range" 
              min="0" max="1" step="0.05" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-indigo-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 size={14} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex justify-around">
        {AMBIENT_SOUNDS.map(sound => {
          const Icon = sound.icon;
          const isActive = activeSound?.id === sound.id;
          return (
            <motion.button
              key={sound.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSound(sound)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all w-20 ${
                isActive 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-inner' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{sound.label}</span>
            </motion.button>
          );
        })}
      </div>

      <audio 
        ref={audioRef} 
        src={activeSound?.url} 
        loop 
        className="hidden" 
      />
    </div>
  );
};

export default AmbientSound;
