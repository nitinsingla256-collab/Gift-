import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Moon,
  Feather,
  BookOpen,
  Star,
  Flower2
} from 'lucide-react';
import { SHAYARIS, ShayariArtworkData } from '../data/shayariData';

interface CinematicShayariSequenceProps {
  onComplete: () => void;
}

export const CinematicShayariSequence: React.FC<CinematicShayariSequenceProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const currentShayari: ShayariArtworkData = SHAYARIS[currentIndex];

  // Auto-play timer (12 seconds per page gives ample time for slow, emotional reading)
  useEffect(() => {
    if (isPaused || isFinished) return;

    const timer = setTimeout(() => {
      if (currentIndex < SHAYARIS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
        setTimeout(onComplete, 2000);
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, isFinished, onComplete]);

  // Touch Swipe Handlers for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current !== null ? Math.abs(touchStartY.current - e.changedTouches[0].clientY) : 0;

    if (Math.abs(diffX) > 40 && diffY < 80) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleNext = () => {
    if (currentIndex < SHAYARIS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      setTimeout(onComplete, 1600);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleHeartClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'clientX' in e ? e.clientX : (e as React.TouchEvent).touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : (e as React.TouchEvent).touches[0].clientY;
    
    const newHeart = { id: Date.now() + Math.random(), x: clientX, y: clientY };
    setHearts((prev) => [...prev.slice(-6), newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);
  };

  // Compute adaptive font sizes based on line count so every poem fits gracefully
  const lineCount = currentShayari.lines.length;
  const poemFontSize =
    lineCount <= 4
      ? 'text-[20px] sm:text-[24px] md:text-[30px] lg:text-[34px]'
      : lineCount <= 6
      ? 'text-[17px] sm:text-[20px] md:text-[25px] lg:text-[28px]'
      : 'text-[15px] sm:text-[17px] md:text-[21px] lg:text-[23px]';

  const poemLineSpacing =
    lineCount <= 4
      ? 'space-y-3 sm:space-y-4 md:space-y-5'
      : lineCount <= 6
      ? 'space-y-2 sm:space-y-3 md:space-y-3.5'
      : 'space-y-1.5 sm:space-y-2 md:space-y-2.5';

  return (
    <div
      id="cinematic-shayari-folio"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative z-20 w-full min-h-[88vh] flex-1 flex flex-col justify-between items-center py-2 sm:py-3 my-auto select-none overflow-hidden"
    >
      {/* Background Ambience & Lighting Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] lg:w-[850px] h-[340px] sm:h-[600px] lg:h-[850px] rounded-full blur-[140px] transition-all duration-1000 opacity-20"
          style={{ backgroundColor: currentShayari.parchmentTone.glow }}
        />
        <div className="absolute bottom-10 right-10 w-[240px] sm:w-[450px] h-[240px] sm:h-[450px] rounded-full bg-[#f8c8d8]/[0.025] blur-[120px]" />
      </div>

      {/* Header: Minimal Luxury Indicator & Play/Pause */}
      <header className="relative z-30 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl flex items-center justify-between px-3 pt-1 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs">🧿</span>
          <span className="text-[10px] sm:text-xs font-sans-clean font-medium tracking-[0.3em] uppercase text-[#f8c8d8]">
            Poetry Folio
          </span>
          <span className="text-[9px] sm:text-[10px] font-sans-clean text-[#a6929b] tracking-widest pl-1">
            {currentShayari.numberFormatted}
          </span>
        </div>

        {/* Minimal Auto-Play Controls */}
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? 'Resume reading' : 'Pause reading'}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#120e10]/80 hover:bg-[#20151c] backdrop-blur-md border border-[#301c27] text-[#e8d5b5] text-[10px] font-sans-clean tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-[#f8c8d8]" />
              <span>Play</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-[#e8d5b5]" />
              <span>Pause</span>
            </>
          )}
        </button>
      </header>

      {/* 
        =======================================================================
        LARGE CINEMATIC CALLIGRAPHY MANUSCRIPT SCENE
        Occupies almost entire screen on mobile, and an expansive spread on laptop
        =======================================================================
      */}
      <main className="relative z-20 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex-1 flex flex-col justify-center items-center px-2 sm:px-4 my-auto">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentShayari.id}
              initial={{ opacity: 0, scale: 0.95, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[600px] flex flex-col justify-between items-center rounded-3xl p-5 sm:p-7 md:p-10 shadow-[0_24px_65px_rgba(0,0,0,0.95)] border border-[#2e1c26] backdrop-blur-xl overflow-hidden group bg-gradient-to-b ${currentShayari.parchmentTone.base}`}
              style={{
                boxShadow: `0 20px 60px -15px ${currentShayari.parchmentTone.glow}, 0 0 0 1px rgba(255,255,255,0.04) inset`,
              }}
            >
              {/* Gold Foil Double Inset Border */}
              <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-[#e8d5b5]/20 pointer-events-none" />
              <div className="absolute inset-4 sm:inset-5 rounded-xl border border-dashed border-[#f8c8d8]/15 pointer-events-none" />

              {/* Ornate Corner Flourishes */}
              <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-[#e8d5b5]/40 rounded-tl-md pointer-events-none" />
              <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-[#e8d5b5]/40 rounded-tr-md pointer-events-none" />
              <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#e8d5b5]/40 rounded-bl-md pointer-events-none" />
              <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#e8d5b5]/40 rounded-br-md pointer-events-none" />

              {/* Top Banner: Thematic Motif */}
              <div className="relative z-10 w-full flex items-center justify-between pb-3 sm:pb-4 border-b border-[#3d2432]/60">
                <div className="flex items-center gap-2 text-[#e8d5b5]/80">
                  {currentShayari.visualMotif === 'celestial_moon' && (
                    <>
                      <Moon className="w-4 h-4 text-[#e8d5b5]" />
                      <span className="text-[10px] sm:text-xs font-serif-luxury italic tracking-widest">
                        Silver Moon & Spell
                      </span>
                    </>
                  )}
                  {currentShayari.visualMotif === 'blush_florals' && (
                    <>
                      <Flower2 className="w-4 h-4 text-[#f8c8d8]" />
                      <span className="text-[10px] sm:text-xs font-serif-luxury italic tracking-widest">
                        Blush Petals & Light
                      </span>
                    </>
                  )}
                  {currentShayari.visualMotif === 'intertwined_destiny' && (
                    <>
                      <Feather className="w-4 h-4 text-[#e8c07d]" />
                      <span className="text-[10px] sm:text-xs font-serif-luxury italic tracking-widest">
                        Whispers of Destiny
                      </span>
                    </>
                  )}
                  {currentShayari.visualMotif === 'infinite_love' && (
                    <>
                      <Heart className="w-4 h-4 text-[#f8c8d8] fill-[#f8c8d8]/30" />
                      <span className="text-[10px] sm:text-xs font-serif-luxury italic tracking-widest">
                        Sanctuary of Love
                      </span>
                    </>
                  )}
                  {currentShayari.visualMotif === 'rose_and_book' && (
                    <>
                      <BookOpen className="w-4 h-4 text-[#e2a878]" />
                      <span className="text-[10px] sm:text-xs font-serif-luxury italic tracking-widest">
                        The Rose & The Book
                      </span>
                    </>
                  )}
                  {currentShayari.visualMotif === 'starlit_night' && (
                    <>
                      <Star className="w-4 h-4 text-[#d6e2f7] fill-[#d6e2f7]/30" />
                      <span className="text-[10px] sm:text-xs font-serif-luxury italic tracking-widest">
                        Starlit Constellations
                      </span>
                    </>
                  )}
                </div>

                {/* Page Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a0709]/80 border border-[#3a2230] text-[#f8c8d8] text-[9.5px] font-sans-clean font-medium tracking-widest uppercase">
                  <span>🧿</span>
                  <span>{currentShayari.numberFormatted}</span>
                </div>
              </div>

              {/* 
                ===============================================================
                CENTER: VERIFIED ACCURATE ROMANTIC CALLIGRAPHY VERSES
                ===============================================================
              */}
              <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center text-center py-4 sm:py-6 px-1 sm:px-4 my-auto space-y-3 sm:space-y-4">
                {/* Decorative Top Accent */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center justify-center gap-3 text-[#e8d5b5]"
                >
                  <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#e8d5b5]/60" />
                  <Sparkles className="w-3.5 h-3.5 text-[#e8d5b5]" />
                  <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#e8d5b5]/60" />
                </motion.div>

                {/* Exact Verified Hinglish Poem Lines with Luxurious Calligraphy Typography */}
                <div className={`w-full max-w-xl mx-auto ${poemLineSpacing}`}>
                  {currentShayari.lines.map((line, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.7,
                        delay: 0.1 + idx * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`font-serif-luxury ${poemFontSize} text-[#faf4ec] font-normal leading-[1.55] sm:leading-[1.65] tracking-[0.02em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] italic`}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {/* Decorative Center Flourish */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex items-center justify-center gap-2 pt-1 text-[#f8c8d8]/80 text-xs"
                >
                  <span className="w-4 h-[1px] bg-[#f8c8d8]/40" />
                  <span className="text-xs">🧿</span>
                  <span className="w-4 h-[1px] bg-[#f8c8d8]/40" />
                </motion.div>
              </div>

              {/* Bottom Footer: Subtitle & Love Reaction Button */}
              <div className="relative z-10 w-full flex items-center justify-between pt-3 sm:pt-4 border-t border-[#3d2432]/60">
                <span className="text-[10px] sm:text-xs font-sans-clean font-light tracking-[0.25em] text-[#9c8992] uppercase">
                  {currentShayari.theme}
                </span>

                {/* Interactive Heart Button */}
                <button
                  onClick={handleHeartClick}
                  aria-label="Send Love"
                  className="p-2 -mr-1 rounded-full hover:bg-[#20151c] active:scale-90 transition-all duration-300 text-[#f8c8d8] flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-[#f8c8d8] fill-[#f8c8d8]/40 hover:fill-[#f8c8d8] transition-all" />
                  <span className="text-[10px] font-sans-clean tracking-wider uppercase text-[#f8c8d8]">
                    Love
                  </span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="transitioning-to-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="w-full flex flex-col items-center justify-center text-center space-y-4 py-20"
            >
              <div className="w-8 h-8 rounded-full bg-[#181015] border border-[#3a202e] flex items-center justify-center text-[#f8c8d8]">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <p className="font-serif-luxury italic text-sm text-[#baa6af] tracking-wide">
                Turning the page to the Special Note...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Footer & Page Indicators */}
      <footer className="relative z-30 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl flex flex-col items-center gap-2 pt-2 px-3 pb-1">
        {/* Dot Indicators for all 6 pages */}
        <div className="flex items-center gap-2 py-1">
          {SHAYARIS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to Shayari ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#f8c8d8] shadow-[0_0_8px_rgba(248,200,216,0.7)]'
                  : 'w-1.5 bg-[#38212e] hover:bg-[#573347]'
              }`}
            />
          ))}
        </div>

        {/* Prev & Next Controls */}
        <div className="w-full flex items-center justify-between pt-1">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous poetry page"
            className="px-4 py-1.5 rounded-full bg-[#120e10] border border-[#2b1823] text-xs text-[#baa6af] hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer min-h-[36px] flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-[10px] font-sans-clean font-light tracking-[0.25em] text-[#786770] uppercase">
            Swipe or use arrows
          </span>

          <button
            onClick={handleNext}
            aria-label="Next poetry page"
            className="px-4 py-1.5 rounded-full bg-[#181016] border border-[#3d2232] text-xs text-[#f8c8d8] hover:text-white transition-all active:scale-95 cursor-pointer font-medium min-h-[36px] flex items-center gap-1"
          >
            <span>{currentIndex === SHAYARIS.length - 1 ? 'Special Note →' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* Floating Animated Reaction Hearts */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0.9, y: h.y, x: h.x, scale: 0.5 }}
            animate={{ opacity: 0, y: h.y - 120, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="fixed z-[300] pointer-events-none text-[#f8c8d8]"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            <Heart className="w-8 h-8 fill-[#f8c8d8] drop-shadow-[0_0_12px_rgba(248,200,216,0.6)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
