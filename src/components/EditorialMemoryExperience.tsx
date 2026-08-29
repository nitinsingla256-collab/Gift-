import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Heart,
  Feather,
  RotateCcw,
  Maximize2,
  BookOpen,
  MessageSquareHeart
} from 'lucide-react';
import { tenHerPhotographs, GalleryMemorySlot } from '../data/memoryGalleryData';
import { CinematicShayariSequence } from './CinematicShayariSequence';
import { FeedbackPage } from './FeedbackPage';
import { MemoryJournalDrawer } from './MemoryJournalDrawer';
import { MemoryJournalNotesMap } from '../types';
import { soundscapeEngine } from '../utils/audioEngine';

interface EditorialMemoryExperienceProps {
  onLock: () => void;
}

type ExperienceSection = 'cinematic_gallery' | 'shayari_section' | 'special_note' | 'quiet_final_moment' | 'feedback_page';

export const EditorialMemoryExperience: React.FC<EditorialMemoryExperienceProps> = ({ onLock }) => {
  const [section, setSection] = useState<ExperienceSection>('cinematic_gallery');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryMemorySlot | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [transitionVariant, setTransitionVariant] = useState<number>(0);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [journalNotes, setJournalNotes] = useState<MemoryJournalNotesMap>(() => {
    try {
      const saved = localStorage.getItem('private_memory_journal_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 400
  );

  const activePhoto = tenHerPhotographs[currentIndex];
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor window resize with passive debounced listener for desktop/mobile adaptiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Whisper soundscape start
  useEffect(() => {
    if (!soundscapeEngine.isAudioActive()) {
      soundscapeEngine.startAmbientSynth();
    }
  }, []);

  const toggleSound = () => {
    const nextMuted = soundscapeEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleSaveJournalNote = (slideId: string, slideIndex: number, text: string, mood?: string) => {
    const newNotes: MemoryJournalNotesMap = {
      ...journalNotes,
      [slideId]: {
        slideId,
        slideIndex,
        text,
        mood,
        updatedAt: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    };
    setJournalNotes(newNotes);
    try {
      localStorage.setItem('private_memory_journal_notes', JSON.stringify(newNotes));
    } catch {
      // ignore
    }
  };

  const handleDeleteJournalNote = (slideId: string) => {
    const newNotes = { ...journalNotes };
    delete newNotes[slideId];
    setJournalNotes(newNotes);
    try {
      localStorage.setItem('private_memory_journal_notes', JSON.stringify(newNotes));
    } catch {
      // ignore
    }
  };

  const handleOpenJournal = (slideIndex?: number) => {
    if (typeof slideIndex === 'number') {
      setCurrentIndex(slideIndex);
    }
    setIsPlayingSlideshow(false);
    setIsJournalOpen(true);
  };

  const totalNotesCount = Object.keys(journalNotes).filter(
    (k) => journalNotes[k]?.text?.trim().length > 0
  ).length;

  // Cycle transition variants smoothly for varied cinematic presentation
  useEffect(() => {
    setTransitionVariant(currentIndex % 4);
  }, [currentIndex]);

  // Automatic Cinematic Slideshow Engine (9 seconds per photo)
  useEffect(() => {
    if (section === 'cinematic_gallery' && isPlayingSlideshow && !selectedPhoto) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < tenHerPhotographs.length - 1) {
            return prev + 1;
          } else {
            // Once all 10 are seen, smoothly transition to Shayari section
            setSection('shayari_section');
            return prev;
          }
        });
      }, 9000); // 9 seconds per photograph

      return () => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      };
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
  }, [section, isPlayingSlideshow, selectedPhoto]);

  // Touch Swipe Handlers for smooth mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      // Swiped left -> Next
      if (currentIndex < tenHerPhotographs.length - 1) {
        setCurrentIndex((c) => c + 1);
      } else {
        setSection('shayari_section');
      }
    } else if (diff < -45) {
      // Swiped right -> Prev
      if (currentIndex > 0) {
        setCurrentIndex((c) => c - 1);
      }
    }
    setTouchStart(null);
  };

  // Comprehensive keyboard navigation for laptops / desktops
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto) {
        if (e.key === 'Escape') setSelectedPhoto(null);
        if (e.key === 'ArrowRight') {
          const nextIdx = selectedPhoto.index % 10;
          setSelectedPhoto(tenHerPhotographs[nextIdx]);
          setCurrentIndex(nextIdx);
        }
        if (e.key === 'ArrowLeft') {
          const prevIdx = (selectedPhoto.index - 2 + 10) % 10;
          setSelectedPhoto(tenHerPhotographs[prevIdx]);
          setCurrentIndex(prevIdx);
        }
      } else if (section === 'cinematic_gallery') {
        if (e.key === 'ArrowRight') {
          if (currentIndex < tenHerPhotographs.length - 1) setCurrentIndex((c) => c + 1);
          else setSection('shayari_section');
        }
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setCurrentIndex((c) => c - 1);
        }
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          setIsPlayingSlideshow((p) => !p);
        }
        if (e.key === 'Enter') {
          setSelectedPhoto(activePhoto);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, section, currentIndex, activePhoto]);

  // Responsive spread spacing calculation: wider organic spread on larger laptop/desktop screens
  const spreadFactor = windowWidth >= 1280 ? 76 : windowWidth >= 1024 ? 68 : windowWidth >= 640 ? 50 : 34;

  return (
    <div
      id="cinematic-memory-film"
      className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center bg-[#030202] text-[#f7f2ea] px-4 sm:px-6 md:px-8 py-4 sm:py-6 select-none overflow-x-hidden"
    >
      {/* 
        =======================================================================
        BACKGROUND: Deep velvety black with subtle warm champagne ambient lighting
        =======================================================================
      */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] lg:w-[800px] h-[340px] sm:h-[600px] lg:h-[800px] rounded-full bg-[#f8c8d8]/[0.025] blur-[140px]" />
        <div className="absolute bottom-1/3 right-4 sm:right-16 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] rounded-full bg-[#e6d0a8]/[0.02] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,3,4,0)_0%,rgba(3,2,3,0.85)_80%,rgba(2,1,2,0.98)_100%)]" />
      </div>

      {/* 
        =======================================================================
        TOP STATUS BAR & CONTROLS (Scales from mobile to wide laptop screen)
        =======================================================================
      */}
      <header className="relative z-30 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">🧿</span>
          <span className="text-[10px] sm:text-xs font-sans-clean font-medium tracking-[0.25em] uppercase text-[#f8c8d8]">
            {section === 'cinematic_gallery' && 'Memory Film'}
            {section === 'shayari_section' && 'Shayari'}
            {section === 'special_note' && 'Final Scene'}
            {section === 'quiet_final_moment' && 'A Quiet Moment'}
            {section === 'feedback_page' && 'Feedback & Note'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Journal Note Drawer Trigger */}
          <button
            id="experience-journal-toggle"
            onClick={() => handleOpenJournal(currentIndex)}
            aria-label="Open Memory Journal Notes"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#120e10]/85 hover:bg-[#1f151b] backdrop-blur-md border border-[#301c27] hover:border-[#f8c8d8]/50 text-[#f8c8d8] text-[10px] sm:text-xs font-sans-clean tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-md cursor-pointer group"
          >
            <Feather className="w-3.5 h-3.5 text-[#f8c8d8] group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">Journal</span>
            {totalNotesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#f8c8d8] text-[#12080f] text-[9px] font-bold">
                {totalNotesCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            id="experience-sound-toggle"
            onClick={toggleSound}
            aria-label={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#120e10]/85 hover:bg-[#1f151b] backdrop-blur-md border border-[#301c27] text-[#f8c8d8] text-[10px] sm:text-xs font-sans-clean tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-md cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#d9a5a0]" />
                <span className="text-[#99868e]">Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#f8c8d8]" />
                <span>Sound</span>
              </>
            )}
          </button>

          {/* Lock Screen */}
          <button
            id="experience-lock-button"
            onClick={onLock}
            aria-label="Lock screen"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#120e10]/85 hover:bg-[#1f151b] backdrop-blur-md border border-[#301c27] flex items-center justify-center text-[#99868e] hover:text-white transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 
        =======================================================================
        SECTION 1: THE CINEMATIC MEMORY GALLERY (EXACTLY 10 CARDS)
        Artistic, overlapping non-grid layout with varied cinematic transitions
        Baby pink accent styling on selected card & tiny 🧿 on every card
        Responsive for Phone (portrait-first) & Laptop/Desktop (widescreen depth)
        =======================================================================
      */}
      {section === 'cinematic_gallery' && (
        <main
          className="relative z-20 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl flex-1 flex flex-col justify-between items-center py-2 my-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Section Header */}
          <div className="text-center space-y-1 pt-1">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#faf4ec] font-normal tracking-wide">
              {activePhoto.title}
            </h2>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-sans-clean tracking-[0.25em] uppercase text-[#9e8a93]">
              <span className="text-[#e6d0a8] font-medium">{activePhoto.indexFormatted}</span>
              <span>•</span>
              <span className="text-[#f8c8d8]">🧿</span>
            </div>
          </div>

          {/* 
            ===================================================================
            EXACTLY 10 FLOATING PHOTOGRAPHS IN ARTISTIC CINEMATIC OVERLAP
            - GPU-optimized compositor transforms (translate3d, rotate3d, scale3d)
            - Pure GPU opacity transitions for border and glow layers
            - Hardware acceleration layers (will-change, backface-visibility: hidden)
            - Seamless performance on Android mobile devices & wide laptops
            - Tiny 🧿 on every card near the corner
            ===================================================================
          */}
          <div className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[700px] lg:max-w-[920px] xl:max-w-[1040px] h-[340px] sm:h-[390px] md:h-[440px] lg:h-[480px] xl:h-[520px] mx-auto flex items-center justify-center my-auto overflow-visible [perspective:1200px] [contain:layout_paint]">
            {tenHerPhotographs.map((slot, idx) => {
              const isActive = idx === currentIndex;
              const diff = idx - currentIndex; // Relative offset from active photo (-9 to +9)

              // Dynamic varied offsets and cinematic transitions scaling with screen size
              let xTranslate = diff * spreadFactor;
              let yTranslate = Math.sin(diff * 0.7) * (windowWidth >= 1024 ? 14 : 10) + Math.abs(diff) * 4;
              let zTranslate = isActive ? 36 : -Math.abs(diff) * (windowWidth >= 1024 ? 24 : 18);
              let rotateY = diff * -2.8;
              let rotateZ = (diff === 0 ? (transitionVariant === 1 ? -1 : transitionVariant === 3 ? 1 : 0) : slot.rotation * 1.25);
              let scale = isActive ? 1.05 : Math.max(0.72, 1 - Math.abs(diff) * 0.055);
              let zIndex = isActive ? 35 : 30 - Math.abs(diff);
              let opacity = isActive ? 1 : Math.max(0.35, 1 - Math.abs(diff) * 0.11);

              if (Math.abs(diff) > 4) {
                const maxSpread = windowWidth >= 1024 ? 300 : windowWidth >= 640 ? 200 : 132;
                xTranslate = Math.sign(diff) * (maxSpread + (Math.abs(diff) - 4) * (windowWidth >= 1024 ? 16 : 8));
                opacity = Math.max(0.18, 0.45 - (Math.abs(diff) - 4) * 0.08);
              }

              return (
                <div
                  key={slot.id}
                  id={`memory-card-${slot.index}`}
                  onClick={() => {
                    if (isActive) {
                      setSelectedPhoto(slot);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  style={{
                    transform: `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className="absolute w-[165px] sm:w-[195px] md:w-[230px] lg:w-[260px] xl:w-[280px] aspect-[3/4] rounded-2xl p-1.5 cursor-pointer select-none group bg-[#120d11] border border-[#2b1824] shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
                >
                  {/* GPU-composited active baby-pink border and glow layer */}
                  <div
                    className="absolute -inset-[2px] rounded-[18px] border-2 border-[#f8c8d8] shadow-[0_0_24px_rgba(248,200,216,0.35),0_18px_45px_rgba(0,0,0,0.9)] pointer-events-none transition-opacity duration-300 will-change-[opacity]"
                    style={{ opacity: isActive ? 1 : 0 }}
                  />

                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0a0709]">
                    <img
                      src={slot.image.src}
                      alt={slot.title}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none [transform:translateZ(0)]"
                    />

                    {/* Subtle warm glass film sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/[0.07] pointer-events-none" />

                    {/* Tiny 🧿 Nazar Amulet Badge on every card corner */}
                    <div
                      className={`absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] border transition-opacity duration-300 ${
                        isActive
                          ? 'bg-[#080507]/95 border-[#f8c8d8]/60 text-[#f8c8d8]'
                          : 'bg-[#050304]/85 border-[#2d1b24] text-[#baa6af]'
                      }`}
                    >
                      <span className="text-[10px] leading-none">🧿</span>
                      <span className="font-sans-clean font-medium">
                        {String(slot.index).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Private Note Attached Indicator Pill */}
                    {journalNotes[slot.id]?.text?.trim() && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenJournal(idx);
                        }}
                        title="Private note attached"
                        className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#080507]/95 border border-[#f8c8d8]/70 text-[#f8c8d8] flex items-center gap-1 text-[9px] shadow-[0_0_8px_rgba(248,200,216,0.4)] cursor-pointer hover:scale-110 transition-transform z-10"
                      >
                        <Feather className="w-2.5 h-2.5 text-[#f8c8d8]" />
                        <span className="font-sans-clean font-medium">Note</span>
                      </div>
                    )}

                    {/* Expand icon on hover/selected */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                        setSelectedPhoto(slot);
                      }}
                      className={`absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                        isActive
                          ? 'bg-[#050304]/90 text-[#f8c8d8] border border-[#f8c8d8]/40 opacity-100'
                          : 'bg-[#050304]/80 text-[#99868e] opacity-0 group-hover:opacity-100 hover:text-[#f8c8d8]'
                      }`}
                    >
                      <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 
            ROMANTIC HINGLISH CAPTION (Natural, Distinct, Short)
          */}
          <motion.div
            key={activePhoto.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center px-4 max-w-md sm:max-w-xl md:max-w-2xl my-2 space-y-2"
          >
            <p className="font-serif-luxury text-sm sm:text-base md:text-lg text-[#faf4ec] font-normal italic leading-relaxed">
              "{activePhoto.hinglishLine}"
            </p>

            {/* Quick Note Attachment Trigger Button */}
            <div className="flex items-center justify-center pt-0.5">
              <button
                onClick={() => handleOpenJournal(currentIndex)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#120a10]/80 hover:bg-[#20101b] border border-[#2d1624] hover:border-[#f8c8d8]/50 text-[11px] sm:text-xs font-sans-clean text-[#c4b3bc] hover:text-[#faf4ec] transition-all cursor-pointer shadow-sm active:scale-95 group"
              >
                <Feather className="w-3 h-3 text-[#f8c8d8] group-hover:scale-110 transition-transform" />
                {journalNotes[activePhoto.id]?.text?.trim() ? (
                  <span className="flex items-center gap-1">
                    <span className="text-[#f8c8d8] font-medium">Note:</span>
                    <span className="font-serif-luxury italic text-[#ece1d8] truncate max-w-[150px] sm:max-w-[220px]">
                      "{journalNotes[activePhoto.id].text}"
                    </span>
                  </span>
                ) : (
                  <span>Attach Private Note 📝</span>
                )}
              </button>
            </div>
          </motion.div>

          {/* 
            TIMELINE SLIDER & 10 CARDS JUMP BAR (Minimal 01 / 10 and dot indicators)
          */}
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center gap-3 pt-2">
            {/* 10 Dot Indicators with Baby Pink Selected State & Minimal 01/10 */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-sans-clean font-medium text-[#f8c8d8] tracking-widest">
                {activePhoto.indexFormatted}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {tenHerPhotographs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to photo ${idx + 1}`}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-400 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-5 sm:w-6 bg-[#f8c8d8] shadow-[0_0_8px_rgba(248,200,216,0.6)]'
                        : 'w-1.5 sm:w-2 bg-[#331d2a] hover:bg-[#522f44]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Play/Pause & Nav Arrows */}
            <div className="flex items-center justify-between w-full px-3 pt-1">
              <button
                onClick={() => {
                  if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                }}
                disabled={currentIndex === 0}
                aria-label="Previous photo"
                className="px-3.5 sm:px-4 py-2 rounded-full bg-[#120e10] border border-[#2b1823] text-xs sm:text-sm text-[#baa6af] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer min-h-[40px] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4 inline" /> Prev
              </button>

              {/* Slideshow Auto-Play Toggle */}
              <button
                id="slideshow-toggle-button"
                onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#160f14] hover:bg-[#24151e] border border-[#3d2332] text-[#f8c8d8] text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer shadow-md min-h-[40px]"
              >
                {isPlayingSlideshow ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#f8c8d8]" />
                    <span>Auto (9s)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#f8c8d8]" />
                    <span>Play Film</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (currentIndex < tenHerPhotographs.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  } else {
                    setSection('shayari_section');
                  }
                }}
                aria-label="Next photo"
                className="px-3.5 sm:px-4 py-2 rounded-full bg-[#181016] border border-[#3d2232] text-xs sm:text-sm text-[#f8c8d8] hover:text-white transition-all active:scale-95 cursor-pointer font-medium min-h-[40px] flex items-center gap-1"
              >
                {currentIndex === tenHerPhotographs.length - 1 ? 'Shayari →' : 'Next'}{' '}
                <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 
        =======================================================================
        FULLSCREEN 3D ZOOM LIGHTBOX VIEWER (When tapping any card)
        - Smooth expansion from card position to center
        - Soft blur backdrop
        - Preserves original aspect ratio (portrait remains portrait, landscape landscape)
        - Elegant minimal controls (Prev, Next, Close)
        - Smoothly returns to card position on close
        =======================================================================
      */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 bg-[#020202]/96 backdrop-blur-md select-none will-change-[opacity]"
          >
            {/* Modal Header */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-4xl flex items-center justify-between pt-2 px-2 z-20"
            >
              <div className="flex items-center gap-2 bg-[#140e12] px-3.5 py-1.5 rounded-full border border-[#2d1b24]">
                <span className="text-[10px] sm:text-xs font-sans-clean font-medium tracking-[0.25em] uppercase text-[#f8c8d8]">
                  {selectedPhoto.indexFormatted}
                </span>
                <span className="text-xs">🧿</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenJournal(selectedPhoto.index - 1)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#140e12] border border-[#2d1b24] hover:border-[#f8c8d8]/50 text-xs text-[#f8c8d8] hover:text-white transition-all active:scale-95 shadow-md cursor-pointer min-h-[36px]"
                >
                  <Feather className="w-3.5 h-3.5 text-[#f8c8d8]" />
                  <span className="text-[10px] font-sans-clean tracking-wider uppercase">
                    {journalNotes[selectedPhoto.id]?.text ? 'Edit Note' : 'Attach Note'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Close photo view (Esc)"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#140e12] border border-[#2d1b24] hover:border-[#f8c8d8]/50 text-xs text-[#f8c8d8] hover:text-white transition-all active:scale-95 shadow-md cursor-pointer min-h-[36px]"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-sans-clean tracking-wider uppercase">Close</span>
                </button>
              </div>
            </div>

            {/* Central Un-distorted Photo Mount with 3D Zoom Transition */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-4xl flex-1 flex flex-col items-center justify-center my-auto py-2 z-10"
            >
              <motion.div
                key={selectedPhoto.id}
                initial={{ scale: 0.88, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.88, y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-h-[60vh] sm:max-h-[66vh] md:max-h-[72vh] w-full flex items-center justify-center rounded-2xl p-2 bg-[#120d10] border border-[#2d1b24] shadow-[0_25px_70px_rgba(0,0,0,0.98)] overflow-hidden will-change-[transform,opacity]"
              >
                {/* Background ambient subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8c8d8]/[0.04] to-transparent pointer-events-none" />

                <img
                  src={selectedPhoto.image.src}
                  alt={selectedPhoto.title}
                  decoding="async"
                  className="max-h-[56vh] sm:max-h-[62vh] md:max-h-[68vh] w-auto max-w-full object-contain rounded-xl select-none [transform:translateZ(0)]"
                />
              </motion.div>

              {/* Romantic Hinglish Caption */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="w-full text-center pt-4 px-4 space-y-1.5 will-change-[transform,opacity]"
              >
                <p className="font-serif-luxury text-base sm:text-lg md:text-xl text-[#faf4ec] font-normal italic leading-relaxed">
                  "{selectedPhoto.hinglishLine}"
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-[#8c7b84] font-light tracking-[0.25em] uppercase pt-0.5">
                  <span>{selectedPhoto.title}</span>
                  <span>•</span>
                  <span className="text-[#f8c8d8]">🧿</span>
                </div>

                {journalNotes[selectedPhoto.id]?.text?.trim() && (
                  <div
                    onClick={() => handleOpenJournal(selectedPhoto.index - 1)}
                    className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#140a10]/90 border border-[#3b1c2f] hover:border-[#f8c8d8]/60 cursor-pointer text-center max-w-sm mx-auto transition-all group"
                  >
                    <Feather className="w-3 h-3 text-[#f8c8d8]" />
                    <p className="font-serif-luxury italic text-xs text-[#f8c8d8] group-hover:text-white truncate max-w-[220px]">
                      "{journalNotes[selectedPhoto.id].text}"
                    </p>
                    <span className="text-[9px] font-sans-clean text-[#8e7a85] uppercase tracking-wider">
                      Edit
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Bottom Slider Nav */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-4xl flex items-center justify-between pb-3 px-2 z-20"
            >
              <button
                onClick={() => {
                  const prevIdx = (selectedPhoto.index - 2 + 10) % 10;
                  setSelectedPhoto(tenHerPhotographs[prevIdx]);
                  setCurrentIndex(prevIdx);
                }}
                aria-label="Previous photo"
                className="w-10 h-10 rounded-full bg-[#140e12] border border-[#2d1b24] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#baa6af] hover:text-white active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-[10px] sm:text-xs font-sans-clean font-light tracking-widest text-[#786770] uppercase">
                Tap anywhere or press ESC to close
              </span>

              <button
                onClick={() => {
                  const nextIdx = selectedPhoto.index % 10;
                  setSelectedPhoto(tenHerPhotographs[nextIdx]);
                  setCurrentIndex(nextIdx);
                }}
                aria-label="Next photo"
                className="w-10 h-10 rounded-full bg-[#140e12] border border-[#2d1b24] hover:border-[#f8c8d8]/50 flex items-center justify-center text-[#baa6af] hover:text-white active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        =======================================================================
        SECTION 2: SHAYARI (SECOND LAST SECTION)
        - Section Title: SHAYARI
        - "Shayari 1" [EMPTY CONTENT AREA]
        - "Shayari 2" [EMPTY CONTENT AREA]
        - Responsive 2-column side-by-side grid on widescreen laptops/desktops
        - Subtle reveal animation & generous space
        =======================================================================
      */}
      {section === 'shayari_section' && (
        <CinematicShayariSequence onComplete={() => setSection('special_note')} />
      )}

      {/* 
        =======================================================================
        SECTION 3: SPECIAL NOTE — FINAL SCENE
        - Title: "From the Core of My Heart"
        - Main text area EMPTY (ready for user's complete note)
        - Warm champagne typography, subtle baby-pink glow, generous empty space
        - Appears gradually like the emotional ending of a movie
        =======================================================================
      */}
      {section === 'special_note' && (
        <main className="relative z-20 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl flex-1 flex flex-col justify-center items-center py-6 my-auto">
          <motion.article
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-3xl bg-gradient-to-b from-[#180f15] via-[#10090e] to-[#070406] border border-[#3d2232] p-7 sm:p-9 md:p-10 space-y-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            {/* Delicate Warm Halo Accent */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#f8c8d8]/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Note Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#261520]">
              <div className="flex items-center gap-2 text-[#f8c8d8]">
                <Feather className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs font-sans-clean tracking-[0.25em] uppercase text-[#a8969e]">
                  Final Scene
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🧿</span>
                <Heart className="w-3.5 h-3.5 text-[#f8c8d8] fill-[#f8c8d8]/30" />
              </div>
            </div>

            {/* Note Title */}
            <div className="space-y-1">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#faf4ec] font-normal tracking-wide">
                From the Core of My Heart
              </h2>
            </div>

            {/* 
              EMPTY CONTENT AREA FOR USER'S ACTUAL NOTE:
              Large, beautifully framed, ready for user's note
            */}
            <div className="py-20 sm:py-24 px-4 border border-dashed border-[#361e2c] rounded-2xl flex flex-col items-center justify-center space-y-3 bg-[#0a0608]/60 text-center">
              <Heart className="w-6 h-6 text-[#f8c8d8]/40 fill-[#f8c8d8]/10" />
              <p className="font-serif-luxury italic text-sm sm:text-base text-[#b8a4ae] leading-relaxed max-w-sm">
                [ EMPTY CONTENT AREA ]
              </p>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#f8c8d8]/40 to-transparent mx-auto" />
            </div>

            {/* Signoff */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-sans-clean text-xs sm:text-sm text-[#8c7b84]">Always,</span>
              <span className="font-serif-luxury text-base sm:text-lg text-[#faf3ea]">Yours</span>
            </div>
          </motion.article>

          {/* Controls */}
          <div className="pt-6 flex items-center justify-between w-full">
            <button
              onClick={() => setSection('shayari_section')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#120e10] border border-[#2b1823] text-xs sm:text-sm text-[#baa6af] hover:text-white transition-all active:scale-95 cursor-pointer min-h-[40px]"
            >
              ← Shayari
            </button>

            <button
              onClick={() => setSection('quiet_final_moment')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#181015] hover:bg-[#261722] border border-[#3b202e] hover:border-[#f8c8d8]/60 text-xs sm:text-sm font-sans-clean font-medium tracking-widest uppercase text-[#f8c8d8] transition-all active:scale-95 shadow-lg cursor-pointer min-h-[40px]"
            >
              Quiet Moment ✨
            </button>
          </div>
        </main>
      )}

      {/* 
        =======================================================================
        SECTION 4: QUIET FINAL MOMENT
        - Small, intimate text: "Some things are better felt than said."
        - Calm, peaceful lingering screen (no confetti, no cheesy ending)
        =======================================================================
      */}
      {section === 'quiet_final_moment' && (
        <main className="relative z-20 w-full max-w-md sm:max-w-lg md:max-w-xl flex-1 flex flex-col justify-center items-center py-6 my-auto text-center space-y-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 text-[#f8c8d8]/70">
              <span className="text-sm sm:text-base">🧿</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#faf4ec] font-normal tracking-wide">
                HAPPY BIRTHDAY
              </h2>

              <p className="font-serif-luxury italic text-xs sm:text-sm md:text-base text-[#baa6af] font-light leading-relaxed max-w-sm mx-auto pt-2">
                "Some things are better felt than said."
              </p>
            </div>

            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#f8c8d8]/40 to-transparent mx-auto" />

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSection('cinematic_gallery');
                  setIsPlayingSlideshow(true);
                }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#160f14] hover:bg-[#24151e] border border-[#3d2332] hover:border-[#f8c8d8]/60 text-xs sm:text-sm font-sans-clean tracking-widest uppercase text-[#f8c8d8] transition-all active:scale-95 shadow-lg cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#f8c8d8]" />
                <span>Replay Film</span>
              </button>

              <button
                onClick={() => setSection('feedback_page')}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#1e121b] hover:bg-[#2d1b28] border border-[#452338] hover:border-[#f8c8d8]/70 text-xs sm:text-sm font-sans-clean tracking-widest uppercase text-[#f8c8d8] transition-all active:scale-95 shadow-lg cursor-pointer min-h-[44px]"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-[#f8c8d8]" />
                <span>Leave Feedback ✨</span>
              </button>

              <button
                onClick={onLock}
                className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-transparent hover:bg-[#160f14] border border-[#2b1823] text-xs sm:text-sm font-sans-clean tracking-widest uppercase text-[#99868e] transition-all cursor-pointer min-h-[44px]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            </div>
          </motion.div>
        </main>
      )}

      {/* 
        =======================================================================
        SECTION 5: FEEDBACK & NOTE PAGE
        - Private, meaningful feedback form with rating & heartfelt reflections
        - Local persistence & copy/export options
        =======================================================================
      */}
      {section === 'feedback_page' && (
        <FeedbackPage
          onReplay={() => {
            setCurrentIndex(0);
            setSection('cinematic_gallery');
            setIsPlayingSlideshow(true);
          }}
          onLock={onLock}
        />
      )}

      {/* 
        =======================================================================
        OPTIONAL SLIDE-IN PRIVATE JOURNAL DRAWER
        - Allows user to leave short private text notes attached to any memory slide
        - Clean slide-in animation with mood tags, copy, and delete
        =======================================================================
      */}
      <MemoryJournalDrawer
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        activeSlideIndex={currentIndex}
        onSelectSlide={(idx) => setCurrentIndex(idx)}
        notes={journalNotes}
        onSaveNote={handleSaveJournalNote}
        onDeleteNote={handleDeleteJournalNote}
      />

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl text-center py-1">
        <p className="font-sans-clean text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#614f57] font-light">
          Private Digital Gift • 🧿
        </p>
      </footer>
    </div>
  );
};
