import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Controls = ({ isActive, toggle, reset, mode, changeMode, settings, isAlarmRinging, stopAlarm }) => {
  const getModeColor = () => {
    switch(mode) {
      case 'work': return 'from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700 shadow-rose-500/30';
      case 'shortBreak': return 'from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700 shadow-sky-500/30';
      case 'longBreak': return 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 shadow-indigo-500/30';
      default: return 'from-rose-500 to-rose-600 shadow-rose-500/30';
    }
  };

  const skipBreak = () => {
    if (mode !== 'work') {
      changeMode('work');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isAlarmRinging) {
          stopAlarm();
        } else {
          toggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, isAlarmRinging, stopAlarm]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full min-h-[100px]">
      <AnimatePresence mode="wait">
        {isAlarmRinging ? (
          <motion.button
            key="stop-alarm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
            onClick={stopAlarm}
            className="flex items-center justify-center space-x-3 w-48 h-16 rounded-full text-white shadow-xl bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/50 focus:outline-none"
          >
            <BellOff size={24} className="animate-pulse" />
            <span className="font-bold tracking-wider">ZİLİ SUSTUR</span>
          </motion.button>
        ) : (
          <motion.div 
            key="controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center space-x-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm focus:outline-none transition-colors hover:bg-white dark:hover:bg-gray-700"
              title="Sıfırla"
            >
              <RotateCcw size={24} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggle}
              className={`flex items-center justify-center w-20 h-20 rounded-full text-white shadow-xl bg-gradient-to-br focus:outline-none ${getModeColor()}`}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipBreak}
              disabled={mode === 'work'}
              className={`flex items-center justify-center w-14 h-14 rounded-2xl backdrop-blur-md border focus:outline-none transition-all ${
                mode === 'work' 
                  ? 'bg-gray-100/30 dark:bg-gray-800/30 border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-white dark:hover:bg-gray-700'
              }`}
              title="Molayı Atla"
            >
              <FastForward size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
        Başlat / Durdur için <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md shadow-sm mx-1">Space</kbd> tuşuna basın
      </div>
    </div>
  );
};

export default Controls;
