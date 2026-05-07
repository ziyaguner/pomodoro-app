import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-1.5 font-medium">
        <ClockIcon size={14} className="text-indigo-400" />
        <span className="text-sm tracking-widest">{formatTime(time)}</span>
      </div>
      <span className="text-xs mt-0.5 opacity-70">{formatDate(time)}</span>
    </div>
  );
};

export default Clock;
