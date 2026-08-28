import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Delete, ArrowLeft } from 'lucide-react';
import { verifyPasscode, EXPERIENCE_CONFIG } from '../config/experienceConfig';
import { PasswordType } from '../types';

interface PasswordGateProps {
  onSuccess: (type: PasswordType) => void;
  onBack: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onSuccess, onBack }) => {
  const [digits, setDigits] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleDigitPress = useCallback((digit: string) => {
    if (isVerifying) return;
    if (digits.length >= 8) return; // Prevent excessive inputs

    setIsError(false);
    const newDigits = digits + digit;
    setDigits(newDigits);

    // Auto-check when reaching possible lengths (4 digits or 6 digits)
    if (newDigits.length === 4 || newDigits.length === 6) {
      const result = verifyPasscode(newDigits);
      if (result === 'special' || result === 'simple') {
        setIsVerifying(true);
        setTimeout(() => {
          onSuccess(result);
        }, 500);
        return;
      }
    }

    // If max length 6 entered and neither matches, check and trigger subtle error
    if (newDigits.length >= 6) {
      const result = verifyPasscode(newDigits);
      if (result === 'invalid') {
        setIsVerifying(true);
        setTimeout(() => {
          setIsError(true);
          setIsVerifying(false);
          // Gently reset after subtle error
          setTimeout(() => {
            setDigits('');
            setIsError(false);
          }, 900);
        }, 300);
      }
    }
  }, [digits, isVerifying, onSuccess]);

  const handleDelete = useCallback(() => {
    if (isVerifying) return;
    setIsError(false);
    setDigits((prev) => prev.slice(0, -1));
  }, [isVerifying]);

  const handleClear = useCallback(() => {
    if (isVerifying) return;
    setIsError(false);
    setDigits('');
  }, [isVerifying]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitPress, handleDelete, handleClear]);

  // Keypad rows
  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
  ];

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between py-8 px-6 text-center select-none">
      {/* Top Header / Back Action */}
      <div className="w-full max-w-[390px] flex items-center justify-between">
        <button
          id="password-back-button"
          onClick={onBack}
          aria-label="Back to entrance"
          className="p-2.5 -ml-2 rounded-full text-[#8c8175] hover:text-[#d6ccc0] transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-sans-clean tracking-[0.2em] uppercase text-[#61574e]">
          Private Access
        </span>
        <div className="w-9" />
      </div>

      {/* Center Input and Atmosphere */}
      <div className="w-full max-w-[340px] flex flex-col items-center space-y-8 my-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-2"
        >
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#e8e2d7] font-light tracking-wide">
            {EXPERIENCE_CONFIG.password.heading}
          </h2>
          <div className="h-4 flex items-center justify-center">
            {isError ? (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-[#d9a5a0] tracking-wider font-light"
              >
                Code not recognized
              </motion.span>
            ) : isVerifying ? (
              <span className="text-xs text-[#d4af78] tracking-widest uppercase font-light animate-pulse">
                Verifying...
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* Dynamic Passcode Dot Indicator */}
        <motion.div
          animate={isError ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 py-2"
        >
          {Array.from({ length: 6 }).map((_, idx) => {
            const hasValue = idx < digits.length;
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: hasValue ? [1, 1.25, 1] : 1,
                  backgroundColor: hasValue
                    ? isError
                      ? '#d9a5a0'
                      : '#f8c8d8'
                    : 'transparent',
                }}
                transition={{ duration: 0.2 }}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  hasValue
                    ? 'border-[#f8c8d8] shadow-[0_0_10px_rgba(248,200,216,0.45)]'
                    : 'border-[#2d1f27] bg-transparent'
                }`}
              />
            );
          })}
        </motion.div>

        {/* Custom Mobile Keypad */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full grid grid-cols-3 gap-3.5 pt-4"
        >
          {keypadButtons.map((row, rIdx) =>
            row.map((btn, cIdx) => {
              if (btn === 'backspace') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    id="keypad-backspace"
                    onClick={handleDelete}
                    disabled={isVerifying || digits.length === 0}
                    aria-label="Delete character"
                    className="h-16 rounded-2xl flex items-center justify-center text-[#998d80] hover:text-[#d6ccc0] active:bg-[#1f1a17] transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                );
              }

              if (btn === 'clear') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    id="keypad-clear"
                    onClick={handleClear}
                    disabled={isVerifying || digits.length === 0}
                    className="h-16 rounded-2xl flex items-center justify-center text-[11px] uppercase tracking-wider text-[#8a7e72] hover:text-[#c4b8aa] active:bg-[#1f1a17] transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                  >
                    Clear
                  </button>
                );
              }

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  id={`keypad-digit-${btn}`}
                  onClick={() => handleDigitPress(btn)}
                  disabled={isVerifying}
                  className="group relative h-16 rounded-2xl bg-[#12100f]/60 hover:bg-[#1a1715] active:bg-[#26201c] border border-[#231e1a] hover:border-[#3d332c] flex items-center justify-center text-xl font-light text-[#ded6ca] hover:text-[#f7f2eb] transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <span className="font-serif-luxury text-2xl font-light tracking-wide">
                    {btn}
                  </span>
                </button>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Bottom Subtle Note */}
      <div className="w-full max-w-[390px] pt-4 text-center">
        <p className="text-[11px] text-[#4d443c] tracking-widest font-light">
          A personal tribute
        </p>
      </div>
    </div>
  );
};
