import React from 'react';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import SettingsPanel from './components/SettingsPanel';
import ThemeToggle from './components/ThemeToggle';
import TaskList from './components/TaskList';
import Stats from './components/Stats';
import AmbientSound from './components/AmbientSound';
import MotivationalQuotes from './components/MotivationalQuotes';
import Clock from './components/Clock';
import { useTimer } from './hooks/useTimer';
import { motion } from 'framer-motion';

function App() {
  const {
    mode,
    changeMode,
    timeLeft,
    isActive,
    settings,
    stats,
    isAlarmRinging,
    stopAlarm,
    totalTime,
    toggle,
    reset,
    updateSettings,
  } = useTimer();

  const getContainerBg = () => {
    switch(mode) {
      case 'work': return 'from-rose-50/80 to-rose-100/50 dark:from-rose-900/10 dark:to-gray-900/80';
      case 'shortBreak': return 'from-sky-50/80 to-sky-100/50 dark:from-sky-900/10 dark:to-gray-900/80';
      case 'longBreak': return 'from-indigo-50/80 to-indigo-100/50 dark:from-indigo-900/10 dark:to-gray-900/80';
      default: return 'from-rose-50/80 to-rose-100/50';
    }
  };

  const getModeTabClass = (tabMode) => {
    if (mode === tabMode) {
      switch(tabMode) {
        case 'work': return 'bg-rose-500 text-white shadow-md shadow-rose-500/20';
        case 'shortBreak': return 'bg-sky-500 text-white shadow-md shadow-sky-500/20';
        case 'longBreak': return 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20';
        default: return 'bg-gray-800 text-white';
      }
    }
    return 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-6 transition-colors duration-700 bg-gradient-to-br ${getContainerBg()}`}>
      
      <div className="relative w-full max-w-7xl glass rounded-[2.5rem] p-6 md:p-8 flex flex-col min-h-[85vh] shadow-2xl">
        
        {/* Top Header */}
        <div className="flex justify-between items-start mb-6 z-20">
          <ThemeToggle />
          
          <div className="flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight text-center mb-1"
            >
              Odaklanma Sayacı
            </motion.h1>
            <Clock />
          </div>

          <SettingsPanel currentSettings={settings} onSave={updateSettings} mode={mode} />
        </div>

        {/* 3 Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 items-stretch mt-4">
          
          {/* Left Column: Stats & Ambient Sounds */}
          <div className="w-full lg:w-[25%] flex flex-col order-2 lg:order-1 space-y-6">
            <Stats stats={stats} mode={mode} />
            <AmbientSound />
          </div>
          
          {/* Middle Column: Timer */}
          <div className="w-full lg:w-[50%] flex flex-col items-center justify-center order-1 lg:order-2 glass-panel p-6 border-white/40 dark:border-gray-700/50">
            {/* Mode Selector Tabs */}
            <div className="flex space-x-2 bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-full mb-4 backdrop-blur-md">
              <button
                onClick={() => changeMode('work')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${getModeTabClass('work')}`}
              >
                Odaklanma
              </button>
              <button
                onClick={() => changeMode('shortBreak')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${getModeTabClass('shortBreak')}`}
              >
                Kısa Mola
              </button>
              <button
                onClick={() => changeMode('longBreak')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${getModeTabClass('longBreak')}`}
              >
                Uzun Mola
              </button>
            </div>
            
            <TimerDisplay 
              timeLeft={timeLeft} 
              totalTime={totalTime} 
              mode={mode} 
              showAdvancedTime={settings.showAdvancedTime}
            />
            
            <div className="w-full mt-2">
              <Controls 
                isActive={isActive} 
                toggle={toggle} 
                reset={reset} 
                mode={mode} 
                changeMode={changeMode}
                settings={settings}
                isAlarmRinging={isAlarmRinging}
                stopAlarm={stopAlarm}
              />
            </div>
            
            <MotivationalQuotes mode={mode} />
          </div>

          {/* Right Column: Tasks */}
          <div className="w-full lg:w-[25%] flex flex-col order-3 lg:order-3">
            <TaskList />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
