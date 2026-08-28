import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize2, 
  Sparkles,
  Lock,
  Heart
} from 'lucide-react';
import { CinematicSlide, PhotoSlide, ShayariSlide, ChapterSlide, FinaleSlide, IntroSlide, MemoryImage } from '../types';
import { CINEMATIC_FILM_SLIDES } from '../data/cinematicFilmData';
import { CinematicImageViewer } from './CinematicImageViewer';
import { soundscapeEngine } from '../utils/audioEngine';
import { allTenMemories } from '../data/memoryGalleryData';

interface CinematicSlideshowProps {
  onLock: () => void;
}

export const CinematicSlideshow: React.FC<CinematicSlideshowProps> = ({ onLock }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [viewerPhotoIndex, setViewerPhotoIndex] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = CINEMATIC_FILM_SLIDES[currentIndex];
  const isFinalSlide = currentSlide?.type === 'finale';

  // Ensure audio is started on entrance
  useEffect(() => {
    if (!soundscapeEngine.isAudioActive()) {
      soundscapeEngine.startAmbientSynth();
    }
  }, []);

  // Adjust volume subtly based on chapter for intimate feeling
  useEffect(() => {
    if (!currentSlide) return;
    if (currentSlide.type === 'chapter' || (currentSlide.type === 'photo' && currentSlide.chapter === 'special-one') || (currentSlide.type === 'shayari' && currentSlide.chapter === 'special-one')) {
      soundscapeEngine.setVolume(0.28);
    } else {
      soundscapeEngine.setVolume(0.42);
    }
  }, [currentSlide]);

  // Hide overlay controls automatically after 3 seconds of inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3800);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [currentIndex, resetControlsTimer]);

  // Slideshow Navigation
  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= CINEMATIC_FILM_SLIDES.length - 1) return prev;
      return prev + 1;
    });
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
  }, []);

  const handleReplay = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  // Auto Advance Timer
  useEffect(() => {
    if (!isPlaying || isViewerOpen || isFinalSlide) return;

    const duration = ('duration' in currentSlide && currentSlide.duration) 
      ? currentSlide.duration * 1000 
      : 6000;

    const timer = setTimeout(() => {
      goToNextSlide();
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, isViewerOpen, isFinalSlide, currentSlide, goToNextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (isViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPlaying((p) => !p);
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen, goToNextSlide, goToPrevSlide]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    resetControlsTimer();
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundscapeEngine.setMuted(nextMuted);
  };

  // Open full-screen photo viewer
  const handleOpenPhotoViewer = (image: MemoryImage) => {
    const foundIdx = allTenMemories.findIndex((img) => img.id === image.id);
    setViewerPhotoIndex(foundIdx >= 0 ? foundIdx : 0);
    setIsViewerOpen(true);
  };

  // Extract photo progress if current slide is photo
  const currentPhotoIndex = currentSlide?.type === 'photo' ? currentSlide.photoIndex : null;

  return (
    <div
      id="cinematic-slideshow-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      className="relative w-full h-[100dvh] bg-[#040303] text-[#f2ece1] overflow-hidden flex flex-col justify-between items-center select-none"
    >
      {/* Background Vignette & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,3,3,0.85)_100%)]" />

      {/* Subtle Light Leak Movement */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.2],
          scale: [1, 1.2, 1.05],
          x: [-20, 20, -10],
          y: [-10, 15, -5],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#d4af78]/[0.04] blur-[90px] pointer-events-none z-0"
      />

      {/* ========================================================================= */}
      {/* TOP HEADER CONTROLS (Discreet, film HUD style) */}
      {/* ========================================================================= */}
      <header
        className={`relative w-full max-w-lg z-30 flex items-center justify-between px-5 pt-5 sm:pt-6 transition-opacity duration-500 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress & Chapter Label */}
        <div className="flex items-center gap-2.5">
          {currentPhotoIndex !== null ? (
            <span className="text-[11px] font-sans-clean font-light tracking-[0.25em] uppercase text-[#d4af78] bg-[#120f0e]/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#2b221b]">
              {String(currentPhotoIndex).padStart(2, '0')} / 10
            </span>
          ) : (
            <span className="text-[10px] font-sans-clean font-light tracking-[0.25em] uppercase text-[#8c8073] bg-[#120f0e]/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#261f1a]">
              Memory Film
            </span>
          )}
        </div>

        {/* Right Actions: Play/Pause, Sound Toggle, Lock/Exit */}
        <div className="flex items-center gap-2">
          {/* Play / Pause Toggle */}
          {!isFinalSlide && (
            <button
              id="slideshow-play-pause-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="w-8 h-8 rounded-full bg-[#14110f]/80 backdrop-blur-md border border-[#29221c] hover:border-[#4d3e33] flex items-center justify-center text-[#c9bea5] hover:text-white transition-all active:scale-95 shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="slideshow-sound-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMute();
            }}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            className="w-8 h-8 rounded-full bg-[#14110f]/80 backdrop-blur-md border border-[#29221c] hover:border-[#4d3e33] flex items-center justify-center text-[#c9bea5] hover:text-white transition-all active:scale-95 shadow-md"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#d9a5a0]" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Lock / Exit */}
          <button
            id="slideshow-lock-btn"
            onClick={(e) => {
              e.stopPropagation();
              onLock();
            }}
            aria-label="Lock experience"
            className="w-8 h-8 rounded-full bg-[#14110f]/80 backdrop-blur-md border border-[#29221c] hover:border-[#4d3e33] flex items-center justify-center text-[#948778] hover:text-white transition-all active:scale-95 shadow-md"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CINEMATIC STAGE */}
      {/* ========================================================================= */}
      <main className="relative w-full max-w-lg flex-1 flex flex-col justify-center items-center px-4 my-auto overflow-hidden z-20">
        <AnimatePresence mode="wait">
          {/* SLIDE TYPE: INTRO / PROLOGUE */}
          {currentSlide.type === 'intro' && (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-4 px-6 max-w-sm"
            >
              <div className="flex items-center justify-center gap-2 text-[#d4af78]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f5efe6] font-normal tracking-wide leading-tight">
                {currentSlide.text}
              </h2>
              {currentSlide.subtext && (
                <p className="font-sans-clean text-xs sm:text-sm text-[#9c8f81] font-light tracking-wider">
                  {currentSlide.subtext}
                </p>
              )}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 1.5 }}
                className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af78]/60 to-transparent mx-auto pt-2"
              />
            </motion.div>
          )}

          {/* SLIDE TYPE: CHAPTER TRANSITION */}
          {currentSlide.type === 'chapter' && (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-4 px-6 max-w-sm"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181310] border border-[#382b20] text-[10px] uppercase tracking-[0.28em] text-[#d4af78]">
                <Heart className="w-3 h-3 text-[#d9a5a0]" />
                <span>Chapter Two</span>
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#f7f2ea] font-normal tracking-wider">
                {currentSlide.chapterTitle}
              </h2>
              <p className="font-serif-luxury italic text-xs sm:text-sm text-[#b5a697] font-light leading-relaxed max-w-xs mx-auto">
                {currentSlide.chapterSubtitle}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d9a5a0]/70 to-transparent mx-auto pt-3"
              />
            </motion.div>
          )}

          {/* SLIDE TYPE: DEDICATED SHAYARI PAUSE */}
          {currentSlide.type === 'shayari' && (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-5 px-6 max-w-sm"
            >
              {/* Subtle top gold accent */}
              <div className="flex items-center justify-center gap-2 text-[#d4af78]/50">
                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af78]/40" />
                <Sparkles className="w-3 h-3 text-[#d4af78]/80" />
                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af78]/40" />
              </div>

              {/* Hindi Shayari Verses */}
              <div className="space-y-2">
                {currentSlide.hindiLines.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className="font-serif-luxury text-xl sm:text-2xl text-[#f3ede3] font-normal tracking-wide italic leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* English Subtitle Translation */}
              {currentSlide.englishTranslation && (
                <p className="font-sans-clean text-xs text-[#8c7f71] font-light italic max-w-xs mx-auto leading-relaxed pt-1">
                  "{currentSlide.englishTranslation}"
                </p>
              )}
            </motion.div>
          )}

          {/* SLIDE TYPE: PHOTOGRAPH SLIDE (Hero focus, Ken Burns motion, Film subtitle) */}
          {currentSlide.type === 'photo' && (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full flex flex-col justify-center items-center space-y-3"
            >
              {/* Realistic Photographic Mount Frame */}
              <motion.div
                layoutId={`film-photo-${currentSlide.image.id}`}
                onClick={() => handleOpenPhotoViewer(currentSlide.image)}
                className="group cursor-pointer relative max-h-[64vh] w-full flex items-center justify-center overflow-hidden rounded-2xl p-2 bg-[#120f0e] border border-[#2b221b] hover:border-[#4d3d30] shadow-2xl shadow-black/90 transition-all duration-400"
              >
                {/* Photo Presentation Area with Ken Burns Movement */}
                <div className="relative w-full h-full max-h-[62vh] overflow-hidden rounded-xl bg-[#090807] flex items-center justify-center">
                  <motion.img
                    src={currentSlide.image.src}
                    alt={currentSlide.image.title || 'Memory photograph'}
                    initial={
                      currentSlide.motionVariant === 'zoom-in'
                        ? { scale: 1 }
                        : currentSlide.motionVariant === 'zoom-out'
                        ? { scale: 1.1 }
                        : currentSlide.motionVariant === 'pan-right'
                        ? { scale: 1.06, x: -12 }
                        : currentSlide.motionVariant === 'pan-left'
                        ? { scale: 1.06, x: 12 }
                        : { scale: 1.05, y: 10 }
                    }
                    animate={
                      currentSlide.motionVariant === 'zoom-in'
                        ? { scale: 1.09 }
                        : currentSlide.motionVariant === 'zoom-out'
                        ? { scale: 1 }
                        : currentSlide.motionVariant === 'pan-right'
                        ? { scale: 1.06, x: 12 }
                        : currentSlide.motionVariant === 'pan-left'
                        ? { scale: 1.06, x: -12 }
                        : { scale: 1.05, y: -10 }
                    }
                    transition={{
                      duration: (currentSlide.duration || 6.5) + 1.5,
                      ease: 'linear',
                    }}
                    className="w-full max-h-[62vh] object-contain select-none pointer-events-none"
                  />

                  {/* Tap-to-expand Indicator Pill */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#0c0a09]/80 backdrop-blur-md border border-[#2b231d] flex items-center justify-center text-[#d4af78] opacity-70 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>

              {/* Film Subtitle (Appears like subtitles in a movie) */}
              <div className="w-full max-w-sm text-center pt-1 px-3 space-y-1">
                {currentSlide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-serif-luxury text-sm sm:text-base text-[#ded6ca] font-normal tracking-wide leading-relaxed italic"
                  >
                    "{currentSlide.subtitle}"
                  </motion.p>
                )}

                {currentSlide.image.title && (
                  <p className="font-sans-clean text-[10px] text-[#736657] font-light uppercase tracking-[0.2em]">
                    {currentSlide.image.title}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* SLIDE TYPE: FINALE / EPILOGUE */}
          {currentSlide.type === 'finale' && (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-7 px-6 max-w-sm"
            >
              {/* Soft Heart / Sparkle Icon */}
              <div className="flex items-center justify-center gap-1.5 text-[#d9a5a0]">
                <Heart className="w-5 h-5 fill-[#d9a5a0]/40 text-[#d9a5a0]" />
              </div>

              {/* Greeting */}
              <div className="space-y-3">
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7f2ea] font-normal tracking-wide">
                  {currentSlide.greeting}
                </h2>
                <p className="font-serif-luxury italic text-sm sm:text-base text-[#b0a293] font-light leading-relaxed max-w-xs mx-auto">
                  {currentSlide.quote}
                </p>
              </div>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af78]/60 to-transparent mx-auto" />

              {/* Replay Button */}
              <div className="pt-2">
                <button
                  id="slideshow-replay-btn"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#181412] hover:bg-[#241e1a] border border-[#3b2e24] hover:border-[#614d3c] text-xs font-sans-clean tracking-widest uppercase text-[#f2ece1] transition-all active:scale-95 shadow-xl shadow-black/80"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#d4af78]" />
                  <span>Replay Film</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* BOTTOM SLIDESHOW NAVIGATION & PROGRESS BAR */}
      {/* ========================================================================= */}
      <footer
        className={`relative w-full max-w-lg z-30 flex flex-col items-center justify-center px-5 pb-6 pt-2 space-y-3 transition-opacity duration-500 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Navigation Arrows & Minimal Dot Progress */}
        <div className="w-full flex items-center justify-between">
          {/* Prev Slide Button */}
          <button
            id="slideshow-prev-btn"
            onClick={goToPrevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full bg-[#14110f]/80 backdrop-blur-md border border-[#26201b] hover:border-[#4d3e33] flex items-center justify-center text-[#b8ad9c] hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-90 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Minimal Segmented Progress Line */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120f0e]/80 border border-[#241e19]">
            {CINEMATIC_FILM_SLIDES.map((_, sIdx) => {
              const isCurrent = sIdx === currentIndex;
              const isPast = sIdx < currentIndex;
              return (
                <button
                  key={sIdx}
                  onClick={() => setCurrentIndex(sIdx)}
                  aria-label={`Go to slide ${sIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-5 bg-[#d4af78]'
                      : isPast
                      ? 'w-1.5 bg-[#54463a]'
                      : 'w-1.5 bg-[#26201b]'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Slide Button */}
          <button
            id="slideshow-next-btn"
            onClick={goToNextSlide}
            disabled={currentIndex === CINEMATIC_FILM_SLIDES.length - 1}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full bg-[#14110f]/80 backdrop-blur-md border border-[#26201b] hover:border-[#4d3e33] flex items-center justify-center text-[#b8ad9c] hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-90 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Shared Interactive Tap-to-Zoom Fullscreen Viewer */}
      <CinematicImageViewer
        images={allTenMemories}
        currentIndex={viewerPhotoIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onNavigate={(newIdx) => setViewerPhotoIndex(newIdx)}
        layoutPrefix="film-photo"
      />
    </div>
  );
};
