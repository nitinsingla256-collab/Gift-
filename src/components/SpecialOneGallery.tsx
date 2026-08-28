import React from 'react';
import { motion } from 'motion/react';
import { Maximize2, Sparkles } from 'lucide-react';
import { MemoryImage } from '../types';

interface SpecialOneGalleryProps {
  images: MemoryImage[];
  onSelectImage: (index: number) => void;
}

export const SpecialOneGallery: React.FC<SpecialOneGalleryProps> = ({
  images,
  onSelectImage,
}) => {
  return (
    <section id="special-one" className="w-full space-y-6 pt-2 pb-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center space-y-2 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#2b241e] text-[10px] uppercase tracking-[0.25em] text-[#d4af78]">
          <Sparkles className="w-3 h-3 text-[#d4af78]" />
          <span>Cinematic Gallery</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f3eee5] font-normal tracking-wide">
          Special One
        </h2>
        <p className="font-serif-luxury italic text-xs sm:text-sm text-[#9e9285] font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          For the person who makes ordinary moments feel special.
        </p>
      </div>

      {/* Large Exhibition Cards */}
      <div className="w-full space-y-5 sm:space-y-6 px-1 sm:px-0">
        {images.map((image, index) => {
          const formattedIndex = String(index + 1).padStart(2, '0');
          const totalFormatted = String(images.length).padStart(2, '0');

          return (
            <motion.article
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              id={`special-card-${image.id}`}
              onClick={() => onSelectImage(index)}
              className="group cursor-pointer relative w-full rounded-2xl bg-[#0f0d0c]/85 border border-[#241e1a] hover:border-[#4a3d32] transition-all duration-400 overflow-hidden shadow-xl shadow-black/50 active:scale-[0.99]"
            >
              {/* Photo Frame */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#090807]">
                <img
                  src={image.src}
                  alt={image.title || `Special photo ${formattedIndex}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0c] via-transparent to-[#0f0d0c]/30 opacity-75 pointer-events-none" />

                {/* Top Corner Index Badge & Zoom Pill */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-sans-clean tracking-[0.2em] uppercase text-[#ded7cb] bg-[#0c0a09]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#29221c]">
                    {formattedIndex} / {totalFormatted}
                  </span>

                  <div className="w-7 h-7 rounded-full bg-[#0c0a09]/80 backdrop-blur-md border border-[#29221c] flex items-center justify-center text-[#d4af78] group-hover:border-[#d4af78]/60 transition-colors">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>

                {/* Direct Image Bottom Overlay for Visual Prominence */}
                <div className="absolute bottom-0 inset-x-0 p-4 space-y-1 bg-gradient-to-t from-[#0f0d0c] via-[#0f0d0c]/85 to-transparent">
                  <div className="flex items-baseline justify-between gap-2">
                    {image.title && (
                      <h3 className="font-serif-luxury text-lg sm:text-xl text-[#f3eee5] font-normal tracking-wide group-hover:text-white transition-colors">
                        {image.title}
                      </h3>
                    )}
                    {image.date && (
                      <span className="text-[10.5px] text-[#7d7062] font-light">
                        {image.date}
                      </span>
                    )}
                  </div>
                  {image.caption && (
                    <p className="font-sans-clean text-xs text-[#a3978a] font-light leading-relaxed line-clamp-2">
                      {image.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
