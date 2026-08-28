import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, Heart } from 'lucide-react';
import { MemoryImage } from '../types';
import { littleMomentsImages, littleNote } from '../data/memoryGalleryData';

interface LittleMomentsExperienceProps {
  onSelectImage: (index: number) => void;
}

export const LittleMomentsExperience: React.FC<LittleMomentsExperienceProps> = ({
  onSelectImage,
}) => {
  return (
    <section id="little-moments-section" className="w-full space-y-10 pt-2 pb-12">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-2 px-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#26201b] text-[10px] uppercase tracking-[0.25em] text-[#d4af78]">
          <Sparkles className="w-3 h-3 text-[#d4af78]" />
          <span>Everyday Memories</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f5efe6] font-normal tracking-wide">
          Little Moments
        </h2>
        <p className="font-serif-luxury italic text-xs sm:text-sm text-[#a39789] font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          The little things I never want to forget.
        </p>
      </motion.div>

      {/* Realistic Photographic Prints Grid (Warm matte border, real snapshot aesthetic) */}
      <div className="w-full space-y-5 px-1 sm:px-0">
        {/* Top featured snapshot */}
        {littleMomentsImages.slice(0, 1).map((image, index) => (
          <motion.div
            key={image.id}
            layoutId={`moment-${image.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.7 }}
            onClick={() => onSelectImage(index)}
            className="group cursor-pointer relative w-full rounded-2xl p-2.5 bg-[#120f0e] border border-[#2b231d] hover:border-[#4d3e33] transition-all duration-400 shadow-xl shadow-black/60 active:scale-[0.99]"
          >
            {/* Photographic Print Matte */}
            <div className="relative w-full aspect-[16/11] overflow-hidden rounded-xl bg-[#090807]">
              <img
                src={image.src}
                alt={image.title || 'Little moment photograph'}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Top Index & Zoom Icon */}
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#0c0a09]/80 backdrop-blur-md border border-[#2c241e] flex items-center justify-center text-[#d4af78] group-hover:border-[#d4af78]/60 transition-colors">
                <Maximize2 className="w-3 h-3" />
              </div>
            </div>

            {/* Bottom Photo Caption */}
            <div className="pt-3 pb-1 px-1 flex items-baseline justify-between gap-2">
              <div>
                <h3 className="font-serif-luxury text-base text-[#ded6ca] font-normal group-hover:text-white transition-colors">
                  {image.title}
                </h3>
                {image.caption && (
                  <p className="font-sans-clean text-xs text-[#8c8073] font-light mt-0.5">
                    {image.caption}
                  </p>
                )}
              </div>
              {image.date && (
                <span className="text-[10px] text-[#63574c] font-light flex-shrink-0">
                  {image.date}
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {/* 2x2 Snapshot Grid for remaining 4 photos */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {littleMomentsImages.slice(1).map((image, index) => {
            const actualIndex = index + 1;
            return (
              <motion.div
                key={image.id}
                layoutId={`moment-${image.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                onClick={() => onSelectImage(actualIndex)}
                className="group cursor-pointer relative flex flex-col rounded-xl p-2 bg-[#110f0e] border border-[#241e19] hover:border-[#42352b] transition-all duration-300 shadow-lg shadow-black/40 active:scale-98"
              >
                {/* Photo Window */}
                <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-[#090807]">
                  <img
                    src={image.src}
                    alt={image.title || 'Little moment'}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Tap Zoom Pill */}
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#0c0a09]/75 backdrop-blur-md border border-[#241e19] flex items-center justify-center text-[#d9a5a0] opacity-80 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Minimal Photo Label */}
                <div className="pt-2 pb-0.5 px-0.5 space-y-0.5">
                  <h3 className="font-serif-luxury text-xs sm:text-sm text-[#ded7cb] font-normal line-clamp-1 group-hover:text-white transition-colors">
                    {image.title}
                  </h3>
                  {image.caption && (
                    <p className="font-sans-clean text-[10.5px] text-[#786c61] line-clamp-1 font-light">
                      {image.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ONE Special Note: A Little Note (Heartfelt Birthday Message) */}
      <div id="little-note-anchor" className="pt-6">
        <motion.article
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl bg-gradient-to-b from-[#13100e] via-[#0f0d0c] to-[#0c0a09] border border-[#2b231c] p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80 overflow-hidden"
        >
          {/* Gentle ambient light leak */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4af78]/[0.03] rounded-full blur-3xl pointer-events-none" />

          {/* Letter Seal / Stamp */}
          <div className="flex items-center justify-between pb-3 border-b border-[#211a15]">
            <span className="text-[9.5px] font-sans-clean tracking-[0.28em] uppercase text-[#73675c]">
              Private Note
            </span>
            <div className="flex items-center gap-1 text-[#d4af78]">
              <Heart className="w-3.5 h-3.5 text-[#d9a5a0]" />
            </div>
          </div>

          {/* Title & Salutation */}
          <div className="space-y-2">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#f3eee5] font-normal tracking-wide">
              {littleNote.title}
            </h3>
            <p className="font-serif-luxury text-base sm:text-lg text-[#e6decfa] italic text-[#d4c9ba]">
              {littleNote.salutation}
            </p>
          </div>

          {/* Cinematic Paragraphs with Comfortable Reading Space */}
          <div className="space-y-3.5 font-serif-luxury text-[14.5px] sm:text-base text-[#b8ada0] leading-[1.8] font-light">
            {littleNote.paragraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          {/* Minimal Accent Divider */}
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af78]/50 to-transparent my-2" />

          {/* Signoff */}
          <div className="pt-1 space-y-1">
            <p className="font-sans-clean text-xs text-[#7a6e63] font-light">
              {littleNote.signoff}
            </p>
            <p className="font-serif-luxury text-xl text-[#f5efe6] font-normal tracking-wide">
              {littleNote.signature}
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
};
