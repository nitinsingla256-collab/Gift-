import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { MemoryImage } from '../types';

interface LightboxModalProps {
  images: MemoryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const currentImage = images[currentIndex];

  // Reset zoom when switching images
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

  // Touch swipe support for mobile
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
      if (Math.abs(diff) > 40) {
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
        id="lightbox-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#050404]/96 backdrop-blur-xl flex flex-col justify-between items-center p-3 sm:p-6 overflow-hidden select-none"
      >
        {/* Top Control Bar */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg flex items-center justify-between z-20 pt-2 px-1"
        >
          {/* Image Counter */}
          <span className="text-[10.5px] font-sans-clean tracking-[0.25em] uppercase text-[#b0a597] bg-[#141210]/90 px-3 py-1 rounded-full border border-[#2b241e]">
            {formattedCounter}
          </span>

          <div className="flex items-center gap-2">
            {/* Zoom Toggle Button */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label="Toggle zoom"
              className="w-9 h-9 rounded-full bg-[#171412]/80 border border-[#2d251f] hover:border-[#544539] flex items-center justify-center text-[#c2b7a9] hover:text-white transition-all active:scale-95"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              id="lightbox-close-btn"
              onClick={onClose}
              aria-label="Close preview"
              className="w-9 h-9 rounded-full bg-[#171412]/80 border border-[#2d251f] hover:border-[#544539] flex items-center justify-center text-[#c2b7a9] hover:text-white transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Image Stage */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg flex-1 flex items-center justify-center my-auto py-2"
        >
          {/* Previous Arrow Button */}
          {images.length > 1 && (
            <button
              id="lightbox-prev-btn"
              onClick={handlePrev}
              aria-label="Previous photograph"
              className="absolute left-1 z-30 w-10 h-10 rounded-full bg-[#141210]/80 backdrop-blur-md border border-[#2a241f] hover:border-[#524437] flex items-center justify-center text-[#c4b9ab] hover:text-white transition-all active:scale-90 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Main Image Frame with Tap-to-Zoom */}
          <div 
            onClick={() => setIsZoomed(!isZoomed)}
            className="relative max-h-[66vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-[#241e19] bg-[#0c0a09] shadow-2xl cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage.id}
                src={currentImage.src}
                alt={currentImage.title || 'Memory photo'}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ 
                  opacity: 1, 
                  scale: isZoomed ? 1.35 : 1,
                  transition: { duration: 0.35, ease: 'easeOut' }
                }}
                exit={{ opacity: 0 }}
                className="max-h-[66vh] w-full object-contain pointer-events-none select-none transition-transform duration-300"
              />
            </AnimatePresence>
          </div>

          {/* Next Arrow Button */}
          {images.length > 1 && (
            <button
              id="lightbox-next-btn"
              onClick={handleNext}
              aria-label="Next photograph"
              className="absolute right-1 z-30 w-10 h-10 rounded-full bg-[#141210]/80 backdrop-blur-md border border-[#2a241f] hover:border-[#524437] flex items-center justify-center text-[#c4b9ab] hover:text-white transition-all active:scale-90 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Minimal Info Card */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg text-center space-y-1 pb-3 pt-1 px-3"
        >
          {currentImage.title && (
            <h3 className="font-serif-luxury text-lg sm:text-xl text-[#f2ece2] font-normal tracking-wide">
              {currentImage.title}
            </h3>
          )}

          {currentImage.caption && (
            <p className="font-sans-clean text-xs text-[#9c9083] font-light leading-relaxed max-w-sm mx-auto">
              {currentImage.caption}
            </p>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
