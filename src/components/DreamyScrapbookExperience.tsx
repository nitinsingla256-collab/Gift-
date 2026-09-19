import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  RotateCcw,
  Feather,
  Lock,
  MessageSquareHeart,
  Calendar,
  Check
} from 'lucide-react';
import { tenHerPhotographs, GalleryMemorySlot } from '../data/memoryGalleryData';
import { soundscapeEngine } from '../utils/audioEngine';
import { MemoryJournalDrawer } from './MemoryJournalDrawer';
import { FeedbackPage } from './FeedbackPage';
import { MemoryJournalNotesMap } from '../types';

interface DreamyScrapbookExperienceProps {
  onLock: () => void;
}

/**
 * Ambient Twinkling Stars (Ele from lovearea template)
 */
const TwinklingStars: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        scale: Math.random() * 0.4 + 0.2,
        duration: 2.2 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute text-yellow-300 opacity-60"
          style={{ top: `${s.top}vh`, left: `${s.left}vw` }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.2, s.scale + 0.3, 0.2],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        >
          <Sparkles fill="currentColor" size={18} />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Falling Crimson Heart Petals (Mle from lovearea template)
 */
const FallingHeartPetals: React.FC = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        duration: 4.5 + Math.random() * 4,
        delay: Math.random() * 5,
        size: 16 + Math.floor(Math.random() * 12),
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-red-500/80 drop-shadow-sm"
          style={{ left: `${p.x}vw` }}
          initial={{ y: -50 }}
          animate={{ y: '110vh', rotate: 360 }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        >
          <Heart fill="currentColor" size={p.size} />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Falling Pastel Confetti (jle from lovearea template)
 */
const FallingConfetti: React.FC = () => {
  const confettiColors = ['#b9e2ff', '#ffd1dc', '#ffffff', '#ffd700', '#ff9bb2'];
  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: confettiColors[i % confettiColors.length],
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {pieces.map((c) => (
        <motion.div
          key={c.id}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            backgroundColor: c.color,
            left: `${c.left}vw`,
          }}
          initial={{ top: -20, opacity: 1 }}
          animate={{
            top: '110vh',
            rotate: 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: 'easeOut',
            delay: c.delay,
          }}
        />
      ))}
    </div>
  );
};

