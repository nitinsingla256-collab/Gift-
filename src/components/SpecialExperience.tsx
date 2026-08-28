import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Sparkles, Image as ImageIcon, BookOpen, HeartHandshake, Film } from 'lucide-react';
import { UPCOMING_CHAPTERS } from '../config/experienceConfig';
import { MemoryChapterFoundation } from '../types';

interface SpecialExperienceProps {
  onLock: () => void;
}

export const SpecialExperience: React.FC<SpecialExperienceProps> = ({ onLock }) => {
  const [selectedChapter, setSelectedChapter] = useState<MemoryChapterFoundation | null>(null);
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleScreenTouch = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Interactive subtle light spark
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (clientX && clientY) {
      const newSpark = { id: Date.now() + Math.random(), x: clientX, y: clientY };
      setSparks((prev) => [...prev.slice(-6), newSpark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 1500);
    }
  };

  return (
    <div 
      onClick={handleScreenTouch}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between py-8 px-6 text-[#e6e0d4] select-none"
    >
      {/* Interactive Touch Light Sparks */}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 2.5, 3.5], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="fixed pointer-events-none z-50 w-8 h-8 -ml-4 -mt-4 rounded-full blur-sm"
          style={{
            left: spark.x,
            top: spark.y,
            background: 'radial-gradient(circle, rgba(230,202,156,0.9) 0%, rgba(217,165,160,0.4) 50%, transparent 100%)',
          }}
        />
      ))}

      {/* Top Bar Navigation / Lock */}
      <div className="w-full max-w-[390px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af78]" />
          <span className="text-[11px] font-sans-clean tracking-[0.25em] uppercase text-[#a3978a]">
            Special Edition
          </span>
        </div>
        <button
          id="special-lock-btn"
          onClick={onLock}
          aria-label="Lock experience"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#141211]/70 border border-[#26201b] hover:border-[#40352c] text-[11px] text-[#8c8073] hover:text-[#d4c8ba] transition-all duration-300 active:scale-95"
        >
          <Lock className="w-3 h-3" />
          <span>Lock</span>
        </button>
      </div>

      {/* Main Sanctuary Container */}
      <div className="w-full max-w-[390px] flex flex-col items-center space-y-8 my-auto py-6">
        {/* Soft Prologue Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center space-y-3"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4af78]/80 font-light">
            Chapter Foundation
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#f0ebe1] tracking-wide">
            A Sanctuary of Moments
          </h1>
          <p className="font-sans-clean text-xs text-[#8f8376] font-light leading-relaxed max-w-[320px] mx-auto">
            The foundation is laid. Every chapter below is architected to hold real frames, sounds, and memories.
          </p>
        </motion.div>

        {/* Ambient Chapter Cards Architecture Grid */}
        <div className="w-full space-y-3">
          {UPCOMING_CHAPTERS.map((chap, idx) => (
            <motion.div
              key={chap.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
            >
              <button
                id={`chapter-card-${chap.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedChapter(chap);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${
                  chap.status === 'unlocked'
                    ? 'bg-[#12100f]/80 border-[#2f2721] hover:border-[#524438] active:bg-[#1a1614]'
                    : 'bg-[#0d0b0a]/60 border-[#1c1815] hover:border-[#2b241f] active:bg-[#141210]'
                }`}
              >
                {/* Subtle soft gradient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af78]/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-[#d4af78]/[0.05] transition-all" />

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-serif-luxury tracking-widest text-[#d4af78]">
                        Chapter {chap.number}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1c1815] text-[#807469] font-light">
                        {chap.photoCountTeaser} Photo Slots
                      </span>
                    </div>
                    <h2 className="font-serif-luxury text-lg text-[#e6dfd3] font-normal tracking-wide group-hover:text-[#faf6ee] transition-colors">
                      {chap.title}
                    </h2>
                    <p className="text-[11px] text-[#786c60] font-light leading-snug">
                      {chap.subtitle}
                    </p>
                  </div>

                  <div className="pt-1 flex-shrink-0">
                    {chap.status === 'unlocked' ? (
                      <div className="w-7 h-7 rounded-full bg-[#1a1715] flex items-center justify-center border border-[#382f27] text-[#d4af78] group-hover:border-[#d4af78]/60 transition-colors">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#12100f] flex items-center justify-center border border-[#211b17] text-[#544b43]">
                        <Film className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Cinematic Milestone Capabilities Architecture Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="w-full p-4 rounded-2xl bg-[#0e0c0b]/70 border border-[#211b17] flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#171412] border border-[#2b241e] flex items-center justify-center text-[#d4af78]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#ded7cc] font-medium">
                Part 1 Foundation Active
              </p>
              <p className="text-[10px] text-[#73675c] font-light">
                Ready for high-density photos & timelines
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#d4af78]">
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-serif-luxury">600+ Ready</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Atmosphere Footer */}
      <div className="w-full max-w-[390px] pt-4 text-center">
        <p className="text-[10px] text-[#4d443c] tracking-widest font-light">
          Tap anywhere to spark light
        </p>
      </div>

      {/* Chapter Detail Sheet / Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChapter(null);
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] p-6 rounded-3xl bg-[#110f0e] border border-[#2b241f] text-[#e6e0d4] space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-serif-luxury text-[#d4af78]">
                    Chapter {selectedChapter.number} Blueprint
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#f5f0e6] mt-1 font-light">
                    {selectedChapter.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="text-xs text-[#73685e] hover:text-[#b3a596] p-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#171413] border border-[#241e1a] space-y-2">
                <p className="text-xs text-[#b8ad9f] font-light leading-relaxed italic">
                  "{selectedChapter.previewNote}"
                </p>
                <div className="pt-2 flex items-center justify-between text-[10.5px] text-[#695d52] border-t border-[#211c18]">
                  <span>Dedicated capacity</span>
                  <span className="text-[#d4af78] font-medium">
                    {selectedChapter.photoCountTeaser} personal frames
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#8c8073]">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#d9a5a0]" />
                  <span>Configured for upcoming personalized memories</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedChapter(null)}
                className="w-full py-3 rounded-xl bg-[#1d1916] hover:bg-[#26211d] border border-[#382f27] text-xs tracking-wider uppercase text-[#d6ccc0] transition-colors"
              >
                Close Preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
