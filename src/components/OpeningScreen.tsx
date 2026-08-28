import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { soundscapeEngine } from '../utils/audioEngine';

interface OpeningScreenProps {
  onEnter: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onEnter }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false);

  // Soft soundscape toggle
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = soundscapeEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleEnterClick = () => {
    if (isEntering) return;
    setIsEntering(true);
    // Smooth cinematic audio start on user gesture
    if (!soundscapeEngine.getIsMuted()) {
      soundscapeEngine.startAmbientSynth();
    }
    // Allow the gentle camera enter & depth dissolve animation to play out
    setTimeout(() => {
      onEnter();
    }, 950);
  };

  // Support Enter key for laptop/desktop accessibility
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
      id="cinematic-opening-screen"
      animate={
        isEntering
          ? {
              scale: 1.05,
              opacity: 0,
              filter: 'blur(12px)',
            }
          : {
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
            }
      }
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 text-center select-none overflow-hidden bg-[#030202]"
    >
      {/* 
        =======================================================================
        DARK CINEMATIC BACKGROUND: Almost black with subtle warm golden bokeh
        =======================================================================
      */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Warm/Golden Bokeh Photographic Underlay with Heavy Cinematic Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.24] contrast-[1.1] saturate-[1.2] scale-105"
          style={{
            backgroundImage: `url('https://i.ibb.co/21HwmBjM/Screenshot-2026-06-27-14-03-58-20-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg')`,
          }}
        />

        {/* Deep cinematic vignette & dark gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,4,5,0.45)_0%,rgba(3,2,2,0.92)_70%,rgba(2,1,2,0.99)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030202]/90 via-transparent to-[#030202]/95" />

        {/* Floating gentle golden particles */}
        <div className="absolute inset-0">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${(i * 19) % 100}vw`,
                y: `${(i * 23) % 100}vh`,
                opacity: 0.15,
                scale: 0.6,
              }}
              animate={{
                y: [`${(i * 23) % 100}vh`, `${((i * 23 + 40) % 100)}vh`],
                opacity: [0.15, 0.45, 0.15],
                scale: [0.6, 1.1, 0.6],
              }}
              transition={{
                duration: 9 + (i % 6) * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#e6d0a8]/40 blur-[1px]"
            />
          ))}
        </div>
      </div>

      {/* Floating Header: Discreet Branding & Sound Control */}
      <header className="relative z-20 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl flex items-center justify-between pt-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs">🧿</span>
          <span className="text-[10px] font-sans-clean font-light tracking-[0.35em] uppercase text-[#cfc2be]/80">
            For You
          </span>
        </motion.div>

        {/* Sound Toggle */}
        <motion.button
          id="opening-sound-toggle"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15 }}
          onClick={toggleSound}
          aria-label={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120f11]/70 hover:bg-[#1f181c]/80 backdrop-blur-md border border-[#382630]/60 text-[#f8c8d8] text-[10px] font-sans-clean tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-lg"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3 h-3 text-[#d9a5a0]" />
              <span className="text-[#a69299]">Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3 h-3 text-[#f8c8d8]" />
              <span>Sound On</span>
            </>
          )}
        </motion.button>
      </header>

      {/* 
        =======================================================================
        CENTER SECTION: Romantic Cinematic Greeting
        =======================================================================
      */}
      <main className="relative z-20 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl my-auto flex flex-col items-center justify-center space-y-8 py-6">
        {/* Tasteful Decorative Center Accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3 text-[#e6d0a8]"
        >
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#e6d0a8]/60" />
          <Sparkles className="w-3.5 h-3.5 text-[#e6d0a8]/90" />
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#e6d0a8]/60" />
        </motion.div>

        {/* Headings */}
        <div className="space-y-3.5">
          <motion.h1
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-luxury text-3xl sm:text-5xl text-[#faf4ec] font-normal tracking-[0.18em] leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] uppercase"
          >
            HAPPY BIRTHDAY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-luxury italic text-sm sm:text-base text-[#cfbebb] font-light tracking-wide max-w-xs mx-auto leading-relaxed"
          >
            Something made just for you.
          </motion.p>
        </div>

        {/* Subtle 🧿 Amulet Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.7, duration: 1.2 }}
          className="flex items-center gap-2 text-[#f8c8d8]/70 text-xs"
        >
          <span className="text-xs">🧿</span>
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans-clean font-light text-[#b39ea8]">
            A Private Memory Film
          </span>
          <span className="text-xs">🧿</span>
        </motion.div>

        {/* 
          =======================================================================
          ENTRANCE BUTTON: Mint Green, Heart-Inspired Shape, Subtle Ambient Glow
          =======================================================================
        */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative pt-3 flex items-center justify-center"
        >
          {/* Subtle Ambient Mint-Green Glow Halo */}
          <div className="absolute inset-0 rounded-full bg-[#a8e6cf]/[0.22] blur-xl scale-125 pointer-events-none transition-all duration-700 group-hover:bg-[#a8e6cf]/[0.35]" />

          {/* Heart-Embossed Elegant Rounded Pill Button */}
          <button
            id="opening-enter-button"
            onClick={handleEnterClick}
            className="group relative px-8 sm:px-10 py-3.5 rounded-full overflow-hidden text-sm font-light text-[#0b1e16] bg-gradient-to-r from-[#d8faed] via-[#b8eed9] to-[#9ee5cb] hover:from-[#e4fcf2] hover:to-[#b8eed9] transition-all duration-300 active:scale-95 shadow-[0_0_32px_rgba(168,230,207,0.45)] hover:shadow-[0_0_46px_rgba(168,230,207,0.7)] border border-[#effcf6]/80 flex items-center gap-3 cursor-pointer"
          >
            {/* Subtle inner glass highlight */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-80 pointer-events-none" />

            {/* Heart Icon integrated inside the mint green button */}
            <div className="relative z-10 w-6 h-6 rounded-full bg-[#0a1c14]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-3.5 h-3.5 text-[#0a1c14] fill-[#0a1c14]/20" />
            </div>

            <span className="relative z-10 font-sans-clean text-xs font-semibold tracking-[0.28em] uppercase text-[#0a1c14]">
              ENTER
            </span>
          </button>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full max-w-md pb-2 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="font-sans-clean text-[9.5px] tracking-[0.35em] uppercase text-[#8a7b82] font-light"
        >
          Special Edition • 🧿
        </motion.p>
      </footer>
    </motion.div>
  );
};
