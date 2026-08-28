import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export type ExperienceTab = 'little-moments' | 'special-one';

interface GalleryNavProps {
  activeTab: ExperienceTab;
  onSelectTab: (tab: ExperienceTab) => void;
}

export const GalleryNav: React.FC<GalleryNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      id="experience-nav"
      aria-label="Experience Navigation"
      className="sticky top-3 z-30 w-full max-w-[380px] mx-auto px-2 mb-4"
    >
      <div className="flex items-center justify-between p-1 rounded-full bg-[#120f0e]/90 backdrop-blur-xl border border-[#29221b] shadow-xl shadow-black/80">
        <button
          id="nav-tab-little-moments"
          onClick={() => onSelectTab('little-moments')}
          className={`relative flex-1 py-2 px-3 text-center rounded-full text-[11px] sm:text-xs font-sans-clean tracking-wider uppercase transition-all duration-300 select-none flex items-center justify-center gap-1.5 ${
            activeTab === 'little-moments'
              ? 'text-[#f5efe6] font-medium'
              : 'text-[#82766a] hover:text-[#c7bcb0] font-light'
          }`}
        >
          {activeTab === 'little-moments' && (
            <span className="absolute inset-0 rounded-full bg-[#211b17] border border-[#3d3228] -z-10 shadow-sm" />
          )}
          <Sparkles className={`w-3 h-3 ${activeTab === 'little-moments' ? 'text-[#d4af78]' : 'opacity-40'}`} />
          <span>Little Moments</span>
        </button>

        <button
          id="nav-tab-special-one"
          onClick={() => onSelectTab('special-one')}
          className={`relative flex-1 py-2 px-3 text-center rounded-full text-[11px] sm:text-xs font-sans-clean tracking-wider uppercase transition-all duration-300 select-none flex items-center justify-center gap-1.5 ${
            activeTab === 'special-one'
              ? 'text-[#f5efe6] font-medium'
              : 'text-[#82766a] hover:text-[#c7bcb0] font-light'
          }`}
        >
          {activeTab === 'special-one' && (
            <span className="absolute inset-0 rounded-full bg-[#211b17] border border-[#3d3228] -z-10 shadow-sm" />
          )}
          <Heart className={`w-3 h-3 ${activeTab === 'special-one' ? 'text-[#d9a5a0]' : 'opacity-40'}`} />
          <span>Special One</span>
        </button>
      </div>
    </nav>
  );
};
