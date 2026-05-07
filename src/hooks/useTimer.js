import { useState, useEffect, useRef, useCallback } from 'react';

const ALARM_SOUNDS = {
  bell: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg',
  digital: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  chime: 'https://actions.google.com/sounds/v1/alarms/doorbell_chime.ogg',
  gentle: 'https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg'
};

export const useTimer = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoro-settings');
    let parsed = saved ? JSON.parse(saved) : null;
    
    if (parsed && parsed.work < 300 && !parsed.showAdvancedTime) {
      parsed.work = parsed.work * 60;
      parsed.shortBreak = parsed.shortBreak * 60;
      parsed.longBreak = parsed.longBreak * 60;
    }

    return parsed || {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
      longBreakInterval: 4,
      autoStartBreak: false,
      autoStartPomodoro: false,
      soundEnabled: true,
      alarmSoundId: 'digital',
      showAdvancedTime: false
    };
  });

  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(settings.work);
  const [isActive, setIsActive] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoro-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed;
      }
    }
    return {
      pomodorosToday: 0,
      dailyGoal: 8,
      date: new Date().toDateString()
    };
  });

  const intervalRef = useRef(null);
  const alarmTimeoutRef = useRef(null);
  const audioRef = useRef(new Audio());

  const stopAlarm = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsAlarmRinging(false);
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
    }
  }, []);

  const playAlarm = useCallback(() => {
    if (settings.soundEnabled) {
      const url = ALARM_SOUNDS[settings.alarmSoundId] || ALARM_SOUNDS.digital;
      audioRef.current.src = url;
      audioRef.current.volume = 0.6;
      audioRef.current.loop = true; // loop until stopped
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsAlarmRinging(true);
          // Stop after 20 seconds maximum
          alarmTimeoutRef.current = setTimeout(() => {
            stopAlarm();
          }, 20000);
        }).catch(e => console.error('Audio play error:', e));
      }
    }
  }, [settings.soundEnabled, settings.alarmSoundId, stopAlarm]);

  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    
    let timeStr = '';
    if (settings.showAdvancedTime) {
      timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else {
      const totalM = Math.floor(timeLeft / 60);
      timeStr = `${totalM.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
      
    const modeStr = mode === 'work' ? 'Odaklanma' : 'Mola';
    
    if (isActive) {
      document.title = `${timeStr} - ${modeStr}`;
    } else {
      document.title = 'Pomodoro App';
    }
  }, [timeLeft, isActive, mode, settings.showAdvancedTime]);

  const reset = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(settings[mode]);
    stopAlarm();
  }, [mode, settings, stopAlarm]);

  const toggle = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  const changeMode = useCallback((newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(settings[newMode]);
    stopAlarm();
  }, [settings, stopAlarm]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(newSettings[mode] !== undefined ? newSettings[mode] : newSettings.work);
  }, [mode]);

  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = useCallback((message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro App', { body: message });
    }
    playAlarm();
  }, [playAlarm]);

  const incrementStats = useCallback(() => {
    setStats(prev => ({
      ...prev,
      pomodorosToday: prev.pomodorosToday + 1
    }));
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && timeLeft === 0) {
      let nextMode = 'work';
      
      if (mode === 'work') {
        incrementStats();
        const newPomodoros = stats.pomodorosToday + 1;
        if (newPomodoros % settings.longBreakInterval === 0) {
          nextMode = 'longBreak';
        } else {
          nextMode = 'shortBreak';
        }
        sendNotification(`Çalışma bitti! ${nextMode === 'longBreak' ? 'Uzun' : 'Kısa'} mola zamanı.`);
      } else {
        nextMode = 'work';
        sendNotification('Mola bitti! Çalışma zamanı.');
      }

      setMode(nextMode);
      setTimeLeft(settings[nextMode]);
      
      const shouldAutoStart = (mode === 'work' && settings.autoStartBreak) || 
                              (mode !== 'work' && settings.autoStartPomodoro);
                              
      if (!shouldAutoStart) {
        setIsActive(false);
      }
    }
  }, [timeLeft, isActive, mode, settings, stats.pomodorosToday, incrementStats, sendNotification]);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return {
    mode,
    changeMode,
    timeLeft,
    isActive,
    settings,
    stats,
    isAlarmRinging,
    stopAlarm,
    toggle,
    reset,
    updateSettings,
    totalTime: settings[mode],
  };
};
