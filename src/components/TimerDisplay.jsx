import React from 'react';
import { motion } from 'framer-motion';

const TimerDisplay = ({ timeLeft, totalTime, mode, showAdvancedTime, isActive }) => {
  const formatTimeParts = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (showAdvancedTime || h > 0) {
      return {
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
      };
    }
    
    const totalM = Math.floor(seconds / 60);
    return {
      m: totalM.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const getModeStyles = () => {
    switch(mode) {
      case 'work': 
        return {
          glow: 'shadow-rose-500/40',
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/20 dark:bg-rose-950/40',
          textClass: 'text-rose-500 dark:text-rose-400'
        };
      case 'shortBreak': 
        return {
          glow: 'shadow-sky-500/40',
          border: 'border-sky-500/50',
          bg: 'bg-sky-950/20 dark:bg-sky-950/40',
          textClass: 'text-sky-500 dark:text-sky-400'
        };
      case 'longBreak': 
        return {
          glow: 'shadow-indigo-500/40',
          border: 'border-indigo-500/50',
          bg: 'bg-indigo-950/20 dark:bg-indigo-950/40',
          textClass: 'text-indigo-500 dark:text-indigo-400'
        };
      default:
        return {
          glow: 'shadow-rose-500/40',
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/20',
          textClass: 'text-rose-500'
        };
    }
  };

  const styles = getModeStyles();
  const timeParts = formatTimeParts(timeLeft);

  // Time block component
  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2">
      <motion.div 
        className={`relative flex items-center justify-center w-24 h-28 md:w-32 md:h-36 rounded-2xl border-2 backdrop-blur-md transition-all duration-500 
          ${styles.bg} ${isActive ? `${styles.border} shadow-[0_0_20px_rgba(0,0,0,0)] ${styles.glow}` : 'border-gray-200 dark:border-gray-800 shadow-none'}`}
        animate={isActive ? {
          boxShadow: [
            `0px 0px 10px var(--tw-shadow-color)`,
            `0px 0px 25px var(--tw-shadow-color)`,
            `0px 0px 10px var(--tw-shadow-color)`
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <span className={`text-6xl md:text-8xl font-black font-mono tracking-tighter ${styles.textClass} transition-colors duration-500`}>
          {value}
        </span>
        {/* Glass glare effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl pointer-events-none"></div>
      </motion.div>
      <span className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <div className={`text-5xl md:text-6xl font-black font-mono mb-8 ${styles.textClass} opacity-50`}>
      :
    </div>
  );

  return (
    <div className="flex items-center justify-center my-10">
      {timeParts.h && (
        <>
          <TimeBlock value={timeParts.h} label="Saat" />
          <Separator />
        </>
      )}
      <TimeBlock value={timeParts.m} label="Dakika" />
      <Separator />
      <TimeBlock value={timeParts.s} label="Saniye" />
    </div>
  );
};

export default TimerDisplay;
