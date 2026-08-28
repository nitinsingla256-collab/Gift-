import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, Feather, Heart } from 'lucide-react';
import { specialOneItems } from '../data/memoryGalleryData';

interface SpecialOneExperienceProps {
  onSelectImage: (index: number) => void;
}

export const SpecialOneExperience: React.FC<SpecialOneExperienceProps> = ({
  onSelectImage,
}) => {
  return (
    <section id="special-one-section" className="w-full space-y-12 pt-2 pb-16">
      {/* Section Header: Editorial & Poetic */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="text-center space-y-2.5 px-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161210] border border-[#332820] text-[10px] uppercase tracking-[0.28em] text-[#d4af78]">
          <Feather className="w-3 h-3 text-[#d4af78]" />
          <span>Cinematic Photo Journal</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7f2ea] font-normal tracking-wide">
          Special One
        </h2>
        <p className="font-serif-luxury italic text-xs sm:text-sm text-[#a89b8d] font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          For the moments, the smiles, and the person who means a little more.
        </p>
      </motion.div>

      {/* Editorial Storytelling Layout: Alternating Offset Photographs with Short Shayaris */}
      <div className="w-full space-y-12 px-1 sm:px-0">
        {specialOneItems.map((item, index) => {
          const formattedNum = String(index + 1).padStart(2, '0');
          const isOffsetLeft = item.offset === 'left';
          const isOffsetRight = item.offset === 'right';

          return (
            <div key={item.id} className="w-full space-y-8">
              {/* Asymmetrical Editorial Photograph Frame */}
              <motion.div
                layoutId={`special-${item.id}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onSelectImage(index)}
                className={`group cursor-pointer relative ${
                  isOffsetLeft
                    ? 'w-[94%] sm:w-[90%] mr-auto'
                    : isOffsetRight
                    ? 'w-[94%] sm:w-[90%] ml-auto'
                    : 'w-full'
                } rounded-3xl p-3 bg-gradient-to-b from-[#161210] via-[#100d0c] to-[#0a0807] border border-[#2b221b] hover:border-[#544336] transition-all duration-500 shadow-2xl shadow-black/70 active:scale-[0.99]`}
              >
                {/* Subtle Film Grain / Light Leak Glow */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#d4af78]/[0.03] rounded-full blur-2xl pointer-events-none" />

                {/* Photo Mount Stage */}
                <div className={`relative w-full ${
                  (item.aspectRatio as string) === 'tall' 
                    ? 'aspect-[3/4]' 
                    : (item.aspectRatio as string) === 'landscape'
                    ? 'aspect-[16/10]'
                    : 'aspect-[4/5]'
                } overflow-hidden rounded-2xl bg-[#080706]`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />

                  {/* Editorial Film-Grain Overlay Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-[#0c0a09]/20 opacity-60 pointer-events-none" />

                  {/* Header Badges: Category Pill & Expand Indicator */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[9.5px] font-sans-clean tracking-[0.2em] uppercase text-[#e6dfd3] bg-[#0c0908]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#2d231b]">
                      {item.tag} • {formattedNum}
                    </span>

                    <div className="w-7 h-7 rounded-full bg-[#0c0908]/80 backdrop-blur-md border border-[#2d231b] flex items-center justify-center text-[#d4af78] group-hover:border-[#d4af78]/60 transition-colors">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Editorial Photo Title */}
                <div className="pt-3.5 pb-1 px-2 flex items-center justify-between">
                  <h3 className="font-serif-luxury text-lg text-[#f0e9df] font-normal tracking-wide group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#736557]">
                    Tap to view
                  </span>
                </div>
              </motion.div>

              {/* Short Hindi/Hinglish Shayari Between Photos (Cinematic Breathing Moment) */}
              {item.shayariAfter && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="py-4 px-6 text-center space-y-2"
                >
                  {/* Subtle Ornament Star */}
                  <div className="flex items-center justify-center gap-2 text-[#d4af78]/40">
                    <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af78]/40" />
                    <Sparkles className="w-2.5 h-2.5 text-[#d4af78]/70" />
                    <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af78]/40" />
                  </div>

                  {/* Hindi Shayari Lines */}
                  <div className="space-y-1">
                    {item.shayariAfter.lines.map((line, lIdx) => (
                      <p
                        key={lIdx}
                        className="font-serif-luxury text-base sm:text-lg text-[#e6ded3] font-normal tracking-wide italic leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Gentle English Poetic Translation (Subtle for emotional depth) */}
                  {item.shayariAfter.englishTranslation && (
                    <p className="font-sans-clean text-[11px] text-[#807365] font-light italic max-w-xs mx-auto pt-0.5">
                      "{item.shayariAfter.englishTranslation}"
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closing Quiet Tribute Card */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full text-center py-6 border-t border-[#1f1915] space-y-1.5"
      >
        <div className="flex items-center justify-center gap-1.5 text-[#d9a5a0]">
          <Heart className="w-3.5 h-3.5 fill-[#d9a5a0]/30" />
          <span className="font-serif-luxury tracking-widest text-xs uppercase text-[#d4af78]">
            Forever Cherished
          </span>
        </div>
        <p className="text-[10px] text-[#63574c] tracking-widest uppercase font-light">
          Made with quiet devotion for your birthday
        </p>
      </motion.div>
    </section>
  );
};
