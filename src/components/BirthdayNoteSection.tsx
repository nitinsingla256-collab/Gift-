import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { birthdayLetter } from '../data/memoryGalleryData';

export const BirthdayNoteSection: React.FC = () => {
  return (
    <section id="note" className="w-full space-y-6 pt-4 pb-14 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center space-y-2 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#2b241e] text-[10px] uppercase tracking-[0.25em] text-[#d4af78]">
          <Heart className="w-3 h-3 text-[#d9a5a0]" />
          <span>The Birthday Letter</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f3eee5] font-normal tracking-wide">
          {birthdayLetter.title}
        </h2>
        <p className="font-serif-luxury italic text-xs sm:text-sm text-[#9e9285] font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          {birthdayLetter.subtitle}
        </p>
      </div>

      {/* ONE Large, Beautifully Designed Private Letter Card */}
      <motion.article
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        id="birthday-letter-card"
        className="relative w-full rounded-3xl bg-gradient-to-b from-[#120f0e] via-[#0f0d0c] to-[#0c0a09] border border-[#2a221b] p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80 overflow-hidden"
      >
        {/* Subtle Warm Amber Glow in the Corner */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4af78]/[0.035] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#d9a5a0]/[0.025] rounded-full blur-3xl pointer-events-none" />

        {/* Letter Header / Seal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#211a15]">
          <span className="text-[9.5px] font-sans-clean tracking-[0.28em] uppercase text-[#73665a]">
            For Your Eyes Only
          </span>
          <div className="flex items-center gap-1 text-[#d4af78]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Salutation */}
        <motion.h3 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-serif-luxury text-xl sm:text-2xl text-[#f0e9df] font-normal tracking-wide italic"
        >
          {birthdayLetter.salutation}
        </motion.h3>

        {/* Cinematic Paragraphs with Elegant Spacing */}
        <div className="space-y-4 font-serif-luxury text-[15px] sm:text-base text-[#b8ad9f] leading-[1.8] font-light">
          {birthdayLetter.paragraphs.map((para, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: 0.15 + index * 0.12, duration: 0.8, ease: 'easeOut' }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Elegant Minimal Divider */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af78]/50 to-transparent my-2" />

        {/* Signoff */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="pt-1 space-y-1"
        >
          <p className="font-sans-clean text-xs text-[#7d7165] font-light">
            {birthdayLetter.signoff}
          </p>
          <p className="font-serif-luxury text-xl text-[#f3eee5] font-normal tracking-wide">
            {birthdayLetter.signature}
          </p>
        </motion.div>
      </motion.article>
    </section>
  );
};
