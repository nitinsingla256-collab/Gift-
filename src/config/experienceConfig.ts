import { MemoryChapterFoundation } from '../types';

// Internal password verification constants
const SIMPLE_CODE = '121111';
const SPECIAL_CODE = '3131';

export function verifyPasscode(input: string): 'simple' | 'special' | 'invalid' {
  const sanitized = input.trim();
  if (sanitized === SPECIAL_CODE) {
    return 'special';
  }
  if (sanitized === SIMPLE_CODE) {
    return 'simple';
  }
  return 'invalid';
}

export const EXPERIENCE_CONFIG = {
  opening: {
    revealText: 'Something made just for you.',
    enterButtonLabel: 'Enter',
  },
  password: {
    heading: 'Enter the code',
  },
  specialIntro: {
    label: 'A little memory, made with care.',
  },
};

/**
 * Architectural foundation for upcoming memory chapters (Part 2 - Part 5)
 */
export const UPCOMING_CHAPTERS: MemoryChapterFoundation[] = [
  {
    id: 'prologue',
    number: 'I',
    title: 'The Beginning of Everything',
    subtitle: 'Where the story quietly begins',
    photoCountTeaser: 84,
    status: 'unlocked',
    previewNote: 'Every memory here was collected and preserved with intention.',
  },
  {
    id: 'moments',
    number: 'II',
    title: 'Unscripted Golden Hours',
    subtitle: 'The laughter in between moments',
    photoCountTeaser: 142,
    status: 'coming_soon',
    previewNote: 'Hundreds of candid frames, timeless smiles, and stolen glances.',
  },
  {
    id: 'journeys',
    number: 'III',
    title: 'Wanderlust & Late Nights',
    subtitle: 'Across streets, horizons, and quiet talks',
    photoCountTeaser: 196,
    status: 'coming_soon',
    previewNote: 'Places we explored, songs we replayed, and stars we watched.',
  },
  {
    id: 'celebration',
    number: 'IV',
    title: 'Another Beautiful Year',
    subtitle: 'A birthday letter wrapped in memories',
    photoCountTeaser: 180,
    status: 'coming_soon',
    previewNote: 'A final warm wish waiting to unfold.',
  },
];
