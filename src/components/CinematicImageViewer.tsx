import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { MemoryImage } from '../types';

interface CinematicImageViewerProps {
  images: MemoryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  layoutPrefix?: string;
}

export const CinematicImageViewer: React.FC<CinematicImageViewerProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  layoutPrefix = 'photo',
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const currentImage = images[currentIndex];

  // Reset zoom on index change
  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    const newIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIdx);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    const newIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Mobile swipe gestures
  useEffect(() => {
    if (!isOpen || isZoomed) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isZoomed, handleNext, handlePrev]);

  if (!isOpen || !currentImage) return null;

  const formattedCounter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;

  return (
    <AnimatePresence>
      <div 
        id="cinematic-viewer-root"
        onClick={onClose}
        className="fixed inset-0 z-50 flex flex-col justify-between items-center p-3 sm:p-6 overflow-hidden select-none"
      >
        {/* Layer 1: Darkening backdrop with subtle blur and film grain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-[#040303]/94 backdrop-blur-xl pointer-events-none"
        />

        {/* Top Control Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg flex items-center justify-between z-20 pt-2 px-1"
        >
          {/* Photograph Counter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans-clean tracking-[0.25em] uppercase text-[#c4b9aa] bg-[#12100f]/90 px-3 py-1 rounded-full border border-[#2b241e]">
              {formattedCounter}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label="Toggle zoom"
              className="w-9 h-9 rounded-full bg-[#161311]/85 border border-[#2b231d] hover:border-[#4f4134] flex items-center justify-center text-[#c2b7a9] hover:text-white transition-all active:scale-95 shadow-md"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              id="cinematic-viewer-close-btn"
              onClick={onClose}
              aria-label="Close photograph"
              className="w-9 h-9 rounded-full bg-[#161311]/85 border border-[#2b231d] hover:border-[#4f4134] flex items-center justify-center text-[#c2b7a9] hover:text-white transition-all active:scale-95 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Center: Main Image Lift Stage */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg flex-1 flex items-center justify-center my-auto py-2 z-10"
        >
          {/* Previous Arrow */}
          {images.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              id="viewer-prev-btn"
              onClick={handlePrev}
              aria-label="Previous photograph"
              className="absolute left-1 z-30 w-11 h-11 rounded-full bg-[#14110f]/90 backdrop-blur-md border border-[#2b241e] hover:border-[#524437] flex items-center justify-center text-[#c4b9ab] hover:text-white transition-all active:scale-90 shadow-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {/* Photograph Mount Frame (Realistic Photographic Print Presentation) */}
          <motion.div
            layoutId={`${layoutPrefix}-${currentImage.id}`}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }}
            onClick={() => setIsZoomed(!isZoomed)}
            className="relative max-h-[66vh] w-full flex items-center justify-center overflow-hidden rounded-2xl p-1.5 sm:p-2 bg-[#120f0e] border border-[#2c241e] shadow-2xl shadow-black cursor-zoom-in"
          >
            {/* Photographic Inner Border */}
            <div className="relative w-full h-full max-h-[64vh] flex items-center justify-center overflow-hidden rounded-xl bg-[#090807]">
              <motion.img
                key={currentImage.id}
                src={currentImage.src}
                alt={currentImage.title || 'Photograph'}
                initial={{ opacity: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isZoomed ? 1.35 : 1,
                  transition: { duration: 0.3 }
                }}
                className="max-h-[64vh] w-full object-contain pointer-events-none select-none transition-transform duration-300"
              />
            </div>
          </motion.div>

          {/* Next Arrow */}
          {images.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              id="viewer-next-btn"
              onClick={handleNext}
              aria-label="Next photograph"
              className="absolute right-1 z-30 w-11 h-11 rounded-full bg-[#14110f]/90 backdrop-blur-md border border-[#2b241e] hover:border-[#524437] flex items-center justify-center text-[#c4b9ab] hover:text-white transition-all active:scale-90 shadow-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Bottom Minimal Photograph Title / Caption */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg text-center space-y-1 pb-3 pt-1 px-4 z-20"
        >
          {currentImage.title && (
            <h3 className="font-serif-luxury text-lg sm:text-xl text-[#f3eee5] font-normal tracking-wide">
              {currentImage.title}
            </h3>
          )}

          {currentImage.caption && (
            <p className="font-sans-clean text-xs text-[#a3978a] font-light leading-relaxed max-w-md mx-auto line-clamp-2">
              {currentImage.caption}
            </p>
          )}

          {currentImage.date && (
            <span className="text-[10px] text-[#695d52] font-light uppercase tracking-widest block pt-0.5">
              {currentImage.date}
            </span>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
