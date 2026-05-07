import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const QUOTES = [
  "Başlamak için mükemmel olmayı bekleme.",
  "Zaman en değerli sermayendir, onu boşa harcama.",
  "Küçük adımlar, büyük başarıların habercisidir.",
  "Motivasyon seni başlatır, disiplin devam ettirir.",
  "Sadece bir adım daha at. Sonra bir adım daha.",
  "Odaklandığın şey büyür.",
  "Bugün yapacağın bir şey, yarınki seni kurtarabilir.",
  "Ertelemek, kolay olanı zor; zor olanı imkansız yapar."
];

const MotivationalQuotes = ({ mode }) => {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Change quote every time mode changes
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, [mode]);

  return (
    <div className="mt-8 text-center px-4 max-w-sm mx-auto">
      <Quote size={20} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
      <AnimatePresence mode="wait">
        <motion.p
          key={quote}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5 }}
          className="text-sm italic text-gray-500 dark:text-gray-400 font-medium"
        >
          "{quote}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default MotivationalQuotes;
