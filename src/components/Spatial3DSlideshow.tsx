import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  ZoomOut,
  Play,
  Pause,
  Feather
} from 'lucide-react';
import { 
  normalSpatialMemories, 
  specialSpatialMemories, 
  specialRomanticNote,
  SpatialMemoryItem 
} from '../data/memoryGalleryData';
import { soundscapeEngine } from '../utils/audioEngine';

// Slide types for the unified cinematic timeline
export type TimelineSlide = 
  | { type: 'memory'; item: SpatialMemoryItem; totalIndex: number }
  | { type: 'shairi'; shairiNumber: number; title: string }
  | { type: 'special_intro' }
  | { type: 'special_memory'; item: SpatialMemoryItem; totalIndex: number }
  | { type: 'note' }
  | { type: 'finale' };

/**
 * Built-in unified cinematic sequence (10 photos total, Shairi placeholders, Special One wall, Note, Finale)
 */
const TIMELINE_SLIDES: TimelineSlide[] = [
  // 1. Normal Memory 1
  { type: 'memory', item: normalSpatialMemories[0], totalIndex: 1 },
  // 2. Normal Memory 2
  { type: 'memory', item: normalSpatialMemories[1], totalIndex: 2 },
  // 3. Shairi 1 Placeholder
  { type: 'shairi', shairiNumber: 1, title: 'Shairi 1' },
  // 4. Normal Memory 3
  { type: 'memory', item: normalSpatialMemories[2], totalIndex: 3 },
  // 5. Normal Memory 4
  { type: 'memory', item: normalSpatialMemories[3], totalIndex: 4 },
  // 6. Normal Memory 5
  { type: 'memory', item: normalSpatialMemories[4], totalIndex: 5 },
  // 7. Shairi 2 Placeholder
  { type: 'shairi', shairiNumber: 2, title: 'Shairi 2' },
  // 8. Special One Intro Reveal
  { type: 'special_intro' },
  // 9. Special Memory 1
  { type: 'special_memory', item: specialSpatialMemories[0], totalIndex: 6 },
  // 10. Special Memory 2
  { type: 'special_memory', item: specialSpatialMemories[1], totalIndex: 7 },
  // 11. Shairi 3 Placeholder
  { type: 'shairi', shairiNumber: 3, title: 'Shairi 3' },
  // 12. Special Memory 3
  { type: 'special_memory', item: specialSpatialMemories[2], totalIndex: 8 },
  // 13. Special Memory 4
  { type: 'special_memory', item: specialSpatialMemories[3], totalIndex: 9 },
  // 14. Special Memory 5
  { type: 'special_memory', item: specialSpatialMemories[4], totalIndex: 10 },
  // 15. Shairi 4 Placeholder
  { type: 'shairi', shairiNumber: 4, title: 'Shairi 4' },
  // 16. Romantic Handwritten Note
  { type: 'note' },
  // 17. Finale Screen
  { type: 'finale' },
];

interface Spatial3DSlideshowProps {
  onLock: () => void;
}

