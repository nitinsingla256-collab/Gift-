import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SHAYARIS } from '../data/shayariData';
import { Sparkles, Heart } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const CinematicShayariSequence: React.FC<Props> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hearts, setHearts] = useState<{ id: number, x: number, y: number }[]>([]);

  const handleLike = (e: React.PointerEvent) => {
    e.stopPropagation();
    const newHeart = { id: Date.now(), x: e.clientX, y: e.clientY };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  // Auto-progress
  useEffect(() => {
    if (isPaused || isFinished) return;

    const currentLines = SHAYARIS[currentIndex].lines;
    const wordCount = currentLines.join(' ').split(' ').length;
    const duration = Math.max(9000, wordCount * 600); // Gentle pacing

    const timer = setTimeout(() => {
      if (currentIndex < SHAYARIS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
        setTimeout(onComplete, 3500); // cinematic pause before special note
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, isFinished, onComplete]);

  // Pointer & Swipe handling
  const pointerStartRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartRef.current === null) return;
    const diff = pointerStartRef.current - e.clientX;
    
    if (diff > 50) {
      // swipe left (next)
      if (currentIndex < SHAYARIS.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsPaused(false);
      } else if (currentIndex === SHAYARIS.length - 1 && !isFinished) {
        setIsFinished(true);
        setTimeout(onComplete, 3500);
      }
    } else if (diff < -50) {
      // swipe right (prev)
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setIsPaused(false);
      }
    } else {
      // just a tap, toggle pause
      setIsPaused(prev => !prev);
    }
    pointerStartRef.current = null;
  };

  const currentShayari = SHAYARIS[currentIndex];

  return (
    <div 
      className="absolute inset-0 z-[100] flex items-center justify-center bg-[#020202] overflow-hidden cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStartRef.current = null; }}
    >
      {/* Cinematic Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020202_90%)] z-10 opacity-90" />
        {/* Warm Champagne/Golden Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#e3d1a8] opacity-[0.025] blur-[100px] rounded-full" />
        {/* Baby Pink subtle accent */}
        <div className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-[#f8c8d8] opacity-[0.015] blur-[120px] rounded-full" />
        
        {/* Film grain noise overlay (light) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
      </div>

      {/* Play/Pause Indicator */}
      <AnimatePresence>
        {isPaused && !isFinished && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-[#e3d1a8]/50 tracking-[0.3em] text-[10px] sm:text-xs font-sans-clean uppercase flex items-center gap-2"
          >
            <span className="w-1 h-1 rounded-full bg-[#e3d1a8]/50 animate-pulse" />
            Paused
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isFinished ? (
          <motion.div
            key={currentShayari.id}
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.02 }}
            transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 md:p-12 z-20"
          >
            {/* The Shayari Artwork/Card */}
            <div className="relative w-full max-w-[340px] sm:max-w-md md:max-w-2xl aspect-[3/4] md:aspect-[16/10] flex flex-col items-center justify-center border border-[#e3d1a8]/10 bg-gradient-to-b from-[#0f0a07]/60 to-[#050302]/90 rounded-2xl shadow-[0_0_40px_rgba(227,209,168,0.03)] backdrop-blur-md px-6 py-12 md:px-16 overflow-hidden group">
              
              {/* Animated subtle light sweep inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Corner Ornaments */}
              <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#e3d1a8]/30 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#e3d1a8]/30 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#e3d1a8]/30 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#e3d1a8]/30 rounded-br-lg" />
              
              {/* Top Decor */}
              <div className="absolute top-10 flex items-center justify-center gap-4 opacity-50">
                <div className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#e3d1a8]" />
                <Sparkles className="w-3 h-3 text-[#e3d1a8]" />
                <div className="w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#e3d1a8]" />
              </div>

              {/* Calligraphy Typography */}
              <div className="flex flex-col items-center justify-center text-center space-y-5 md:space-y-6 z-10 w-full mt-2">
                {currentShayari.lines.map((line, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 0.8 + (idx * 0.5), ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-serif-luxury text-[20px] sm:text-[24px] md:text-[34px] lg:text-[40px] text-[#f4ecd8] drop-shadow-[0_0_15px_rgba(227,209,168,0.2)]"
                    style={{
                      fontStyle: 'italic',
                      fontWeight: 300,
                      lineHeight: 1.6,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Bottom Decor */}
              <div className="absolute bottom-8 md:bottom-10 flex items-center justify-center gap-4 z-30">
                <span className="text-[12px] text-[#e3d1a8] opacity-60">🧿</span>
                <div className="w-[1px] h-4 bg-[#e3d1a8]/20" />
                <button 
                  onPointerDown={(e) => e.stopPropagation()} 
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    handleLike(e);
                  }}
                  className="p-2 -m-2 touch-manipulation group transition-all"
                >
                  <Heart className="w-4 h-4 text-[#f8c8d8] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ending-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 bg-[#020202] z-50 flex items-center justify-center"
          />
        )}
      </AnimatePresence>

      {/* Floating Hearts Reaction */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: heart.y, x: heart.x, scale: 0.5 }}
            animate={{ opacity: 0.8, y: heart.y - 150, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed z-[200] pointer-events-none text-[#f8c8d8]"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            <Heart className="w-12 h-12 fill-[#f8c8d8] drop-shadow-[0_0_10px_rgba(248,200,216,0.5)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
