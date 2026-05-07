import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Circle, ListPlus } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask.trim(), completed: false, isActive: false }, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const setTaskActive = (id) => {
    setTasks(tasks.map(t => ({ ...t, isActive: t.id === id })));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed));
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col z-10 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100">
          <ListPlus size={20} className="text-indigo-500" />
          <span className="bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
            Görevler
          </span>
        </h2>
        {tasks.some(t => t.completed) && (
          <button 
            onClick={clearCompleted}
            className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium focus:outline-none"
          >
            Bitenleri Sil
          </button>
        )}
      </div>

      <form onSubmit={addTask} className="mb-4 flex relative z-20">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Yeni görev ekle..."
          className="flex-1 w-full bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 rounded-r-xl transition-colors focus:outline-none flex items-center justify-center shadow-sm"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8"
            >
              Henüz görev eklenmedi. Başlamak için bir görev yazın!
            </motion.p>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  task.isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700/50 shadow-sm' 
                    : 'bg-white/40 dark:bg-gray-800/40 border-white/20 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setTaskActive(task.id)}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                    className={`focus:outline-none transition-colors shrink-0 ${task.completed ? 'text-emerald-500' : 'text-gray-400 hover:text-indigo-400'}`}
                  >
                    {task.completed ? <Check size={20} /> : <Circle size={20} />}
                  </button>
                  <span className={`text-sm break-all transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'} ${task.isActive ? 'font-medium' : ''}`}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none shrink-0 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;
