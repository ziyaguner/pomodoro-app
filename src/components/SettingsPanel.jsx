import React, { useState, useEffect } from 'react';
import { Settings, X, Volume2, VolumeX, ArrowRightCircle, Music, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPanel = ({ currentSettings, onSave, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(currentSettings);

  // Sync when panel opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(currentSettings);
    }
  }, [isOpen, currentSettings]);

  const handleSave = () => {
    onSave(localSettings);
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTimeChange = (modeName, field, value) => {
    const val = parseInt(value) || 0;
    const currentTotal = localSettings[modeName];
    let h = Math.floor(currentTotal / 3600);
    let m = Math.floor((currentTotal % 3600) / 60);
    let s = currentTotal % 60;

    if (field === 'h') h = val;
    if (field === 'm') m = val;
    if (field === 's') s = val;

    const newTotal = (h * 3600) + (m * 60) + s;
    setLocalSettings(prev => ({ ...prev, [modeName]: newTotal }));
  };

  const handleMinuteOnlyChange = (modeName, value) => {
    const val = parseInt(value) || 0;
    // Just save as seconds
    setLocalSettings(prev => ({ ...prev, [modeName]: val * 60 }));
  };

  const renderTimeInput = (label, modeName) => {
    const totalSecs = localSettings[modeName];
    
    if (localSettings.showAdvancedTime) {
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      return (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
          <div className="flex items-center space-x-2">
            <input
              type="number" min="0" max="23"
              value={h} onChange={(e) => handleTimeChange(modeName, 'h', e.target.value)}
              className="w-1/3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-gray-800 dark:text-gray-100"
              placeholder="Saat"
            />
            <span className="text-gray-400">:</span>
            <input
              type="number" min="0" max="59"
              value={m} onChange={(e) => handleTimeChange(modeName, 'm', e.target.value)}
              className="w-1/3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-gray-800 dark:text-gray-100"
              placeholder="Dk"
            />
            <span className="text-gray-400">:</span>
            <input
              type="number" min="0" max="59"
              value={s} onChange={(e) => handleTimeChange(modeName, 's', e.target.value)}
              className="w-1/3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-gray-800 dark:text-gray-100"
              placeholder="Sn"
            />
          </div>
        </div>
      );
    } else {
      const totalM = Math.floor(totalSecs / 60);
      return (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{label} (Dakika)</label>
          <input
            type="number" min="1" max="999"
            value={totalM} onChange={(e) => handleMinuteOnlyChange(modeName, e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm font-medium text-gray-800 dark:text-gray-100"
          />
        </div>
      );
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 shadow-sm text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
      >
        <Settings size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-sky-500 to-indigo-500"></div>
              
              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-sans tracking-tight">Ayarlar</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Advanced Time Toggle */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center space-x-2">
                      <Clock size={18} className="text-indigo-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gelişmiş Zaman Ayarı (Saat/Dk/Sn)</span>
                    </div>
                    <input
                      type="checkbox"
                      name="showAdvancedTime"
                      checked={localSettings.showAdvancedTime}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-800"
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Süreler</h3>
                  <div className={`grid ${localSettings.showAdvancedTime ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
                    {renderTimeInput("Çalışma", "work")}
                    {renderTimeInput("Kısa Mola", "shortBreak")}
                    {renderTimeInput("Uzun Mola", "longBreak")}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Hedefler & Geçişler</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Uzun Mola Aralığı</span>
                      <input
                        type="number"
                        name="longBreakInterval"
                        min="1"
                        max="10"
                        value={localSettings.longBreakInterval}
                        onChange={handleChange}
                        className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm text-gray-800 dark:text-gray-100"
                      />
                    </div>
                    
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-2">
                        <ArrowRightCircle size={18} className="text-emerald-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Otomatik Molaya Geç</span>
                      </div>
                      <input
                        type="checkbox"
                        name="autoStartBreak"
                        checked={localSettings.autoStartBreak}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-900"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-2">
                        <ArrowRightCircle size={18} className="text-rose-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Otomatik Çalışmaya Geç</span>
                      </div>
                      <input
                        type="checkbox"
                        name="autoStartPomodoro"
                        checked={localSettings.autoStartPomodoro}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500 bg-gray-50 dark:bg-gray-900"
                      />
                    </label>

                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Ses ve Bildirimler</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-2">
                        {localSettings.soundEnabled ? <Volume2 size={18} className="text-indigo-500" /> : <VolumeX size={18} className="text-gray-400" />}
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Alarm Sesi Açık</span>
                      </div>
                      <input
                        type="checkbox"
                        name="soundEnabled"
                        checked={localSettings.soundEnabled}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-900"
                      />
                    </label>

                    {localSettings.soundEnabled && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Music size={18} className="text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Alarm Tonu</span>
                        </div>
                        <select
                          name="alarmSoundId"
                          value={localSettings.alarmSoundId || 'digital'}
                          onChange={handleChange}
                          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 dark:text-gray-100"
                        >
                          <option value="digital">Dijital Saat</option>
                          <option value="bell">Zil (Bugle)</option>
                          <option value="chime">Kapı Zili</option>
                          <option value="gentle">Hafif Gemi</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full mt-6 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium py-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
