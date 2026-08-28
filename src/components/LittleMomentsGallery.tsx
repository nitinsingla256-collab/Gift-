import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2 } from 'lucide-react';
import { MemoryImage } from '../types';

interface LittleMomentsGalleryProps {
  images: MemoryImage[];
  onSelectImage: (index: number) => void;
}

export const LittleMomentsGallery: React.FC<LittleMomentsGalleryProps> = ({
  images,
  onSelectImage,
}) => {
  return (
    <section id="little-moments" className="w-full space-y-6 pt-4 pb-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center space-y-2 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#26201b] text-[10px] uppercase tracking-[0.25em] text-[#d9a5a0]">
          <Sparkles className="w-3 h-3 text-[#d9a5a0]" />
          <span>Everyday Frames</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f3eee5] font-normal tracking-wide">
          Little Moments
        </h2>
        <p className="font-serif-luxury italic text-xs sm:text-sm text-[#9e9285] font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          Small moments. Big memories.
        </p>
      </div>

      {/* Responsive 2-Column Grid */}
      <div className="w-full grid grid-cols-2 gap-3 px-1 sm:px-0">
        {images.map((image, index) => {
          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              id={`moment-card-${image.id}`}
              onClick={() => onSelectImage(index)}
              className="group cursor-pointer relative flex flex-col rounded-xl sm:rounded-2xl bg-[#0e0c0b]/80 border border-[#211b17] hover:border-[#3d3228] transition-all duration-300 overflow-hidden shadow-md active:scale-98"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-square overflow-hidden bg-[#090807]">
                <img
                  src={image.src}
                  alt={image.title || 'Little moment photo'}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Subtle Hover Action Pill */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0c0a09]/75 backdrop-blur-md border border-[#26201b] flex items-center justify-center text-[#d9a5a0] opacity-80 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Short Caption */}
              <div className="p-2.5 space-y-0.5">
                {image.title && (
                  <h3 className="font-serif-luxury text-sm text-[#e6dfd4] font-normal line-clamp-1 group-hover:text-white transition-colors">
                    {image.title}
                  </h3>
                )}
                {image.caption && (
                  <p className="font-sans-clean text-[11px] text-[#7a6f64] line-clamp-1 font-light">
                    {image.caption}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
