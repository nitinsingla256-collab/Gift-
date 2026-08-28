import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { EXPERIENCE_CONFIG } from '../config/experienceConfig';

interface SpecialIntroProps {
  onComplete: () => void;
}

export const SpecialIntro: React.FC<SpecialIntroProps> = ({ onComplete }) => {
  useEffect(() => {
    // Cinematic hold before transitioning to the special experience view
    const timer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="max-w-[390px] w-full flex flex-col items-center justify-center space-y-6">
        {/* Soft Gold/Blush Light Burst */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.4, 0.2], scale: [0.8, 1.3, 1.1] }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          className="absolute w-64 h-64 rounded-full blur-[80px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,120,0.3) 0%, rgba(217,165,160,0.15) 50%, transparent 80%)',
          }}
        />

        {/* Small Elegant Label */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ delay: 0.6, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="font-serif-luxury text-2xl sm:text-3xl text-[#eae3d5] font-light tracking-wide leading-relaxed">
            {EXPERIENCE_CONFIG.specialIntro.label}
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 1.6, ease: 'easeInOut' }}
            className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#d4af78]/70 to-transparent mx-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};
