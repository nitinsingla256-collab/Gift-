/**
 * Application Type Definitions
 */

export type ScreenState = 
  | 'opening'
  | 'password'
  | 'cinematic_film'
  | 'special_intro'
  | 'memory_gallery';

export type PasswordType = 'simple' | 'special' | 'invalid';

export interface MemoryImage {
  id: string;
  src: string;
  title?: string;
  caption?: string;
  date?: string;
  location?: string;
  aspectRatio?: 'portrait' | 'square' | 'landscape' | 'tall';
}

export type MotionVariant = 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'drift-up';

export interface BaseSlide {
  id: string;
  type: 'intro' | 'photo' | 'shayari' | 'chapter' | 'finale';
}

export interface IntroSlide extends BaseSlide {
  type: 'intro';
  text: string;
  subtext?: string;
}

export interface PhotoSlide extends BaseSlide {
  type: 'photo';
  image: MemoryImage;
  photoIndex: number; // 1 to 10
  totalPhotos: number; // 10
  chapter: 'little-moments' | 'special-one';
  chapterName: string;
  subtitle?: string;
  motionVariant: MotionVariant;
  duration?: number; // seconds
}

export interface ShayariSlide extends BaseSlide {
  type: 'shayari';
  hindiLines: string[];
  englishTranslation?: string;
  chapter: 'little-moments' | 'special-one';
  duration?: number;
}

export interface ChapterSlide extends BaseSlide {
  type: 'chapter';
  chapterTitle: string;
  chapterSubtitle: string;
  duration?: number;
}

export interface FinaleSlide extends BaseSlide {
  type: 'finale';
  greeting: string;
  quote: string;
}

export type CinematicSlide = IntroSlide | PhotoSlide | ShayariSlide | ChapterSlide | FinaleSlide;

export type GalleryNavSection = 'special-one' | 'little-moments' | 'note';

export interface SoundscapeConfig {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0 to 1
  isSynthesizerActive: boolean;
  customTrackName?: string;
  hasUserInteracted: boolean;
}

export interface MemoryChapterFoundation {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  photoCountTeaser: number;
  status: 'locked' | 'unlocked' | 'coming_soon';
  previewNote: string;
}

export interface ExperienceConfig {
  title: string;
  openingSubtext: string;
  specialIntroText: string;
  simpleIntroText: string;
}

export interface MemoryJournalNote {
  slideId: string;
  slideIndex: number;
  text: string;
  mood?: string;
  updatedAt: string;
}

export type MemoryJournalNotesMap = Record<string, MemoryJournalNote>;