export const Spatial3DSlideshow: React.FC<Spatial3DSlideshowProps> = ({ onLock }) => {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isMagnified, setIsMagnified] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [progressKey, setProgressKey] = useState<number>(0);

  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Swipe gesture tracking with 3D tilt
  const dragX = useMotionValue(0);
  const dragRotateY = useTransform(dragX, [-200, 0, 200], [14, 0, -14]);
  const dragScale = useTransform(dragX, [-200, 0, 200], [0.93, 1, 0.93]);

  const currentSlide = TIMELINE_SLIDES[slideIndex];

  // Try landscape on mobile if supported
  useEffect(() => {
    try {
      const orientation = (screen as unknown as { orientation?: { lock?: (type: string) => Promise<void> } }).orientation;
      if (orientation?.lock) {
        orientation.lock('landscape').catch(() => {
          // Handled silently if not permitted in iframe/browser
        });
      }
    } catch {
      // Ignored
    }
  }, []);

  // Auto-hide controls
  const triggerControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

  useEffect(() => {
    triggerControls();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [slideIndex, isPlaying, triggerControls]);

  // Audio start and dynamic volume adjustment
  useEffect(() => {
    if (!soundscapeEngine.isAudioActive()) {
      soundscapeEngine.startAmbientSynth();
    }
  }, []);

  useEffect(() => {
    if (!currentSlide) return;
    if (currentSlide.type === 'special_intro' || currentSlide.type === 'special_memory' || currentSlide.type === 'note') {
      soundscapeEngine.setVolume(0.24); // Softer intimate volume
    } else {
      soundscapeEngine.setVolume(0.36);
    }
  }, [currentSlide]);

  // Slideshow Navigation
  const handleNext = useCallback(() => {
    if (isFocusMode) return;
    setDirection(1);
    triggerControls();
    setSlideIndex((prev) => {
      if (prev >= TIMELINE_SLIDES.length - 1) return prev;
      return prev + 1;
    });
    setProgressKey((k) => k + 1);
  }, [isFocusMode, triggerControls]);

  const handlePrev = useCallback(() => {
    if (isFocusMode) return;
    setDirection(-1);
    triggerControls();
    setSlideIndex((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
    setProgressKey((k) => k + 1);
  }, [isFocusMode, triggerControls]);

  const handleReplay = useCallback(() => {
    setSlideIndex(0);
    setDirection(1);
    setIsPlaying(true);
    setProgressKey((k) => k + 1);
  }, []);

  // Automatic progression logic (Romantic Film Flow)
  useEffect(() => {
    if (!isPlaying || isFocusMode || currentSlide.type === 'finale') {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    // Determine slide duration (photos ~ 7s, shairi pause ~ 4.5s, special intro ~ 3.8s, note ~ 12s)
    let duration = 7000;
    if (currentSlide.type === 'shairi') duration = 4800;
    else if (currentSlide.type === 'special_intro') duration = 3800;
    else if (currentSlide.type === 'special_memory') duration = 7800;
    else if (currentSlide.type === 'note') duration = 14000;

    autoPlayTimerRef.current = setTimeout(() => {
      handleNext();
    }, duration);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [slideIndex, isPlaying, isFocusMode, currentSlide, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFocusMode) {
        if (e.key === 'Escape') {
          setIsFocusMode(false);
          setIsMagnified(false);
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPlaying((p) => !p);
      } else if (e.key === 'm' || e.key === 'M') {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        soundscapeEngine.setMuted(nextMuted);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFocusMode, isMuted]);

  // Sound toggle
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundscapeEngine.setMuted(nextMuted);
  };

  // 3D Motion variants with cinematic depth
  const spatial3DVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 0.86,
      z: -200,
      rotateY: dir > 0 ? 18 : -18,
      rotateX: -3,
      y: 12,
      filter: 'blur(10px)',
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    center: {
      opacity: 1,
      scale: 1,
      z: 0,
      rotateY: 0,
      rotateX: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 1.14,
      z: 180,
      rotateY: dir > 0 ? -22 : 22,
      rotateX: 4,
      y: -12,
      filter: 'blur(12px)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Get active photo index (1 - 10)
  const currentPhotoNumber = 
    currentSlide.type === 'memory' 
      ? currentSlide.totalIndex 
      : currentSlide.type === 'special_memory' 
      ? currentSlide.totalIndex 
      : null;

  return (
    <div
      id="spatial-3d-experience"
      onClick={triggerControls}
      onMouseMove={triggerControls}
      className="relative w-full h-[100dvh] bg-[#020202] text-[#f7f2ea] overflow-hidden flex flex-col justify-between items-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Deep Black Cinematic Background with Soft Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,2,2,0.94)_100%)]" />

      {/* Floating subtle Baby Pink & Champagne Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1.05],
          opacity: currentSlide.type === 'special_memory' || currentSlide.type === 'special_intro' ? [0.2, 0.38, 0.22] : [0.08, 0.16, 0.1],
          x: [-15, 20, -10],
          y: [-10, 15, -5],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-[#f8c8d8]/[0.06] blur-[110px] pointer-events-none z-0"
      />

      {/* ======================================================================= */}
      {/* MINIMAL TOP HUD: Counter, Auto-progress line, Baby Pink sound/play controls */}
      {/* ======================================================================= */}
      <header
        className={`relative w-full max-w-lg z-30 flex items-center justify-between px-5 pt-5 sm:pt-6 transition-opacity duration-500 ${
          showControls && !isFocusMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Memory Counter & Chapter Badge with Baby Pink Accents */}
        <div className="flex items-center gap-2">
          {currentPhotoNumber !== null ? (
            <div className="flex items-center gap-1.5 bg-[#120f11]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#302028] shadow-md">
              <span className="text-[11px] font-sans-clean font-medium tracking-[0.2em] text-[#f8c8d8]">
                {String(currentPhotoNumber).padStart(2, '0')} / 10
              </span>
              <span className="text-[10px] opacity-90" title="Protection">🧿</span>
            </div>
          ) : currentSlide.type === 'shairi' ? (
            <span className="text-[10px] font-sans-clean font-light tracking-[0.25em] uppercase text-[#f8c8d8] bg-[#140f12]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#332029]">
              {currentSlide.title}
            </span>
          ) : currentSlide.type === 'note' ? (
            <span className="text-[10px] font-sans-clean font-light tracking-[0.25em] uppercase text-[#f8c8d8] bg-[#140f12]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#332029]">
              Private Letter
            </span>
          ) : (
            <span className="text-[10px] font-sans-clean font-light tracking-[0.25em] uppercase text-[#a39486] bg-[#120f10]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#2b2024]">
              Memory Film
            </span>
          )}
        </div>

        {/* Right Controls: Play/Pause, Baby Pink Sound Toggle, Discreet Lock */}
        <div className="flex items-center gap-2">
          {/* Play / Pause Toggle */}
          {currentSlide.type !== 'finale' && (
            <button
              id="slideshow-play-pause-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="w-7 h-7 rounded-full bg-[#140f12]/85 backdrop-blur-md border border-[#2d1e26] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#f8c8d8] hover:text-white transition-all active:scale-95 shadow-md"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>
          )}

          {/* Sound On / Off Toggle (Baby Pink Accent) */}
          <button
            id="slideshow-sound-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSound();
            }}
            aria-label={isMuted ? 'Sound Off' : 'Sound On'}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#140f12]/85 backdrop-blur-md border border-[#2d1e26] hover:border-[#f8c8d8]/50 text-[10px] font-sans-clean tracking-wider uppercase text-[#f8c8d8] hover:text-white transition-all active:scale-95 shadow-md"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3 h-3 text-[#d9a5a0]" />
                <span className="opacity-70">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-[#f8c8d8]" />
                <span>Sound</span>
              </>
            )}
          </button>

          {/* Discreet Lock Screen */}
          <button
            id="slideshow-lock-btn"
            onClick={(e) => {
              e.stopPropagation();
              onLock();
            }}
            aria-label="Lock screen"
            className="w-7 h-7 rounded-full bg-[#140f12]/85 backdrop-blur-md border border-[#2d1e26] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#998b8f] hover:text-white transition-all active:scale-95 shadow-md"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* 3D SPATIAL MAIN STAGE (Automatic progression, subtle continuous motion) */}
      {/* ======================================================================= */}
      <main className="relative w-full max-w-lg flex-1 flex flex-col justify-center items-center px-4 my-auto overflow-hidden z-20">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ------------------------------------------------------------------- */}
          {/* 1. NORMAL 3D PHOTOGRAPHS (01 - 05) */}
          {/* ------------------------------------------------------------------- */}
          {currentSlide.type === 'memory' && (
            <motion.div
              key={`normal-${currentSlide.item.id}`}
              custom={direction}
              variants={spatial3DVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full h-full flex flex-col justify-center items-center space-y-4"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Floating 3D Physical Photo Mount */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                style={{ x: dragX, rotateY: dragRotateY, scale: dragScale }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -45 || info.velocity.x < -300) {
                    handleNext();
                  } else if (info.offset.x > 45 || info.velocity.x > 300) {
                    handlePrev();
                  }
                }}
                onClick={() => setIsFocusMode(true)}
                className="group cursor-pointer relative max-h-[63vh] w-full flex items-center justify-center rounded-2xl p-2.5 bg-[#120f11] border border-[#2d1e26] hover:border-[#f8c8d8]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.96)] transition-all duration-500"
              >
                {/* 🧿 Protection Detail Badge (Consistently placed on top corner) */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1 bg-[#0a0709]/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#2b1b23] text-xs">
                  <span className="text-[11px]">🧿</span>
                  <span className="text-[9px] font-sans-clean tracking-widest text-[#f8c8d8] font-light">
                    {currentSlide.item.indexNumber}
                  </span>
                </div>

                {/* Display Window with Continuous Subtle Ken Burns Float */}
                <div className="relative w-full h-full max-h-[60vh] overflow-hidden rounded-xl bg-[#080607] flex items-center justify-center">
                  <motion.img
                    src={currentSlide.item.image.src}
                    alt={currentSlide.item.tag}
                    initial={{ scale: 1, x: -6, y: 4 }}
                    animate={{ 
                      scale: [1, 1.05, 1.02],
                      x: [-6, 6, 0],
                      y: [4, -4, 0]
                    }}
                    transition={{
                      duration: 9,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'mirror'
                    }}
                    className="w-full max-h-[60vh] object-contain select-none pointer-events-none"
                    loading="eager"
                  />

                  {/* Tap to zoom indicator */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#0a0709]/80 backdrop-blur-md border border-[#2b1b23] flex items-center justify-center text-[#f8c8d8] opacity-70 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>

              {/* Romantic Hinglish Description + 🧿 Protection line */}
              <div className="w-full max-w-sm text-center pt-1 px-3 space-y-1.5">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="font-serif-luxury text-base sm:text-lg text-[#f7efe5] font-normal tracking-wide leading-relaxed italic"
                >
                  "{currentSlide.item.cinematicLine}"
                </motion.p>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#918187] font-light tracking-[0.25em] uppercase">
                  <span>{currentSlide.item.tag}</span>
                  <span>•</span>
                  <span className="text-[#f8c8d8]">🧿</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 2. SHAIRI PLACEHOLDERS (Breathing pauses styled beautifully) */}
          {/* ------------------------------------------------------------------- */}
          {currentSlide.type === 'shairi' && (
            <motion.div
              key={`shairi-slide-${currentSlide.shairiNumber}`}
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-6 px-8 max-w-sm"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center justify-center gap-2 text-[#f8c8d8]/70">
                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#f8c8d8]/40" />
                <Sparkles className="w-3.5 h-3.5 text-[#f8c8d8]" />
                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#f8c8d8]/40" />
              </div>

              {/* Shairi Label (Clean, spacious placeholder ready for future verse) */}
              <div className="py-4 space-y-3">
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#fbf6ef] font-normal tracking-widest">
                  {currentSlide.title}
                </h3>
                <p className="font-sans-clean text-xs text-[#8c7a84] font-light tracking-[0.3em] uppercase">
                  A pause between memories
                </p>
              </div>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#f8c8d8]/60 to-transparent mx-auto" />
            </motion.div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 3. SPECIAL ONE INTRO REVEAL */}
          {/* ------------------------------------------------------------------- */}
          {currentSlide.type === 'special_intro' && (
            <motion.div
              key="special-intro-phase"
              initial={{ opacity: 0, scale: 0.9, z: -160 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              exit={{ opacity: 0, scale: 1.1, z: 160 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-4 px-6 max-w-sm"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1c1218] border border-[#3d2232] text-[10px] uppercase tracking-[0.3em] text-[#f8c8d8]">
                <Heart className="w-3 h-3 text-[#f8c8d8] fill-[#f8c8d8]/30" />
                <span>Special One</span>
                <span>🧿</span>
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#faf3ea] font-normal tracking-wider">
                SPECIAL ONE
              </h2>
              <p className="font-serif-luxury italic text-xs sm:text-sm text-[#b8a4ae] font-light leading-relaxed max-w-xs mx-auto">
                For the moments, the smiles, and the person who means a little more.
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1.2 }}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#f8c8d8]/70 to-transparent mx-auto pt-2"
              />
            </motion.div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 4. SPECIAL MEMORY 3D PHOTO WALL (Layered depth, baby pink accents) */}
          {/* ------------------------------------------------------------------- */}
          {currentSlide.type === 'special_memory' && (
            <motion.div
              key={`special-wall-${currentSlide.item.id}`}
              custom={direction}
              variants={spatial3DVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full h-full flex flex-col justify-center items-center space-y-4"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Layered 3D Depth Wall Composition */}
              <div className="relative w-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {/* Secondary Background Left Photo (Offset in depth) */}
                <motion.div
                  initial={{ opacity: 0, x: -60, z: -160, rotateY: 26 }}
                  animate={{ opacity: 0.25, x: -75, z: -130, rotateY: 20 }}
                  className="absolute left-0 max-h-[46vh] w-3/4 pointer-events-none rounded-2xl p-2 bg-[#0c080a] border border-[#21141b] shadow-2xl hidden sm:flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={specialSpatialMemories[(currentSlide.totalIndex - 6 + 4) % 5].image.src}
                    alt="Background memory"
                    className="w-full h-full object-contain filter grayscale-[50%]"
                  />
                </motion.div>

                {/* Secondary Background Right Photo (Offset in depth) */}
                <motion.div
                  initial={{ opacity: 0, x: 60, z: -160, rotateY: -26 }}
                  animate={{ opacity: 0.25, x: 75, z: -130, rotateY: -20 }}
                  className="absolute right-0 max-h-[46vh] w-3/4 pointer-events-none rounded-2xl p-2 bg-[#0c080a] border border-[#21141b] shadow-2xl hidden sm:flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={specialSpatialMemories[(currentSlide.totalIndex - 6 + 1) % 5].image.src}
                    alt="Background memory"
                    className="w-full h-full object-contain filter grayscale-[50%]"
                  />
                </motion.div>

                {/* MAIN FOREGROUND 3D PHOTOGRAPH */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  style={{ x: dragX, rotateY: dragRotateY, scale: dragScale }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -45 || info.velocity.x < -300) {
                      handleNext();
                    } else if (info.offset.x > 45 || info.velocity.x > 300) {
                      handlePrev();
                    }
                  }}
                  onClick={() => setIsFocusMode(true)}
                  className="group cursor-pointer relative z-20 max-h-[63vh] w-full flex items-center justify-center rounded-2xl p-2.5 bg-gradient-to-b from-[#181115] via-[#120d10] to-[#0a0708] border border-[#3b202d] hover:border-[#f8c8d8]/50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.98)] transition-all duration-500"
                >
                  {/* Subtle Baby Pink Corner Glow */}
                  <div className="absolute -top-4 -right-4 w-28 h-28 bg-[#f8c8d8]/[0.08] rounded-full blur-xl pointer-events-none" />

                  {/* 🧿 Protection Detail Badge */}
                  <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-[#0a0709]/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#301b25] text-xs">
                    <span className="text-[12px]">🧿</span>
                    <span className="text-[9.5px] font-sans-clean tracking-widest text-[#f8c8d8] font-medium">
                      Special • {currentSlide.item.indexNumber}
                    </span>
                  </div>

                  {/* Photo Display Window with Continuous Floating Motion */}
                  <div className="relative w-full h-full max-h-[60vh] overflow-hidden rounded-xl bg-[#080607] flex items-center justify-center">
                    <motion.img
                      src={currentSlide.item.image.src}
                      alt={currentSlide.item.tag}
                      initial={{ scale: 1, y: 6 }}
                      animate={{ 
                        scale: [1, 1.06, 1.03],
                        y: [6, -6, 2],
                        x: [-4, 4, -2]
                      }}
                      transition={{
                        duration: 10,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'mirror'
                      }}
                      className="w-full max-h-[60vh] object-contain select-none pointer-events-none"
                      loading="eager"
                    />

                    {/* Zoom indicator */}
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#0a0709]/85 backdrop-blur-md border border-[#301b25] flex items-center justify-center text-[#f8c8d8]">
                      <ZoomIn className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Romantic Hinglish Line */}
              <div className="w-full max-w-sm text-center pt-1 px-3 space-y-1.5 z-20">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="font-serif-luxury text-base sm:text-lg text-[#fbf5ee] font-normal tracking-wide leading-relaxed italic"
                >
                  "{currentSlide.item.cinematicLine}"
                </motion.p>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#99868e] font-light tracking-[0.25em] uppercase">
                  <span>{currentSlide.item.tag}</span>
                  <span>•</span>
                  <span className="text-[#f8c8d8]">🧿</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 5. SPECIAL ROMANTIC NOTE (Private Handwritten Letter) */}
          {/* ------------------------------------------------------------------- */}
          {currentSlide.type === 'note' && (
            <motion.article
              key="special-note-slide"
              initial={{ opacity: 0, scale: 0.92, z: -100, y: 20 }}
              animate={{ opacity: 1, scale: 1, z: 0, y: 0 }}
              exit={{ opacity: 0, scale: 1.06, z: 100, y: -20 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#160f13] via-[#100b0e] to-[#0a0708] border border-[#331d28] p-6 sm:p-8 space-y-5 shadow-2xl shadow-black overflow-hidden select-text"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Soft Baby Pink Ambient Glow */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#f8c8d8]/[0.05] rounded-full blur-3xl pointer-events-none" />

              {/* Seal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#26161f]">
                <div className="flex items-center gap-1.5 text-[#f8c8d8]">
                  <Feather className="w-3.5 h-3.5" />
                  <span className="text-[9.5px] font-sans-clean tracking-[0.28em] uppercase text-[#a8969e]">
                    A Letter For You
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🧿</span>
                  <Heart className="w-3.5 h-3.5 text-[#f8c8d8] fill-[#f8c8d8]/40" />
                </div>
              </div>

              {/* Salutation */}
              <p className="font-serif-luxury text-base sm:text-lg text-[#f2e6dc] italic">
                {specialRomanticNote.salutation}
              </p>

              {/* Letter Lines */}
              <div className="space-y-3 font-serif-luxury text-sm sm:text-[15px] text-[#c4b3bc] leading-[1.8] font-light">
                {specialRomanticNote.lines.map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>

              {/* Baby Pink Accent Divider */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#f8c8d8]/60 to-transparent my-2" />

              {/* Signoff */}
              <div className="space-y-1">
                <p className="font-sans-clean text-xs text-[#806f76] font-light">
                  {specialRomanticNote.signoff}
                </p>
                <p className="font-serif-luxury text-lg text-[#faf3ea] font-normal tracking-wide">
                  {specialRomanticNote.signature}
                </p>
              </div>
            </motion.article>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 6. QUIET FINAL SCREEN (Happy Birthday & Replay) */}
          {/* ------------------------------------------------------------------- */}
          {currentSlide.type === 'finale' && (
            <motion.div
              key="finale-slide"
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-7 px-6 max-w-sm"
            >
              <div className="flex items-center justify-center gap-1.5 text-[#f8c8d8]">
                <Heart className="w-5 h-5 fill-[#f8c8d8]/30 text-[#f8c8d8]" />
              </div>

              <div className="space-y-3">
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#faf4ec] font-normal tracking-wide">
                  Happy Birthday.
                </h2>
                <p className="font-serif-luxury italic text-sm sm:text-base text-[#b8a6af] font-light leading-relaxed max-w-xs mx-auto">
                  Some memories are meant to be felt, not just remembered.
                </p>
              </div>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#f8c8d8]/60 to-transparent mx-auto" />

              {/* Replay Button (Baby pink accent) */}
              <div className="pt-2">
                <button
                  id="slideshow-replay-btn"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#181115] hover:bg-[#261a22] border border-[#3b202e] hover:border-[#f8c8d8]/60 text-xs font-sans-clean tracking-widest uppercase text-[#f8c8d8] transition-all active:scale-95 shadow-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#f8c8d8]" />
                  <span>Replay Film</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ======================================================================= */}
      {/* MINIMAL BOTTOM BAR: Seamless Progress Line & Touch Arrows */}
      {/* ======================================================================= */}
      <footer
        className={`relative w-full max-w-lg z-30 flex flex-col items-center justify-center px-5 pb-6 pt-2 space-y-3 transition-opacity duration-500 ${
          showControls && !isFocusMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Prev Arrow Button */}
          <button
            id="slideshow-prev-arrow"
            onClick={handlePrev}
            disabled={slideIndex === 0}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full bg-[#140f12]/85 backdrop-blur-md border border-[#2b1a23] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#baa6af] hover:text-white transition-all disabled:opacity-15 disabled:pointer-events-none active:scale-90 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Minimal Baby Pink Segmented Progress */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120e10]/85 border border-[#291821]">
            {TIMELINE_SLIDES.map((_, sIdx) => {
              const isCurrent = sIdx === slideIndex;
              const isPast = sIdx < slideIndex;
              return (
                <button
                  key={sIdx}
                  onClick={() => {
                    setSlideIndex(sIdx);
                    setProgressKey((k) => k + 1);
                  }}
                  aria-label={`Jump to slide ${sIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-4 bg-[#f8c8d8]'
                      : isPast
                      ? 'w-1.5 bg-[#543444]'
                      : 'w-1.5 bg-[#24151e]'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            id="slideshow-next-arrow"
            onClick={handleNext}
            disabled={slideIndex === TIMELINE_SLIDES.length - 1}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full bg-[#140f12]/85 backdrop-blur-md border border-[#2b1a23] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#baa6af] hover:text-white transition-all disabled:opacity-15 disabled:pointer-events-none active:scale-90 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Subtle Auto-Progress Bar Indicator */}
        {isPlaying && currentSlide.type !== 'finale' && (
          <div className="w-32 h-[2px] bg-[#24151e] rounded-full overflow-hidden">
            <motion.div
              key={progressKey}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration:
                  currentSlide.type === 'shairi'
                    ? 4.8
                    : currentSlide.type === 'special_intro'
                    ? 3.8
                    : currentSlide.type === 'special_memory'
                    ? 7.8
                    : currentSlide.type === 'note'
                    ? 14
                    : 7,
                ease: 'linear',
              }}
              style={{ originX: 0 }}
              className="w-full h-full bg-gradient-to-r from-[#f8c8d8]/60 to-[#f8c8d8]"
            />
          </div>
        )}
      </footer>

      {/* ======================================================================= */}
      {/* IMMERSIVE FOCUS & CINEMATIC PINCH / DOUBLE-TAP ZOOM MODAL */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {isFocusMode && ('item' in currentSlide) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => {
              setIsFocusMode(false);
              setIsMagnified(false);
            }}
            className="fixed inset-0 z-50 flex flex-col justify-between items-center p-3 sm:p-6 bg-[#020202]/96 backdrop-blur-xl select-none"
          >
            {/* Focus Top Bar */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg flex items-center justify-between pt-2 px-2 z-20"
            >
              <div className="flex items-center gap-1.5 bg-[#160f13] px-3 py-1 rounded-full border border-[#301c27]">
                <span className="text-[10px] font-sans-clean tracking-[0.2em] uppercase text-[#f8c8d8]">
                  {currentSlide.item.indexNumber} • {currentSlide.item.tag}
                </span>
                <span className="text-xs">🧿</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Magnify Toggle */}
                <button
                  onClick={() => setIsMagnified(!isMagnified)}
                  aria-label="Toggle Magnification"
                  className="w-9 h-9 rounded-full bg-[#181015] border border-[#331d29] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#f8c8d8] hover:text-white active:scale-95 shadow-md"
                >
                  {isMagnified ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsFocusMode(false);
                    setIsMagnified(false);
                  }}
                  aria-label="Close focus"
                  className="w-9 h-9 rounded-full bg-[#181015] border border-[#331d29] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#f8c8d8] hover:text-white active:scale-95 shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Magnified Photo Stage */}
            <div 
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsMagnified((prev) => !prev);
              }}
              className="relative w-full max-w-lg flex-1 flex items-center justify-center my-auto py-2 z-10 overflow-hidden cursor-zoom-in"
            >
              <motion.div
                animate={{
                  scale: isMagnified ? 1.45 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 26,
                }}
                className="relative max-h-[68vh] w-full flex items-center justify-center overflow-hidden rounded-2xl p-2 bg-[#140e12] border border-[#301c27] shadow-2xl"
              >
                <img
                  src={currentSlide.item.image.src}
                  alt={currentSlide.item.tag}
                  className="max-h-[65vh] w-full object-contain select-none pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Minimal Caption in Focus */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg text-center pb-3 pt-1 px-4 z-20 space-y-0.5"
            >
              <p className="font-serif-luxury text-base text-[#f7efe6] font-normal italic">
                "{currentSlide.item.cinematicLine}"
              </p>
              <p className="text-[10px] text-[#806d75] tracking-widest uppercase font-light">
                Double tap to zoom • Tap outside to return
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