export const DreamyScrapbookExperience: React.FC<DreamyScrapbookExperienceProps> = ({ onLock }) => {
  // 1: Intro ("IT'S YOUR DAY.."), 1.1: Rejection ("Are you sure?"), 2: Greeting ("Happy Birthday.."),
  // 3: Countdown & Wish, 4: Envelope & Wax Seal, 5: Letter, 6: Scrapbook Photo Gallery
  const [scene, setScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => soundscapeEngine.getIsPlaying());
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState<boolean>(false);
  const [wishMade, setWishMade] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryMemorySlot | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  // Journal notes persisted locally
  const [journalNotes, setJournalNotes] = useState<MemoryJournalNotesMap>(() => {
    try {
      const saved = localStorage.getItem('private_memory_journal_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Touch swipe support for polaroid carousel
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Subscribe to audio engine state & eager preload all photos & stickers
  useEffect(() => {
    soundscapeEngine.play().catch(() => {});
    const unsubscribe = soundscapeEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });

    // Immediately preload all 10 photos into memory for instant transitions
    tenHerPhotographs.forEach((p) => {
      const img = new Image();
      img.src = p.image.src;
      if (p.image.fallbackSrc) {
        const fb = new Image();
        fb.src = p.image.fallbackSrc;
      }
    });

    // Preload scrapbook embellishments
    const stickers = [
      '/scrapbook/waxSeal.webp',
      '/scrapbook/cake.webp',
      '/scrapbook/partyPopper.webp',
      '/scrapbook/teddy.webp',
      '/scrapbook/cheers.webp',
      '/scrapbook/camera.webp',
      '/scrapbook/gift.webp',
      '/scrapbook/bow.webp',
      '/scrapbook/balloons.webp',
      '/scrapbook/bdayBanner.webp',
      '/scrapbook/decoration.webp',
      '/scrapbook/flower1.webp',
      '/scrapbook/tulip.webp',
      '/scrapbook/cherry.webp',
      '/scrapbook/redflower.webp',
    ];
    stickers.forEach((s) => {
      const img = new Image();
      img.src = s;
    });

    return unsubscribe;
  }, []);

  const toggleSound = () => {
    soundscapeEngine.toggle();
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

  const totalNotesCount = Object.keys(journalNotes).filter(
    (k) => journalNotes[k]?.text?.trim().length > 0
  ).length;

  const currentPhoto = tenHerPhotographs[photoIndex];

  // Envelope tap to open handler
  const handleOpenEnvelope = () => {
    if (isOpeningEnvelope) return;
    setIsOpeningEnvelope(true);
    setTimeout(() => {
      setScene(5);
      setIsOpeningEnvelope(false);
    }, 1400);
  };

  // Determine current background texture & style
  const getSceneBackground = () => {
    if (scene === 1 || scene === 1.1 || scene === 2) {
      return {
        backgroundColor: '#fdfbf6',
        backgroundImage: 'linear-gradient(#e8e3dc 1px, transparent 1px), linear-gradient(90deg, #e8e3dc 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      };
    }
    if (scene === 3) {
      return {
        backgroundImage: 'url(/scrapbook/cloudBg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (scene === 4) {
      return {
        backgroundImage: 'url(/scrapbook/newsPaperBg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (scene === 5) {
      return {
        backgroundImage: 'url(/scrapbook/blueGridBg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    // scene 6 (Gallery)
    return {
      backgroundImage: 'url(/scrapbook/starBg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };

  return (
    <div
      id="dreamy-scrapbook-root"
      className="relative w-full min-h-screen text-[#222222] font-poppins overflow-x-hidden overflow-y-auto transition-all duration-700 select-none"
      style={getSceneBackground()}
    >
      {/* 
        =======================================================================
        AMBIENT PARTICLES MATCHING DREAMY SCRAPBOOK
        =======================================================================
      */}
      <TwinklingStars />
      {(scene === 2 || scene === 6) && <FallingHeartPetals />}
      {scene === 3 && <FallingConfetti />}

      {/* 
        =======================================================================
        TOP FLOATING NAV BAR
        =======================================================================
      */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: Current chapter / return */}
        <div className="pointer-events-auto flex items-center gap-2">
          {scene > 1 && (
            <button
              onClick={() => setScene((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-[#e2d5cb] text-xs font-cute text-[#6b4c59] shadow-sm active:scale-95 transition-all"
            >
              <ChevronLeft size={14} />
              <span>Back</span>
            </button>
          )}

          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#e2d5cb] text-xs font-cute text-[#a0486a] shadow-sm">
            <span>Special Memory</span>
            <span className="text-[#a0486a]">🧿</span>
          </span>
        </div>

        {/* Right: Controls (Music, Journal, Lock) */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Audio Player Button (Song: Preet Re) */}
          <button
            id="dreamy-sound-toggle"
            onClick={toggleSound}
            aria-label="Toggle song playback"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-cute tracking-wide transition-all shadow-md active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 text-white border-rose-400 shadow-rose-300/40'
                : 'bg-white/80 text-rose-700 border-rose-200 hover:bg-rose-50 animate-pulse'
            }`}
          >
            {isPlaying ? <Volume2 size={15} className="animate-bounce" /> : <VolumeX size={15} />}
            <span className="hidden xs:inline">{isPlaying ? 'Preet Re 🎵' : 'Play Music 🎵'}</span>
          </button>

          {/* Journal Drawer Button */}
          {scene === 6 && (
            <button
              onClick={() => setIsJournalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-pink-200 text-xs font-cute text-pink-600 shadow-sm active:scale-95 transition-all"
            >
              <Feather size={14} />
              <span className="hidden sm:inline">Journal</span>
              {totalNotesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalNotesCount}
                </span>
              )}
            </button>
          )}

          {/* Lock Screen Button */}
          <button
            onClick={onLock}
            title="Lock Experience"
            className="p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-[#e2d5cb] text-gray-600 hover:text-red-600 shadow-sm active:scale-95 transition-all"
          >
            <Lock size={14} />
          </button>
        </div>
      </header>

      {/* 
        =======================================================================
        SCENE CONTENT SWITCHER WITH SMOOTH ANIMATIONS
        =======================================================================
      */}
      <AnimatePresence mode="wait">
        {/* 
          =====================================================================
          SCENE 1: THE BIRTHDAY INTRO ("IT'S YOUR DAY..")
          =====================================================================
        */}
        {scene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 flex flex-col items-center justify-center text-center w-full min-h-screen px-4 py-20"
          >
            {/* Corner Decorative Stickers */}
            <motion.img
              src="/scrapbook/decoration.webp"
              alt="Decoration"
              className="absolute top-0 left-0 w-44 sm:w-64 md:w-[28rem] z-10 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: -60, y: -60 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <motion.img
              src="/scrapbook/flower1.webp"
              alt="Flower"
              className="absolute left-0 bottom-0 w-36 sm:w-52 md:w-80 z-10 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: -40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            />
            <motion.img
              src="/scrapbook/tulip.webp"
              alt="Tulip"
              className="absolute right-0 bottom-0 w-36 sm:w-52 md:w-80 z-10 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: 40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
            />
            <motion.img
              src="/scrapbook/flower1.webp"
              alt="Flower Top Right"
              className="absolute right-4 -top-8 w-32 sm:w-48 md:w-72 z-10 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: 40, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
            />

            {/* Central Typography & Card */}
            <div className="relative z-30 flex flex-col items-center max-w-4xl px-4 py-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-sm font-cute mb-6 shadow-sm"
              >
                <span>Happy Birthday For You</span>
                <span>🧿</span>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl sm:text-7xl md:text-[7.5rem] font-blocky leading-none mb-6 text-[#222222] tracking-normal drop-shadow-sm"
              >
                IT'S YOUR DAY..
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-gray-700 mb-10 leading-relaxed"
              >
                And I made something special for you..♡ 🧿
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center"
              >
                <button
                  onClick={() => setScene(2)}
                  className="btn-primary text-xl sm:text-2xl px-10 sm:px-14 py-4 sm:py-5 shadow-2xl"
                >
                  <span>YES PLEASE 💗</span>
                </button>

                <button
                  onClick={() => setScene(1.1)}
                  className="bg-black/5 hover:bg-black/10 text-gray-700 font-bold border border-black/15 text-lg sm:text-xl px-7 py-3 rounded-full transition-all active:scale-95"
                >
                  <span>NO 🙈</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 
          =====================================================================
          SCENE 1.1: CUTE REJECTION SCENE ("Are you sure?")
          =====================================================================
        */}
        {scene === 1.1 && (
          <motion.div
            key="scene-1-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex flex-col items-center justify-center p-6 text-center w-full min-h-screen text-black"
          >
            <motion.img
              src="/scrapbook/angry.gif"
              alt="Cute Angry Expression"
              className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 mb-8 rounded-3xl border-4 border-black/10 shadow-xl object-cover"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cute font-bold mb-8 px-4 max-w-xl text-[#b03060] leading-snug">
              Are you sure? It's your birthday! 🥺 🧿
            </h2>

            <button
              onClick={() => setScene(1)}
              className="btn-primary text-xl px-10 py-4 shadow-xl"
            >
              <span>Okay, Try Again! 💗</span>
            </button>
          </motion.div>
        )}

        {/* 
          =====================================================================
          SCENE 2: GRAND BIRTHDAY GREETING
          =====================================================================
        */}
        {scene === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-20 flex flex-col items-center justify-center text-center p-6 w-full min-h-screen text-black"
          >
            {/* Scrapbook Stickers Placed Precisely */}
            <motion.img
              src="/scrapbook/decoration1.webp"
              alt="Decor"
              className="absolute -bottom-6 left-0 w-48 sm:w-72 md:w-[24rem] z-10 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: -50, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2 }}
            />
            <motion.img
              src="/scrapbook/decoration2.webp"
              alt="Decor"
              className="absolute top-0 right-0 w-48 sm:w-72 md:w-[26rem] z-10 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: 50, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2 }}
            />
            <motion.img
              src="/scrapbook/cherry.webp"
              alt="Cherry"
              className="absolute -top-4 -left-4 w-20 sm:w-32 md:w-44 z-40 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, x: -60, rotate: -30 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, type: 'spring' }}
            />
            <motion.img
              src="/scrapbook/bow.webp"
              alt="Ribbon Bow"
              className="absolute bottom-4 left-4 w-24 sm:w-36 md:w-48 z-30 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: 'spring', bounce: 0.5 }}
            />
            <motion.img
              src="/scrapbook/redflower.webp"
              alt="Red Flower"
              className="absolute -bottom-10 -right-10 w-36 sm:w-52 md:w-64 z-30 pointer-events-none drop-shadow-md"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 15 }}
              transition={{ delay: 0.6 }}
            />

            {/* Main Greeting Content */}
            <div className="relative z-30 flex flex-col items-center max-w-5xl px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-300 text-rose-800 text-sm font-cute shadow-sm"
              >
                <span>To The Prettiest Soul</span>
                <span>🧿</span>
              </motion.div>

              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-romantic leading-tight text-red-900 mb-8 drop-shadow-sm"
              >
                Happy Birthday My Sunshine
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-handwritten text-2xl sm:text-3xl md:text-4xl text-gray-800 max-w-2xl mb-10 leading-relaxed"
              >
                "Ye smile bas photo mein nahi hai... pura mood change kar dene ki capability rakhti hai." 🧿✨
              </motion.p>

              <motion.button
                onClick={() => setScene(3)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl sm:text-2xl px-12 sm:px-16 py-4 sm:py-5 shadow-2xl"
              >
                <span>KEEP GOING 🌸</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* 
          =====================================================================
          SCENE 3: THE MAGICAL WISH & COUNTDOWN
          =====================================================================
        */}
        {scene === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-20 flex flex-col items-center justify-center text-center p-6 w-full min-h-screen pt-28 pb-28 text-white"
          >
            {/* Birthday Banner Overhead */}
            <motion.img
              src="/scrapbook/bdayBanner.webp"
              alt="Birthday Banner"
              className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-[85%] sm:w-[75%] md:w-[40rem] z-20 drop-shadow-2xl"
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            />

            {/* Birthday Cake & Party Popper */}
            <div className="relative mb-8 mt-12">
              <motion.img
                src="/scrapbook/cake.webp"
                alt="Birthday Cake"
                className="w-48 sm:w-60 md:w-72 drop-shadow-2xl z-20 relative"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              />

              <motion.img
                src="/scrapbook/partyPopper.webp"
                alt="Party Popper"
                className="absolute -right-8 -top-8 w-24 sm:w-32 z-30 drop-shadow-lg"
                animate={{ rotate: [-5, 15, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="max-w-3xl px-4 z-30">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl sm:text-5xl md:text-6xl font-romantic mb-6 text-rose-300 drop-shadow-md leading-tight"
              >
                Now, close your eyes and make a wish ✨
              </motion.h2>

              <AnimatePresence>
                {wishMade ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-white max-w-xl mx-auto shadow-2xl mb-8 space-y-3"
                  >
                    <p className="font-handwritten text-2xl sm:text-3xl text-yellow-200">
                      "May all your smiles stay bright, may all your dreams come true, and may no evil eye ever touch your happiness." 🧿
                    </p>
                    <p className="font-cute text-sm tracking-wider uppercase text-pink-200">
                      Your wish is sealed with love ♡
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {!wishMade ? (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setWishMade(true)}
                  className="btn-primary text-2xl sm:text-3xl px-10 sm:px-16 py-4 sm:py-5 shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>MAKE A WISH 🕯️</span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/25"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScene(4)}
                  className="btn-primary text-xl sm:text-2xl px-12 py-4 sm:py-5 shadow-2xl"
                >
                  <span>OPEN YOUR LETTER 💌</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* 
          =====================================================================
          SCENE 4: 3D WAX SEAL ROMANTIC CRIMSON ENVELOPE
          =====================================================================
        */}
        {scene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex flex-col items-center justify-center p-6 w-full min-h-screen pt-20 pb-28 text-red-950"
          >
            <div className="flex flex-col items-center w-full max-w-6xl">
              <motion.h2
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-romantic mb-8 text-red-900 drop-shadow-sm flex items-center gap-3 text-center"
              >
                <span>For you, with all my love</span>
                <span className="text-3xl sm:text-5xl">💌 🧿</span>
              </motion.h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center w-full relative">
                {/* Left Cute Stickers */}
                <div className="hidden lg:flex flex-col gap-6 relative items-center">
                  <motion.img
                    src="/scrapbook/teddy.webp"
                    alt="Teddy Bear"
                    className="w-48 h-auto drop-shadow-2xl z-30"
                    animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.img
                    src="/scrapbook/cheers.webp"
                    alt="Cheers"
                    className="w-36 h-auto drop-shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                  <img src="/scrapbook/camera.webp" alt="Camera" className="w-28 h-auto drop-shadow-md" />
                </div>

                {/* 3D Wax Seal Crimson Envelope */}
                <div
                  className="relative group perspective-1000 cursor-pointer"
                  onClick={handleOpenEnvelope}
                >
                  {/* Envelope Base Body */}
                  <motion.div
                    className="relative w-[320px] sm:w-[420px] md:w-[480px] aspect-[4/3] rounded-xl shadow-[0_30px_70px_-15px_rgba(120,20,40,0.6)] overflow-hidden z-20 bg-gradient-to-br from-red-600 via-red-700 to-red-900 border border-red-800"
                    animate={isOpeningEnvelope ? { y: 30, scale: 0.96 } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 z-10 bg-black/10 mix-blend-overlay" />
                    {/* Fold triangle accents */}
                    <div className="absolute inset-x-0 bottom-0 top-0 border-t-[160px] sm:border-t-[210px] md:border-t-[240px] border-t-transparent border-x-[160px] sm:border-x-[210px] md:border-x-[240px] border-x-red-950/40 z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-red-900/20 z-10 border-t border-white/15" />
                  </motion.div>

                  {/* Envelope Top Flap (Flips back in 3D when opened!) */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[160px] sm:h-[210px] md:h-[240px] bg-red-600 z-30 origin-top shadow-xl"
                    initial={{ rotateX: 0 }}
                    animate={
                      isOpeningEnvelope
                        ? { rotateX: 160, zIndex: 10, backgroundColor: '#9b1c1c' }
                        : {}
                    }
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />

                  {/* Golden Wax Seal on Flap Tip */}
                  <motion.div
                    className="absolute top-[130px] sm:top-[170px] md:top-[195px] left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-28 aspect-square z-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] cursor-pointer flex items-center justify-center select-none"
                    animate={
                      isOpeningEnvelope
                        ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
                        : { scale: [1, 1.05, 1] }
                    }
                    transition={{
                      scale: isOpeningEnvelope ? { duration: 0.4 } : { duration: 2, repeat: Infinity },
                    }}
                  >
                    <img
                      src="/scrapbook/waxSeal.webp"
                      alt="Wax Seal"
                      loading="eager"
                      className="w-full h-full object-contain pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById('wax-seal-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div
                      id="wax-seal-fallback"
                      style={{ display: 'none' }}
                      className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 via-red-700 to-red-900 border-4 border-amber-300 shadow-xl items-center justify-center text-amber-100 font-romantic text-2xl"
                    >
                      🧿
                    </div>
                  </motion.div>

                  {/* Rising Letter Peek animation during opening */}
                  <AnimatePresence>
                    {isOpeningEnvelope && (
                      <motion.div
                        className="absolute inset-x-6 bottom-10 h-[220px] bg-[#fdfbf6] shadow-2xl z-[15] p-6 rounded-lg border border-pink-200 flex flex-col justify-between"
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: -130, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.9, type: 'spring', stiffness: 60 }}
                      >
                        <div className="w-full border-b border-pink-200 pb-2 flex items-center justify-between">
                          <span className="font-romantic text-sm text-red-900">My love.. 🧿</span>
                          <span className="text-xs text-rose-400">♡</span>
                        </div>
                        <div className="space-y-2 py-2">
                          <div className="w-full h-1.5 bg-pink-100 rounded-full" />
                          <div className="w-[85%] h-1.5 bg-pink-100 rounded-full" />
                          <div className="w-[92%] h-1.5 bg-pink-100 rounded-full" />
                        </div>
                        <div className="text-center">
                          <Heart className="text-red-500 fill-current animate-pulse mx-auto" size={28} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Cute Stickers */}
                <div className="hidden lg:flex flex-col gap-6 relative items-center">
                  <motion.img
                    src="/scrapbook/balloons.webp"
                    alt="Balloons"
                    className="w-48 h-auto drop-shadow-2xl z-30"
                    animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <img src="/scrapbook/gift.webp" alt="Gift" className="w-32 h-auto drop-shadow-lg" />
                  <motion.img
                    src="/scrapbook/redflower.webp"
                    alt="Flower"
                    className="w-28 h-auto drop-shadow-md"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Tap prompt */}
              <div className="mt-8 text-center">
                {!isOpeningEnvelope ? (
                  <p className="font-cute text-xl text-red-800 animate-bounce">
                    Tap the wax seal to open 👆 💌
                  </p>
                ) : (
                  <p className="font-handwritten text-3xl text-red-900 animate-pulse">
                    Opening your message with love... 💌
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 
          =====================================================================
          SCENE 5: THE HANDWRITTEN VINTAGE LOVE LETTER
          =====================================================================
        */}
        {scene === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-20 flex flex-col items-center p-4 sm:p-6 w-full min-h-screen pt-20 pb-32 text-gray-900"
          >
            <div className="relative w-full max-w-3xl">
              {/* Corner Floral & Plush Embellishments */}
              <motion.img
                src="/scrapbook/flower1.webp"
                alt="Flower"
                className="absolute -top-10 -left-8 sm:-left-12 w-36 sm:w-48 h-auto z-30 drop-shadow-lg"
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 8, scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              />
              <motion.img
                src="/scrapbook/teddy.webp"
                alt="Teddy Bear"
                className="absolute bottom-16 -right-6 sm:-right-12 w-44 sm:w-56 h-auto z-30 drop-shadow-xl"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              />

              {/* Parchment Letter Card */}
              <div
                className="w-full p-6 sm:p-12 md:p-16 relative shadow-2xl border-[8px] sm:border-[12px] border-white/40 min-h-[520px] flex flex-col rounded-3xl overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/scrapbook/cherryBg.webp)' }}
              >
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-0" />
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none z-10"
                  style={{
                    backgroundImage: 'linear-gradient(#f00 1px, transparent 1px), linear-gradient(90deg, #f00 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Letter Header */}
                <div className="relative z-30 mb-8 border-b-2 border-red-300/80 pb-3 inline-flex items-center gap-2">
                  <h3 className="font-cute italic text-3xl sm:text-4xl text-gray-900">
                    My love..
                  </h3>
                  <span className="text-2xl">🧿</span>
                </div>

                {/* Heartfelt Birthday Letter Content */}
                <div className="relative z-30 font-serif italic text-lg sm:text-2xl md:text-3xl leading-[1.7] text-gray-800 space-y-4">
                  <p>
                    Happy Birthday to the one who makes my world softer and my days brighter. Your smile brings me peace, your presence feels like home, and your happiness will always matter to me the most.
                  </p>
                  <p>
                    I may not be perfect, but I promise to choose you — on good days, hard days, and everything in between. You matter more than you know, today and always.
                  </p>
                  <p className="text-red-900 font-handwritten text-2xl sm:text-3xl pt-2">
                    Nazar na lage kabhi is noor ko... hamesha aise hi khilkhilati rehna. 🧿
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-10 sm:mt-14 text-right relative z-30">
                  <p className="font-cute italic text-xl sm:text-2xl text-red-800">
                    Forever yours,
                  </p>
                  <p className="font-romantic text-2xl sm:text-4xl text-red-900 mt-1 flex items-center justify-end gap-1.5">
                    <span>With all my heart</span>
                    <span>🧿</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Transition to Photo Gallery */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={() => setScene(6)}
              className="btn-primary mt-10 text-2xl sm:text-3xl px-10 sm:px-16 py-4 sm:py-6 shadow-2xl"
            >
              <span>📸 SEE PRECIOUS MEMORIES</span>
            </motion.button>
          </motion.div>
        )}

        {/* 
          =====================================================================
          SCENE 6: THE DREAMY SCRAPBOOK PHOTO GALLERY ("CHAPTER OF MEMORIES")
          =====================================================================
        */}
        {scene === 6 && (
          <motion.div
            key="scene-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex flex-col items-center p-4 sm:p-6 w-full min-h-screen pt-20 pb-32 text-white"
          >
            {/* Chapter Header */}
            <div className="text-center mb-6 z-30">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-blocky text-pink-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] tracking-wide">
                CHAPTER OF MEMORIES 🧿
              </h2>
              <p className="font-cute text-sm sm:text-base text-pink-200 tracking-wider uppercase mt-1">
                Ten Cherished Moments & Romantic Hinglish Shayaris
              </p>
            </div>

            {/* Scrapbook Polaroid Carousel Display */}
            <div
              className="relative w-full max-w-4xl flex flex-col items-center"
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (!touchStart) return;
                const diff = touchStart - e.changedTouches[0].clientX;
                if (diff > 50) {
                  // Next photo
                  setPhotoIndex((prev) => (prev === tenHerPhotographs.length - 1 ? 0 : prev + 1));
                } else if (diff < -50) {
                  // Previous photo
                  setPhotoIndex((prev) => (prev === 0 ? tenHerPhotographs.length - 1 : prev - 1));
                }
                setTouchStart(null);
              }}
            >
              <div className="relative w-full flex items-center justify-center min-h-[480px] sm:min-h-[580px] md:min-h-[660px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhoto.id}
                    initial={{ opacity: 0, scale: 0.9, rotate: currentPhoto.rotation * 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: currentPhoto.rotation }}
                    exit={{ opacity: 0, scale: 0.9, rotate: -currentPhoto.rotation }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative group cursor-pointer max-w-[340px] sm:max-w-[420px] md:max-w-[480px] w-full"
                    onClick={() => setSelectedPhoto(currentPhoto)}
                  >
                    {/* Pink Ribbon Bow on Top */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 w-28 h-20 pointer-events-none flex items-center justify-center">
                      <motion.img
                        src="/scrapbook/bow.webp"
                        alt="Bow"
                        className="w-20 sm:w-24 h-auto drop-shadow-lg"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                    </div>

                    {/* Note attached pill badge */}
                    {journalNotes[currentPhoto.id]?.text?.trim() && (
                      <div className="absolute top-3 right-3 z-40 px-2 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-cute flex items-center gap-1 shadow-md">
                        <Feather size={10} />
                        <span>Note</span>
                      </div>
                    )}

                    {/* Polaroid White Card Body */}
                    <div className="relative w-full aspect-[4/5] bg-[#faf8f5] p-4 sm:p-5 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-pink-100 flex flex-col justify-between">
                      {/* Photo Image Frame */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-inner group/img">
                        <img
                          src={currentPhoto.image.src}
                          alt={currentPhoto.title}
                          loading="eager"
                          decoding="async"
                          onError={(e) => {
                            if (currentPhoto.image.fallbackSrc && e.currentTarget.src !== currentPhoto.image.fallbackSrc) {
                              e.currentTarget.src = currentPhoto.image.fallbackSrc;
                            }
                          }}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                        />
                        {/* Expand hint icon */}
                        <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={14} />
                        </div>
                      </div>

                      {/* Polaroid Footer: Romantic Hinglish Line & Nazar */}
                      <div className="pt-3 pb-1 text-center flex flex-col items-center justify-center">
                        <p className="font-handwritten text-xl sm:text-2xl md:text-3xl text-gray-800 font-bold leading-snug px-2">
                          "{currentPhoto.hinglishLine}"
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs font-cute text-pink-600">
                          <span>{currentPhoto.indexFormatted}</span>
                          <span>•</span>
                          <span>{currentPhoto.title}</span>
                          <span>🧿</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Navigation Arrows */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-0 sm:-px-6 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoIndex((prev) => (prev === 0 ? tenHerPhotographs.length - 1 : prev - 1));
                    }}
                    aria-label="Previous Memory"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center hover:bg-white/50 active:scale-95 pointer-events-auto transition-all shadow-lg"
                  >
                    <ChevronLeft size={32} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoIndex((prev) => (prev === tenHerPhotographs.length - 1 ? 0 : prev + 1));
                    }}
                    aria-label="Next Memory"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center hover:bg-white/50 active:scale-95 pointer-events-auto transition-all shadow-lg"
                  >
                    <ChevronRight size={32} />
                  </button>
                </div>
              </div>

              {/* Carousel Dot Indicators */}
              <div className="flex items-center gap-2 mt-6 z-40">
                {tenHerPhotographs.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setPhotoIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      photoIndex === idx
                        ? 'bg-pink-400 w-8 scale-110 shadow-md'
                        : 'bg-white/40 w-2.5 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              {/* Quick Note Attachment Pill */}
              <div className="mt-4 z-40">
                <button
                  onClick={() => setIsJournalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-xs font-cute text-pink-100 shadow-sm transition-all"
                >
                  <Feather size={13} className="text-pink-300" />
                  {journalNotes[currentPhoto.id]?.text?.trim() ? (
                    <span className="truncate max-w-[200px]">
                      "{journalNotes[currentPhoto.id].text}"
                    </span>
                  ) : (
                    <span>Attach Private Note 📝</span>
                  )}
                </button>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-10 z-40">
                <button
                  onClick={() => {
                    setScene(1);
                    setPhotoIndex(0);
                  }}
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-base sm:text-xl px-8 py-3.5 rounded-full backdrop-blur-md text-white font-cute transition-all active:scale-95"
                >
                  <RotateCcw size={18} />
                  <span>START OVER 🔄</span>
                </button>

                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="inline-flex items-center gap-2 btn-primary text-base sm:text-xl px-8 py-3.5"
                >
                  <MessageSquareHeart size={18} />
                  <span>Leave Love Note ✨</span>
                </button>

                <button
                  onClick={onLock}
                  className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 border border-white/20 text-sm sm:text-base px-6 py-3 rounded-full text-gray-300 font-cute transition-all"
                >
                  <Lock size={15} />
                  <span>Lock 🔒</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        =======================================================================
        FULLSCREEN PHOTO LIGHTBOX MODAL
        =======================================================================
      */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 select-none"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all z-10"
              aria-label="Close photo"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#fdfbf6] p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-pink-200 text-gray-900"
            >
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={selectedPhoto.image.src}
                  alt={selectedPhoto.title}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    if (selectedPhoto.image.fallbackSrc && e.currentTarget.src !== selectedPhoto.image.fallbackSrc) {
                      e.currentTarget.src = selectedPhoto.image.fallbackSrc;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center pt-4 space-y-1.5">
                <p className="font-handwritten text-2xl sm:text-3xl text-gray-900 font-bold leading-snug">
                  "{selectedPhoto.hinglishLine}"
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-cute text-pink-600">
                  <span>{selectedPhoto.indexFormatted}</span>
                  <span>•</span>
                  <span>{selectedPhoto.title}</span>
                  <span>🧿</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        =======================================================================
        FEEDBACK / LOVE NOTE MODAL
        =======================================================================
      */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <FeedbackPage
            onBack={() => setIsFeedbackOpen(false)}
            onReplay={() => {
              setIsFeedbackOpen(false);
              setScene(1);
              setPhotoIndex(0);
            }}
            onLock={onLock}
          />
        </div>
      )}

      {/* 
        =======================================================================
        PRIVATE MEMORY JOURNAL DRAWER
        =======================================================================
      */}
      <MemoryJournalDrawer
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        activeSlideIndex={photoIndex}
        onSelectSlide={(idx) => setPhotoIndex(idx)}
        notes={journalNotes}
        onSaveNote={handleSaveJournalNote}
        onDeleteNote={handleDeleteJournalNote}
      />

      {/* Hidden browser DOM cache warmer for all 10 precious memories */}
      <div className="hidden pointer-events-none opacity-0 fixed -top-96 left-0" aria-hidden="true">
        {tenHerPhotographs.map((p) => (
          <img key={p.id} src={p.image.src} alt="" loading="eager" decoding="async" />
        ))}
      </div>
    </div>
  );
};
