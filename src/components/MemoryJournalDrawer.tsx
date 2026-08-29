import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Feather,
  Sparkles,
  Heart,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  MessageSquare,
  FileText,
  Calendar,
  Smile
} from 'lucide-react';
import { tenHerPhotographs, GalleryMemorySlot } from '../data/memoryGalleryData';
import { MemoryJournalNote, MemoryJournalNotesMap } from '../types';

interface MemoryJournalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  notes: MemoryJournalNotesMap;
  onSaveNote: (slideId: string, slideIndex: number, text: string, mood?: string) => void;
  onDeleteNote: (slideId: string) => void;
}

const MOOD_OPTIONS = [
  { id: 'cherished', label: 'Cherished 💖', emoji: '💖' },
  { id: 'warm', label: 'Warm 🌸', emoji: '🌸' },
  { id: 'nostalgic', label: 'Nostalgic ✨', emoji: '✨' },
  { id: 'laughing', label: 'Joyful 😊', emoji: '😊' },
  { id: 'peaceful', label: 'Peaceful 🌙', emoji: '🌙' },
  { id: 'blessed', label: 'Blessed 🧿', emoji: '🧿' },
];

const INSPIRATION_PROMPTS = [
  'What made this moment unforgettable...',
  'A secret thought I never said out loud...',
  'The feeling behind that smile...',
  'Why this photograph warms my heart...',
  'A wish for you on your special day...',
];

