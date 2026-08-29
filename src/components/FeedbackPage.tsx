import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Sparkles,
  Send,
  CheckCircle2,
  RotateCcw,
  Lock,
  MessageSquareHeart,
  ChevronLeft,
  Copy,
  Check,
  Star
} from 'lucide-react';

interface FeedbackPageProps {
  onBack: () => void;
  onReplay: () => void;
  onLock: () => void;
}

interface SavedFeedback {
  rating: number;
  emotion: string;
  favoritePart: string;
  message: string;
  senderName: string;
  timestamp: string;
}

const EMOTION_TAGS = [
  { id: 'touched', label: 'Touched My Heart', emoji: '💖' },
  { id: 'smiled', label: 'Smiled All The Way', emoji: '🌸' },
  { id: 'tears', label: 'Emotional & Sweet', emoji: '🥺' },
  { id: 'poetry', label: 'Loved The Shayaris', emoji: '📜' },
  { id: 'unforgettable', label: 'Truly Unforgettable', emoji: '✨' },
];

const FAVORITE_PARTS = [
  'The 10 Memory Cards Gallery',
  'The Shayari Calligraphy Folio',
  'The Special Note & Final Scene',
  'The Ambient Music & Whispers',
  'Every Single Detail ✨',
];

const STORAGE_KEY = 'private_gift_memory_feedback';

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onBack, onReplay, onLock }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('Touched My Heart');
  const [favoritePart, setFavoritePart] = useState<string>('Every Single Detail ✨');
  const [message, setMessage] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<SavedFeedback | null>(null);

  // Load existing feedback from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: SavedFeedback = JSON.parse(stored);
        setSavedFeedback(parsed);
        setRating(parsed.rating || 5);
        setSelectedEmotion(parsed.emotion || 'Touched My Heart');
        setFavoritePart(parsed.favoritePart || 'Every Single Detail ✨');
        setMessage(parsed.message || '');
        setSenderName(parsed.senderName || '');
        setIsSubmitted(true);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !senderName.trim() && rating === 0) return;

    const feedbackData: SavedFeedback = {
      rating,
      emotion: selectedEmotion,
      favoritePart,
      message: message.trim(),
      senderName: senderName.trim() || 'Someone who smiled',
      timestamp: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackData));
      setSavedFeedback(feedbackData);
      setIsSubmitted(true);
    } catch {
      // LocalStorage fallback
      setIsSubmitted(true);
    }
  };

  const handleEditAgain = () => {
    setIsSubmitted(false);
  };

  const handleCopyMessage = () => {
    const feedbackToCopy = savedFeedback || {
      rating,
      emotion: selectedEmotion,
      favoritePart,
      message,
      senderName,
    };

    const textToCopy = `💌 Memory Gift Feedback:\n⭐ Rating: ${feedbackToCopy.rating}/5\n💭 Feeling: ${feedbackToCopy.emotion}\n✨ Favorite Part: ${feedbackToCopy.favoritePart}\n📝 Message: "${feedbackToCopy.message}"\n— From: ${feedbackToCopy.senderName || 'Anonymous'}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <main className="relative z-20 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex-1 flex flex-col justify-center items-center py-4 sm:py-6 my-auto px-3 sm:px-4">
      {/* Background Ambience Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#f8c8d8]/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-3xl bg-gradient-to-b from-[#191016] via-[#110a0f] to-[#080507] border border-[#3b2030] p-5 sm:p-7 md:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* Double Inset Gold Border */}
        <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#e8d5b5]/15 pointer-events-none" />

        {/* Header Badge */}
        <div className="relative z-10 flex items-center justify-between pb-3 sm:pb-4 border-b border-[#301825]">
          <div className="flex items-center gap-2 text-[#f8c8d8]">
            <MessageSquareHeart className="w-4 h-4 text-[#f8c8d8]" />
            <span className="text-[10px] sm:text-xs font-sans-clean tracking-[0.25em] uppercase text-[#a8969e]">
              Feedback & Thoughts
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#f8c8d8]">
            <span>🧿</span>
            <Heart className="w-3.5 h-3.5 text-[#f8c8d8] fill-[#f8c8d8]/30" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* =========================================================
               FEEDBACK FORM
               ========================================================= */
            <motion.form
              key="feedback-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative z-10 pt-4 sm:pt-6 space-y-5 sm:space-y-6"
            >
              {/* Form Title */}
              <div className="text-center space-y-1 sm:space-y-1.5">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#faf4ec] font-normal tracking-wide">
                  How Did It Feel?
                </h2>
                <p className="font-serif-luxury italic text-xs sm:text-sm text-[#baa6af] max-w-md mx-auto">
                  Leave a personal thought, a message, or simply how this memory journey made you feel.
                </p>
              </div>

              {/* 1. Star / Heart Rating */}
              <div className="flex flex-col items-center justify-center space-y-2 py-1">
                <span className="text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893]">
                  Your Rating
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-[#f8c8d8] transition-transform duration-200 active:scale-90 hover:scale-125 cursor-pointer"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 transition-all ${
                          (hoverRating || rating) >= star
                            ? 'text-[#f8c8d8] fill-[#f8c8d8] drop-shadow-[0_0_8px_rgba(248,200,216,0.6)]'
                            : 'text-[#422536] fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Emotional Reaction Tag Chips */}
              <div className="space-y-2">
                <label className="block text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893] text-center sm:text-left">
                  Your Immediate Feeling
                </label>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {EMOTION_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setSelectedEmotion(tag.label)}
                      className={`px-3 py-1.5 rounded-full text-xs font-sans-clean transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        selectedEmotion === tag.label
                          ? 'bg-[#2d1825] border border-[#f8c8d8]/80 text-[#faf4ec] shadow-[0_0_12px_rgba(248,200,216,0.2)] scale-[1.02]'
                          : 'bg-[#140b11] border border-[#2d1825] text-[#a6919c] hover:border-[#4d293f] hover:text-[#faf4ec]'
                      }`}
                    >
                      <span>{tag.emoji}</span>
                      <span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Favorite Part Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893] text-center sm:text-left">
                  Favorite Chapter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FAVORITE_PARTS.map((part) => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => setFavoritePart(part)}
                      className={`px-3 py-2 rounded-xl text-xs font-sans-clean text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        favoritePart === part
                          ? 'bg-[#281421] border border-[#f8c8d8]/70 text-[#faf4ec]'
                          : 'bg-[#120a0f] border border-[#24131d] text-[#9c8893] hover:border-[#381c2d] hover:text-[#d4c2cb]'
                      }`}
                    >
                      <span className="truncate pr-1">{part}</span>
                      {favoritePart === part && (
                        <Check className="w-3.5 h-3.5 text-[#f8c8d8] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Thoughts / Words Textarea */}
              <div className="space-y-2">
                <label className="block text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893] text-center sm:text-left">
                  Your Words & Reflections (Optional)
                </label>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message, a quiet reflection, or any words you wish to share..."
                    rows={4}
                    className="w-full rounded-2xl bg-[#0e070b]/90 border border-[#301927] focus:border-[#f8c8d8]/70 focus:outline-none p-3.5 sm:p-4 text-xs sm:text-sm font-serif-luxury italic text-[#faf4ec] placeholder:text-[#5e4954] placeholder:font-sans-clean placeholder:italic-none resize-none transition-all"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] text-[#634e5a] pointer-events-none">
                    {message.length} chars
                  </div>
                </div>
              </div>

              {/* 5. Sender Signature Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893] text-center sm:text-left">
                  Your Name / Signature (Optional)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Birthday Girl, or Your Name"
                  maxLength={50}
                  className="w-full rounded-xl bg-[#0e070b]/90 border border-[#301927] focus:border-[#f8c8d8]/70 focus:outline-none px-3.5 py-2.5 text-xs sm:text-sm font-sans-clean text-[#faf4ec] placeholder:text-[#5e4954] transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#2a1322] via-[#381a2f] to-[#2a1322] hover:from-[#3a1b30] hover:to-[#3a1b30] border border-[#f8c8d8]/50 text-xs sm:text-sm font-sans-clean font-medium tracking-widest uppercase text-[#f8c8d8] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(248,200,216,0.15)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#f8c8d8]" />
                  <span>Seal & Save Feedback 💌</span>
                </button>
              </div>
            </motion.form>
          ) : (
            /* =========================================================
               SUBMITTED CONFIRMATION STATE
               ========================================================= */
            <motion.div
              key="feedback-submitted"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 pt-6 pb-2 text-center space-y-6"
            >
              {/* Success Badge */}
              <div className="w-14 h-14 mx-auto rounded-full bg-[#24121e] border border-[#f8c8d8]/60 flex items-center justify-center text-[#f8c8d8] shadow-[0_0_24px_rgba(248,200,216,0.3)] animate-subtle-pulse">
                <CheckCircle2 className="w-7 h-7 text-[#f8c8d8]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#faf4ec] font-normal tracking-wide">
                  Thank You for Your Words
                </h3>
                <p className="font-serif-luxury italic text-xs sm:text-sm text-[#baa6af] max-w-md mx-auto">
                  Your message has been sealed with love. Every word means the world. 🧿✨
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl bg-[#0c0609]/80 border border-[#2b1623] p-4 sm:p-5 text-left space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#24111d] pb-2.5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          (savedFeedback?.rating || rating) >= s
                            ? 'text-[#f8c8d8] fill-[#f8c8d8]'
                            : 'text-[#381c2d]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-sans-clean tracking-wider uppercase text-[#8a7681]">
                    {savedFeedback?.timestamp}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[#a6919c] font-sans-clean">
                    <span className="text-[#705e67]">Feeling: </span>
                    <span className="text-[#f8c8d8] font-medium">{savedFeedback?.emotion || selectedEmotion}</span>
                  </div>
                  <div className="text-[#a6919c] font-sans-clean">
                    <span className="text-[#705e67]">Favorite Chapter: </span>
                    <span className="text-[#e8d5b5] font-medium">{savedFeedback?.favoritePart || favoritePart}</span>
                  </div>
                </div>

                {(savedFeedback?.message || message) && (
                  <div className="pt-2 border-t border-[#24111d]">
                    <p className="font-serif-luxury italic text-xs sm:text-sm text-[#f5ebe2] leading-relaxed">
                      "{savedFeedback?.message || message}"
                    </p>
                    <p className="text-right text-[11px] font-sans-clean text-[#998590] pt-1.5">
                      — {savedFeedback?.senderName || senderName || 'Anonymous'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-4 py-2 rounded-full bg-[#160b12] hover:bg-[#24131e] border border-[#381c2e] text-xs text-[#baa6af] hover:text-[#faf4ec] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#f8c8d8]" />
                      <span className="text-[#f8c8d8]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#baa6af]" />
                      <span>Copy Note</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleEditAgain}
                  className="px-4 py-2 rounded-full bg-[#160b12] hover:bg-[#24131e] border border-[#381c2e] text-xs text-[#baa6af] hover:text-[#faf4ec] transition-all cursor-pointer active:scale-95"
                >
                  Edit Message ✏️
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Navigation Controls */}
        <div className="relative z-10 pt-6 mt-4 border-t border-[#2d1624] flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to previous moment"
            className="px-4 py-2 rounded-full bg-[#120a0f] border border-[#291421] text-xs text-[#baa6af] hover:text-white transition-all active:scale-95 cursor-pointer min-h-[38px] flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="px-4 py-2 rounded-full bg-[#1a0e16] hover:bg-[#2b1725] border border-[#3d2033] text-xs font-sans-clean tracking-wider uppercase text-[#f8c8d8] transition-all active:scale-95 cursor-pointer min-h-[38px] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3 text-[#f8c8d8]" />
              <span>Replay Film</span>
            </button>

            <button
              type="button"
              onClick={onLock}
              aria-label="Lock screen"
              className="w-9 h-9 rounded-full bg-[#120a0f] hover:bg-[#20111a] border border-[#291421] flex items-center justify-center text-[#99868e] hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
