import React, { useState, useEffect } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { GalleryNav, ExperienceTab } from './GalleryNav';
import { LittleMomentsExperience } from './LittleMomentsExperience';
import { SpecialOneExperience } from './SpecialOneExperience';
import { CinematicImageViewer } from './CinematicImageViewer';
import { littleMomentsImages, specialOneImages } from '../data/memoryGalleryData';
import { MemoryImage } from '../types';
import { soundscapeEngine } from '../utils/audioEngine';

interface MemoryGalleryExperienceProps {
  onLock: () => void;
}

export const MemoryGalleryExperience: React.FC<MemoryGalleryExperienceProps> = ({
  onLock,
}) => {
  const [activeTab, setActiveTab] = useState<ExperienceTab>('little-moments');

  // Cinematic Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [viewerImages, setViewerImages] = useState<MemoryImage[]>(littleMomentsImages);
  const [viewerIndex, setViewerIndex] = useState<number>(0);
  const [layoutPrefix, setLayoutPrefix] = useState<string>('moment');

  // Start ambient audio gently if not already running (since user interacted to unlock password)
  useEffect(() => {
    if (!soundscapeEngine.isAudioActive()) {
      soundscapeEngine.startAmbientSynth();
    }
  }, []);

  // Open Little Moments Photo
  const handleOpenLittleMoment = (index: number) => {
    setViewerImages(littleMomentsImages);
    setViewerIndex(index);
    setLayoutPrefix('moment');
    setIsViewerOpen(true);
  };

  // Open Special One Photo
  const handleOpenSpecialOne = (index: number) => {
    setViewerImages(specialOneImages);
    setViewerIndex(index);
    setLayoutPrefix('special');
    setIsViewerOpen(true);
  };

  const handleTabChange = (tab: ExperienceTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      id="memory-experience-root"
      className="relative min-h-[100dvh] w-full flex flex-col items-center py-5 px-3 sm:px-4 text-[#e6e0d4] select-none"
    >
      {/* Top Header with Brand & Lock Action */}
      <header className="w-full max-w-[390px] flex items-center justify-between pb-3 pt-1 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af78]" />
          <span className="text-[10px] font-sans-clean tracking-[0.25em] uppercase text-[#9c8f82]">
            Birthday Memory
          </span>
        </div>
        <button
          id="gallery-lock-btn"
          onClick={onLock}
          aria-label="Lock experience"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#141210]/80 border border-[#26201b] hover:border-[#40352c] text-[11px] text-[#8c8073] hover:text-[#d4c8ba] transition-all duration-300 active:scale-95 shadow-sm"
        >
          <Lock className="w-3 h-3" />
          <span>Lock</span>
        </button>
      </header>

      {/* Experience Switcher Navigation */}
      <GalleryNav
        activeTab={activeTab}
        onSelectTab={handleTabChange}
      />

      {/* Main Distinct Experiences */}
      <main className="w-full max-w-[390px] flex flex-col items-center mt-1">
        {activeTab === 'little-moments' ? (
          <LittleMomentsExperience
            onSelectImage={handleOpenLittleMoment}
          />
        ) : (
          <SpecialOneExperience
            onSelectImage={handleOpenSpecialOne}
          />
        )}
      </main>

      {/* Shared Cinematic Fullscreen Viewer */}
      <CinematicImageViewer
        images={viewerImages}
        currentIndex={viewerIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onNavigate={(newIdx) => setViewerIndex(newIdx)}
        layoutPrefix={layoutPrefix}
      />
    </div>
  );
};
