import React from 'react';
import { motion } from 'motion/react';
import { Lock, Feather, Sparkles } from 'lucide-react';

interface SimpleExperienceProps {
  onLock: () => void;
}

export const SimpleExperience: React.FC<SimpleExperienceProps> = ({ onLock }) => {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between py-8 px-6 text-[#e6e0d4] select-none">
      {/* Top Bar Navigation / Lock */}
      <div className="w-full max-w-[390px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c8073]" />
          <span className="text-[11px] font-sans-clean tracking-[0.25em] uppercase text-[#73685e]">
            Quiet Corner
          </span>
        </div>
        <button
          id="simple-lock-btn"
          onClick={onLock}
          aria-label="Lock experience"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#12100f]/70 border border-[#211b17] hover:border-[#382f27] text-[11px] text-[#85796c] hover:text-[#d1c5b8] transition-all duration-300 active:scale-95"
        >
          <Lock className="w-3 h-3" />
          <span>Lock</span>
        </button>
      </div>

      {/* Center Whisper Card */}
      <div className="w-full max-w-[350px] flex flex-col items-center space-y-8 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-8 rounded-3xl bg-[#0f0d0c]/70 border border-[#241e1a] text-center space-y-6 relative overflow-hidden shadow-xl"
        >
          {/* Subtle icon */}
          <div className="w-10 h-10 rounded-full bg-[#171412] border border-[#2b241e] flex items-center justify-center mx-auto text-[#d4af78]/70">
            <Feather className="w-4 h-4" />
          </div>

          <div className="space-y-3">
            <h1 className="font-serif-luxury text-2xl text-[#ece6dc] font-light tracking-wide">
              A Quiet Note
            </h1>
            <p className="font-serif-luxury italic text-base text-[#a89d90] leading-relaxed">
              "Some memories are best kept quiet, simple, and close to the heart."
            </p>
          </div>

          <div className="w-6 h-[1px] bg-[#d4af78]/40 mx-auto" />

          <p className="font-sans-clean text-[11px] text-[#695f56] font-light leading-relaxed">
            This private space is preserved for you.
          </p>
        </motion.div>

        {/* Small subtle badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#544b42]"
        >
          <Sparkles className="w-3 h-3 text-[#d4af78]/50" />
          <span>Simple Access Foundation</span>
        </motion.div>
      </div>

      {/* Bottom Atmosphere Footer */}
      <div className="w-full max-w-[390px] pt-4 text-center">
        <p className="text-[10px] text-[#423b34] tracking-widest font-light">
          Encrypted & preserved
        </p>
      </div>
    </div>
  );
};
