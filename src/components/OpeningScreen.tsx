import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Gift } from 'lucide-react';
import { soundscapeEngine } from '../utils/audioEngine';

interface OpeningScreenProps {
  onEnter: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onEnter }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => soundscapeEngine.getIsPlaying());
  const [isEntering, setIsEntering] = useState<boolean>(false);

  // Sync with audio engine state
  useEffect(() => {
    const unsubscribe = soundscapeEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  // Audio toggle directly triggered on user click
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundscapeEngine.toggle();
  };

  const handleEnterClick = () => {
    if (isEntering) return;
    setIsEntering(true);
    // Explicitly start audio inside this direct user gesture
    soundscapeEngine.play().catch(() => {});
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  // Support Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEnterClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEntering]);

  return (
    <motion.div
      id="dreamy-opening-screen"
      animate={
        isEntering
          ? {
              scale: 1.05,
              opacity: 0,
              filter: 'blur(8px)',
            }
          : {
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
            }
      }
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center px-4 sm:px-6 py-8 text-center select-none overflow-hidden bg-[#fdfbf6] text-[#222222] font-poppins"
      style={{
        backgroundImage: 'linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      {/* Corner Scrapbook Embellishments */}
      <motion.img
        src="/scrapbook/decoration.webp"
        alt="Decoration"
        className="absolute top-0 left-0 w-44 sm:w-64 md:w-96 pointer-events-none drop-shadow-sm opacity-90"
        initial={{ opacity: 0, x: -40, y: -40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1 }}
      />
      <motion.img
        src="/scrapbook/flower1.webp"
        alt="Flower"
        className="absolute bottom-0 left-0 w-36 sm:w-52 pointer-events-none drop-shadow-sm opacity-90"
        initial={{ opacity: 0, x: -30, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2 }}
      />
      <motion.img
        src="/scrapbook/tulip.webp"
        alt="Tulip"
        className="absolute bottom-0 right-0 w-36 sm:w-52 pointer-events-none drop-shadow-sm opacity-90"
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2 }}
      />
      <motion.img
        src="/scrapbook/cherry.webp"
        alt="Cherry"
        className="absolute top-4 right-4 w-20 sm:w-28 pointer-events-none drop-shadow-sm"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Top Header with Music Controller */}
      <header className="relative z-20 w-full max-w-4xl flex items-center justify-end">
        {/* Music Player Button (Preet Re) */}
        <button
          id="opening-music-toggle"
          onClick={toggleSound}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-cute transition-all shadow-md active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 text-white border-rose-400 shadow-rose-200 animate-none'
              : 'bg-white/90 text-rose-600 border-rose-200 hover:bg-rose-50 animate-pulse'
          }`}
        >
          {isPlaying ? (
            <Volume2 size={16} className="animate-bounce" />
          ) : (
            <VolumeX size={16} />
          )}
          <span>{isPlaying ? 'Preet Re 🎵' : 'Play Music 🎵'}</span>
        </button>
      </header>

      {/* Main Center Invitation Card */}
      <div className="relative z-20 flex flex-col items-center max-w-lg px-4 my-auto py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-100/90 border-4 border-white shadow-xl flex items-center justify-center mb-6 text-pink-500"
        >
          <motion.img
            src="/scrapbook/bow.webp"
            alt="Bow"
            className="w-14 sm:w-16 h-auto drop-shadow-sm"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Happy Birthday 🧿 title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-romantic text-red-900 leading-tight mb-4 drop-shadow-sm"
        >
          Happy Birthday 🧿
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-handwritten text-2xl sm:text-3xl text-gray-700 mb-8 max-w-md"
        >
          "Something made with pure love and care, just for you."
        </motion.p>

        {/* Surprise Button */}
        <motion.button
          id="opening-enter-button"
          onClick={handleEnterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary text-2xl sm:text-3xl px-12 sm:px-16 py-4 sm:py-5 shadow-2xl flex items-center gap-3 cursor-pointer"
        >
          <span>Surprise</span>
          <Gift size={24} className="text-pink-100 animate-bounce" />
        </motion.button>
      </div>

      {/* Footer info */}
      <footer className="relative z-20 text-center">
        <p className="text-xs font-cute text-gray-400 tracking-wider flex items-center justify-center gap-1.5">
          <span>Tap to unlock your birthday surprise</span>
          <span>♡</span>
          <span>🧿</span>
        </p>
      </footer>
    </motion.div>
  );
};
