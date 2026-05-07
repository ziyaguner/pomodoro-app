import React from 'react';
import { Target, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Stats = ({ stats, mode }) => {
  const progress = Math.min((stats.pomodorosToday / stats.dailyGoal) * 100, 100);

  const getModeLabel = () => {
    switch(mode) {
      case 'work': return 'Odaklanma';
      case 'shortBreak': return 'Kısa Mola';
      case 'longBreak': return 'Uzun Mola';
      default: return 'Odaklanma';
    }
  };

  const getModeColor = () => {
    switch(mode) {
      case 'work': return 'text-rose-500 dark:text-rose-400';
      case 'shortBreak': return 'text-sky-500 dark:text-sky-400';
      case 'longBreak': return 'text-indigo-500 dark:text-indigo-400';
      default: return 'text-rose-500';
    }
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-gray-800 dark:text-gray-100">
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Durum & Hedef
          </span>
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-lg">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Mevcut Mod</p>
                <p className={`font-semibold ${getModeColor()}`}>{getModeLabel()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Günlük Hedef</span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {stats.pomodorosToday} / {stats.dailyGoal}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-emerald-400 to-sky-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            {progress >= 100 && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-500 mt-2 flex items-center space-x-1 font-medium"
              >
                <Award size={14} />
                <span>Günlük hedefine ulaştın, tebrikler!</span>
              </motion.p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700/50 text-center">
        <p className="text-xs text-gray-400">
          Her 4 pomodoro sonrası uzun mola verilir.
        </p>
      </div>
    </div>
  );
};

export default Stats;
