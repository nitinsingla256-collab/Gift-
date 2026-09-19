import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface SpecialIntroProps {
  onComplete: () => void;
}

export const SpecialIntro: React.FC<SpecialIntroProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 text-center select-none bg-[#fdfbf6] text-[#222222] font-poppins overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="max-w-[420px] w-full flex flex-col items-center justify-center space-y-6 z-20">
        {/* Soft Pink/Blush Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.6, 0.3], scale: [0.8, 1.3, 1.1] }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          className="absolute w-72 h-72 rounded-full blur-[70px] pointer-events-none bg-pink-300/40"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center shadow-lg text-pink-500"
        >
          <Sparkles size={28} className="animate-pulse" />
        </motion.div>

        {/* Romantic Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="space-y-4"
        >
          <p className="font-romantic text-3xl sm:text-4xl text-red-900 leading-relaxed">
            A little memory, made with care. 🧿
          </p>
          <p className="font-handwritten text-xl sm:text-2xl text-gray-700">
            "Your smile is my favorite chapter."
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 1.2, ease: 'easeInOut' }}
            className="w-16 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mt-4"
          />
        </motion.div>
      </div>
    </div>
  );
};
