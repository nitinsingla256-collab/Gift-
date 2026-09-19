import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Delete, ArrowLeft, Lock, Sparkles, Heart, Volume2, VolumeX } from 'lucide-react';
import { verifyPasscode } from '../config/experienceConfig';
import { soundscapeEngine } from '../utils/audioEngine';
import { PasswordType } from '../types';

interface PasswordGateProps {
  onSuccess: (type: PasswordType) => void;
  onBack: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onSuccess, onBack }) => {
  const [digits, setDigits] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => soundscapeEngine.getIsPlaying());

  // Listen to audio engine
  useEffect(() => {
    const unsubscribe = soundscapeEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleDigitPress = useCallback((digit: string) => {
    if (isVerifying) return;
    if (digits.length >= 8) return;

    // Trigger audio on user touch/click if not playing yet
    if (!soundscapeEngine.getIsPlaying()) {
      soundscapeEngine.play().catch(() => {});
    }

    setIsError(false);
    const newDigits = digits + digit;
    setDigits(newDigits);

    // Auto-check when reaching 4 or 6 digits
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

    // If 6 digits reached and not valid
    if (newDigits.length >= 6) {
      const result = verifyPasscode(newDigits);
      if (result === 'invalid') {
        setIsVerifying(true);
        setTimeout(() => {
          setIsError(true);
          setIsVerifying(false);
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

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
  ];

  return (
    <div
      id="dreamy-password-gate"
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between py-8 px-4 text-center select-none bg-[#fdfbf6] text-[#222222] font-poppins overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      {/* Soft background stickers */}
      <img
        src="/scrapbook/decoration.webp"
        alt="Decor"
        className="absolute -top-10 -left-10 w-48 sm:w-72 pointer-events-none opacity-80 drop-shadow-sm"
      />
      <img
        src="/scrapbook/tulip.webp"
        alt="Tulip"
        className="absolute -bottom-10 -right-10 w-48 sm:w-64 pointer-events-none opacity-80 drop-shadow-sm"
      />

      {/* Top Header / Back Action & Music Toggle */}
      <div className="w-full max-w-sm flex items-center justify-between z-20">
        <button
          id="password-back-button"
          onClick={onBack}
          aria-label="Back to entrance"
          className="p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-600 transition-all border border-pink-100 shadow-sm active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-cute tracking-widest uppercase text-pink-700 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200 shadow-sm flex items-center gap-1.5">
          <span>Private Memory</span>
          <span>🧿</span>
        </span>

        {/* Music button */}
        <button
          onClick={() => soundscapeEngine.toggle()}
          className={`p-2 rounded-full border transition-all shadow-sm active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 text-white border-rose-400'
              : 'bg-white/80 text-gray-600 border-gray-200'
          }`}
          title={isPlaying ? 'Pause Preet Re' : 'Play Preet Re'}
        >
          {isPlaying ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Center Dreamy Card with Keypad */}
      <div className="w-full max-w-[360px] flex flex-col items-center my-auto z-20 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-pink-200/80 shadow-[0_20px_50px_-15px_rgba(255,100,140,0.15)]">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-2 mb-6"
        >
          <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-5 h-5" />
          </div>

          <h2 className="font-romantic text-3xl sm:text-4xl text-red-900 leading-tight">
            Enter The Secret Code 🧿
          </h2>
          <p className="font-cute text-xs text-gray-500">
            A little memory made just for you
          </p>

          <div className="h-5 flex items-center justify-center pt-1">
            {isError ? (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600 font-cute"
              >
                Code not recognized, try again 🥺
              </motion.span>
            ) : isVerifying ? (
              <span className="text-xs text-pink-600 font-cute animate-pulse">
                Unlocking memories... ✨
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* Passcode Dot Indicators */}
        <div className="flex justify-center items-center gap-3.5 mb-8">
          {[...Array(6)].map((_, i) => {
            const isFilled = i < digits.length;
            return (
              <motion.div
                key={i}
                animate={
                  isError
                    ? { x: [-8, 8, -6, 6, 0] }
                    : isFilled
                    ? { scale: [0.8, 1.25, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.2 }}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isError
                    ? 'bg-red-400 shadow-sm'
                    : isFilled
                    ? 'bg-gradient-to-tr from-pink-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)] scale-110'
                    : 'bg-pink-100 border border-pink-200'
                }`}
              />
            );
          })}
        </div>

        {/* Tactile Keypad */}
        <div className="w-full grid grid-cols-3 gap-3">
          {keypadButtons.map((row, rIdx) =>
            row.map((btn, cIdx) => {
              if (btn === 'clear') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={handleClear}
                    disabled={isVerifying || digits.length === 0}
                    className="h-14 rounded-2xl text-xs font-cute uppercase tracking-wider text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                  >
                    Clear
                  </button>
                );
              }
              if (btn === 'backspace') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={handleDelete}
                    disabled={isVerifying || digits.length === 0}
                    className="h-14 rounded-2xl text-gray-500 hover:text-red-600 disabled:opacity-30 transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                );
              }
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleDigitPress(btn)}
                  disabled={isVerifying}
                  className="h-14 rounded-2xl bg-white hover:bg-pink-50 border border-pink-100/90 text-gray-800 font-cute text-2xl font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center text-center cursor-pointer"
                >
                  {btn}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="z-20 pt-4">
        <p className="text-[11px] font-cute text-gray-400 tracking-wider flex items-center justify-center gap-1">
          <span>Protected With Care</span>
          <span>🧿</span>
        </p>
      </div>
    </div>
  );
};