export const MemoryJournalDrawer: React.FC<MemoryJournalDrawerProps> = ({
  isOpen,
  onClose,
  activeSlideIndex,
  onSelectSlide,
  notes,
  onSaveNote,
  onDeleteNote,
}) => {
  const [selectedDrawerIndex, setSelectedDrawerIndex] = useState<number>(activeSlideIndex);
  const [noteText, setNoteText] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('Cherished 💖');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'editor' | 'all_notes'>('editor');

  const currentSlot: GalleryMemorySlot = tenHerPhotographs[selectedDrawerIndex] || tenHerPhotographs[0];
  const existingNote: MemoryJournalNote | undefined = notes[currentSlot.id];

  // Sync drawer index with external active index when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDrawerIndex(activeSlideIndex);
    }
  }, [isOpen, activeSlideIndex]);

  // Load existing note when selected drawer index changes
  useEffect(() => {
    if (existingNote) {
      setNoteText(existingNote.text);
      setSelectedMood(existingNote.mood || 'Cherished 💖');
    } else {
      setNoteText('');
      setSelectedMood('Cherished 💖');
    }
    setSaveSuccess(false);
  }, [selectedDrawerIndex, existingNote]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) return;

    onSaveNote(currentSlot.id, currentSlot.index, noteText.trim(), selectedMood);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this journal note for this memory?')) {
      onDeleteNote(currentSlot.id);
      setNoteText('');
    }
  };

  const handleCopy = () => {
    if (!noteText.trim()) return;
    const textToCopy = `📝 Memory Journal [${currentSlot.indexFormatted} - ${currentSlot.title}]\n"${noteText}"\nMood: ${selectedMood} 🧿`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePromptClick = (prompt: string) => {
    if (!noteText.trim()) {
      setNoteText(prompt + ' ');
    } else {
      setNoteText((prev) => prev + '\n' + prompt + ' ');
    }
  };

  const totalNotesCount = Object.keys(notes).filter((k) => notes[k]?.text?.trim().length > 0).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020202]/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-in Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md sm:max-w-lg md:max-w-xl bg-gradient-to-b from-[#160d13] via-[#0f080d] to-[#080407] border-l border-[#3a1f2f] shadow-[-15px_0_50px_rgba(0,0,0,0.95)] flex flex-col z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#f8c8d8]/[0.04] rounded-full blur-3xl pointer-events-none" />

            {/* Inset Accent Border */}
            <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#e8d5b5]/10 pointer-events-none" />

            {/* 
              ===================================================================
              DRAWER HEADER
              ===================================================================
            */}
            <header className="relative z-20 px-5 sm:px-6 pt-5 pb-4 border-b border-[#281320] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#24111d] border border-[#f8c8d8]/40 flex items-center justify-center text-[#f8c8d8] shadow-[0_0_10px_rgba(248,200,216,0.2)]">
                  <Feather className="w-4 h-4 text-[#f8c8d8]" />
                </div>
                <div>
                  <h2 className="font-serif-luxury text-lg sm:text-xl text-[#faf4ec] font-normal tracking-wide flex items-center gap-2">
                    <span>Memory Journal</span>
                    <span className="text-xs">🧿</span>
                  </h2>
                  <p className="font-sans-clean text-[10px] sm:text-[11px] text-[#9c8893] tracking-wider uppercase">
                    Attach Private Notes To Moments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Switcher: Editor vs All Notes */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'editor' ? 'all_notes' : 'editor')}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans-clean flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'all_notes'
                      ? 'bg-[#2b1624] text-[#f8c8d8] border border-[#f8c8d8]/60 shadow-[0_0_8px_rgba(248,200,216,0.3)]'
                      : 'bg-[#140a10] text-[#baa6af] border border-[#2b1624] hover:text-[#faf4ec]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes ({totalNotesCount})</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Journal Drawer"
                  className="w-8 h-8 rounded-full bg-[#140a10] hover:bg-[#24111d] border border-[#2b1624] flex items-center justify-center text-[#baa6af] hover:text-[#faf4ec] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* 
              ===================================================================
              VIEW 1: NOTE EDITOR FOR SPECIFIC SLIDES
              ===================================================================
            */}
            {viewMode === 'editor' ? (
              <div className="relative z-20 flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-5">
                {/* 
                  10-SLIDES HORIZONTAL SELECTOR STRIP
                */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-sans-clean tracking-wider uppercase text-[#9c8893]">
                    <span>Select Memory Slide</span>
                    <span className="text-[#f8c8d8]">
                      {tenHerPhotographs[selectedDrawerIndex]?.indexFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                    {tenHerPhotographs.map((slot, idx) => {
                      const isSelected = idx === selectedDrawerIndex;
                      const hasNote = Boolean(notes[slot.id]?.text?.trim());

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setSelectedDrawerIndex(idx);
                            onSelectSlide(idx);
                          }}
                          className={`relative shrink-0 w-14 sm:w-16 rounded-xl p-1 text-left transition-all duration-200 cursor-pointer group ${
                            isSelected
                              ? 'bg-[#291322] border-2 border-[#f8c8d8] shadow-[0_0_12px_rgba(248,200,216,0.35)] scale-105'
                              : 'bg-[#12080f] border border-[#26121f] hover:border-[#3d1e32] opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#0a0508]">
                            <img
                              src={slot.image.src}
                              alt={slot.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {/* Slide Number Badge */}
                            <div className="absolute top-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[8px] font-sans-clean font-bold text-[#faf4ec]">
                              {String(slot.index).padStart(2, '0')}
                            </div>

                            {/* Note Attached Indicator Pill */}
                            {hasNote && (
                              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f8c8d8] text-[#12080f] flex items-center justify-center shadow-[0_0_6px_rgba(248,200,216,0.8)] animate-subtle-pulse">
                                <Feather className="w-2 h-2" />
                              </div>
                            )}
                          </div>
                          <p className="text-[9px] font-sans-clean text-[#baa6af] truncate pt-1 px-0.5 text-center group-hover:text-[#faf4ec]">
                            {slot.title}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 
                  ACTIVE MEMORY MINI CARD PREVIEW
                */}
                <div className="rounded-2xl bg-[#12080f]/90 border border-[#2b1422] p-3.5 flex items-center gap-3.5 shadow-md">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-[#3b1c2f] bg-[#0a0407]">
                    <img
                      src={currentSlot.image.src}
                      alt={currentSlot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/80 px-1 rounded text-[8px] font-sans-clean text-[#f8c8d8]">
                      🧿 {currentSlot.indexFormatted}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-luxury text-base text-[#faf4ec] truncate font-medium">
                        {currentSlot.title}
                      </h3>
                      {existingNote && (
                        <span className="text-[9px] font-sans-clean text-[#8e7b85] tracking-wider uppercase">
                          Saved
                        </span>
                      )}
                    </div>
                    <p className="font-serif-luxury italic text-xs text-[#baa6af] line-clamp-2 leading-relaxed">
                      "{currentSlot.hinglishLine}"
                    </p>
                  </div>
                </div>

                {/* 
                  MOOD SELECTOR PILLS
                */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893]">
                    Memory Mood
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => setSelectedMood(mood.label)}
                        className={`px-2.5 py-1 rounded-full text-xs font-sans-clean transition-all cursor-pointer ${
                          selectedMood === mood.label
                            ? 'bg-[#2d1525] border border-[#f8c8d8]/80 text-[#faf4ec] shadow-[0_0_8px_rgba(248,200,216,0.2)]'
                            : 'bg-[#12080f] border border-[#26121f] text-[#9c8893] hover:text-[#faf4ec]'
                        }`}
                      >
                        {mood.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 
                  JOURNAL NOTE TEXTAREA
                */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] sm:text-xs font-sans-clean font-medium tracking-widest uppercase text-[#9c8893]">
                      Your Private Note for Slide {currentSlot.indexFormatted}
                    </label>
                    <span className="text-[10px] font-sans-clean text-[#6e5864]">
                      {noteText.length}/600
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value.slice(0, 600))}
                      placeholder="Write your private note, memory, or thoughts attached to this photograph..."
                      rows={5}
                      className="w-full rounded-2xl bg-[#0b0509]/90 border border-[#301625] focus:border-[#f8c8d8]/70 focus:outline-none p-3.5 text-xs sm:text-sm font-serif-luxury italic text-[#faf4ec] placeholder:text-[#5e4954] placeholder:font-sans-clean placeholder:italic-none resize-none transition-all"
                    />
                  </div>
                </div>

                {/* 
                  QUICK INSPIRATION CHIPS
                */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-sans-clean tracking-wider uppercase text-[#735f6a] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#f8c8d8]" />
                    <span>Inspiration Ideas (tap to insert)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {INSPIRATION_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePromptClick(prompt)}
                        className="px-2.5 py-1 rounded-lg bg-[#140911] hover:bg-[#200e1b] border border-[#291322] hover:border-[#421d37] text-[10.5px] font-serif-luxury italic text-[#9e8b95] hover:text-[#f8c8d8] transition-all cursor-pointer"
                      >
                        + {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 
                  ACTION CONTROLS
                */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      disabled={!noteText.trim()}
                      className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-sans-clean font-medium tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md ${
                        noteText.trim()
                          ? 'bg-gradient-to-r from-[#2c1324] via-[#3d1a33] to-[#2c1324] hover:from-[#401b35] hover:to-[#401b35] border border-[#f8c8d8]/60 text-[#f8c8d8] shadow-[0_0_15px_rgba(248,200,216,0.2)]'
                          : 'bg-[#140a10] border border-[#26121f] text-[#695661] cursor-not-allowed'
                      }`}
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-[#f8c8d8]" />
                          <span>Saved with Love 🧿</span>
                        </>
                      ) : (
                        <>
                          <Feather className="w-4 h-4 text-[#f8c8d8]" />
                          <span>{existingNote ? 'Update Note' : 'Attach Note'}</span>
                        </>
                      )}
                    </button>

                    {existingNote && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        title="Delete Note"
                        className="w-11 h-11 rounded-full bg-[#14080f] hover:bg-[#240c19] border border-[#2e1422] hover:border-red-500/40 text-[#8e7a84] hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {noteText.trim() && (
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy Note"
                        className="w-11 h-11 rounded-full bg-[#14080f] hover:bg-[#240c19] border border-[#2e1422] text-[#8e7a84] hover:text-[#f8c8d8] flex items-center justify-center transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-[#f8c8d8]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {existingNote?.updatedAt && (
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans-clean text-[#7a6772] pt-1">
                      <Calendar className="w-3 h-3 text-[#7a6772]" />
                      <span>Last saved: {existingNote.updatedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 
                ===================================================================
                VIEW 2: ALL SAVED JOURNAL NOTES SUMMARY
                ===================================================================
              */
              <div className="relative z-20 flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#24111e]">
                  <h3 className="font-serif-luxury text-sm sm:text-base text-[#faf4ec]">
                    All Saved Memory Notes ({totalNotesCount}/10)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setViewMode('editor')}
                    className="text-xs font-sans-clean text-[#f8c8d8] hover:underline cursor-pointer"
                  >
                    ← Back to Editor
                  </button>
                </div>

                {totalNotesCount === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#180b14] border border-[#2d1424] flex items-center justify-center text-[#735f6a] mx-auto">
                      <Feather className="w-5 h-5" />
                    </div>
                    <p className="font-serif-luxury italic text-xs sm:text-sm text-[#baa6af]">
                      No journal notes written yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode('editor')}
                      className="px-4 py-2 rounded-full bg-[#200e1b] border border-[#3d1c33] text-xs text-[#f8c8d8] hover:text-white transition-all cursor-pointer"
                    >
                      Write your first note ✨
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tenHerPhotographs.map((slot, idx) => {
                      const note = notes[slot.id];
                      if (!note || !note.text.trim()) return null;

                      return (
                        <div
                          key={slot.id}
                          onClick={() => {
                            setSelectedDrawerIndex(idx);
                            onSelectSlide(idx);
                            setViewMode('editor');
                          }}
                          className="rounded-2xl bg-[#12080f]/90 border border-[#2b1422] hover:border-[#f8c8d8]/50 p-4 transition-all duration-200 cursor-pointer group shadow-md space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-sans-clean font-medium text-[#f8c8d8] bg-[#240f1d] px-2 py-0.5 rounded-full border border-[#3d1930]">
                                {slot.indexFormatted}
                              </span>
                              <span className="font-serif-luxury text-sm text-[#faf4ec] font-medium">
                                {slot.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-sans-clean text-[#baa6af] bg-[#1a0c16] px-2 py-0.5 rounded-full">
                              {note.mood || 'Cherished 💖'}
                            </span>
                          </div>

                          <p className="font-serif-luxury italic text-xs sm:text-sm text-[#ece1d8] leading-relaxed line-clamp-3">
                            "{note.text}"
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-sans-clean text-[#786671] pt-1 border-t border-[#1e0d19]">
                            <span>{note.updatedAt}</span>
                            <span className="text-[#f8c8d8] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                              Edit Note <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 
              ===================================================================
              DRAWER FOOTER / PRIVACY BADGE
              ===================================================================
            */}
            <footer className="relative z-20 px-5 sm:px-6 py-3 border-t border-[#24111e] bg-[#0c050a] flex items-center justify-between text-[10px] font-sans-clean text-[#786570]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#786570]" />
                <span>Private & saved locally on this device</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🧿</span>
                <Heart className="w-2.5 h-2.5 text-[#f8c8d8] fill-[#f8c8d8]/40" />
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
