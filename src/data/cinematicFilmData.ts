import { CinematicSlide, MemoryImage } from '../types';
import { littleMomentsImages, specialOneImages } from './memoryGalleryData';

/**
 * =======================================================================
 * CINEMATIC MEMORY FILM SEQUENCE (Strict 10 Photos Total)
 * =======================================================================
 * Designed as a private digital short film:
 * - Prologue
 * - Chapter 1: Little Moments (5 Photos + Breathing Pause)
 * - Chapter Reveal: Special One
 * - Chapter 2: Special One (5 Photos + Intimate Shayaris)
 * - Epilogue (Happy Birthday & Replay)
 * =======================================================================
 */

export const CINEMATIC_FILM_SLIDES: CinematicSlide[] = [
  // 1. Prologue Intro
  {
    id: 'film-prologue',
    type: 'intro',
    text: 'Some moments stay.',
    subtext: 'A private memory film, made just for you.',
  },

  // 2. Photo 01 (Little Moments)
  {
    id: 'slide-moment-1',
    type: 'photo',
    image: littleMomentsImages[0],
    photoIndex: 1,
    totalPhotos: 10,
    chapter: 'little-moments',
    chapterName: 'Little Moments',
    subtitle: 'Two cups, foggy glass, and no rush to be anywhere else.',
    motionVariant: 'zoom-in',
    duration: 6.5,
  },

  // 3. Photo 02 (Little Moments)
  {
    id: 'slide-moment-2',
    type: 'photo',
    image: littleMomentsImages[1],
    photoIndex: 2,
    totalPhotos: 10,
    chapter: 'little-moments',
    chapterName: 'Little Moments',
    subtitle: 'Walking slowly, talking about everything and nothing.',
    motionVariant: 'pan-right',
    duration: 6.5,
  },

  // 4. Shayari Moment 1 (Dark pause)
  {
    id: 'shayari-1',
    type: 'shayari',
    chapter: 'little-moments',
    hindiLines: [
      'कुछ लम्हें बस यूँ ही ख़ास बन जाते हैं,',
      'जब तुम साथ होती हो तो सारे ग़म भूल जाते हैं।',
    ],
    englishTranslation: 'Some moments simply become precious without trying; in your presence, every worry fades away.',
    duration: 5.5,
  },

  // 5. Photo 03 (Little Moments)
  {
    id: 'slide-moment-3',
    type: 'photo',
    image: littleMomentsImages[2],
    photoIndex: 3,
    totalPhotos: 10,
    chapter: 'little-moments',
    chapterName: 'Little Moments',
    subtitle: 'A quiet toast to the little victories only we understand.',
    motionVariant: 'zoom-out',
    duration: 6.5,
  },

  // 6. Photo 04 (Little Moments)
  {
    id: 'slide-moment-4',
    type: 'photo',
    image: littleMomentsImages[3],
    photoIndex: 4,
    totalPhotos: 10,
    chapter: 'little-moments',
    chapterName: 'Little Moments',
    subtitle: 'When the city quieted down and we just watched the colors fade.',
    motionVariant: 'pan-left',
    duration: 6.5,
  },

  // 7. Photo 05 (Little Moments)
  {
    id: 'slide-moment-5',
    type: 'photo',
    image: littleMomentsImages[4],
    photoIndex: 5,
    totalPhotos: 10,
    chapter: 'little-moments',
    chapterName: 'Little Moments',
    subtitle: 'Laughter in the cool evening air, holding onto every second.',
    motionVariant: 'drift-up',
    duration: 6.5,
  },

  // 8. Chapter Transition: SPECIAL ONE
  {
    id: 'chapter-special-one',
    type: 'chapter',
    chapterTitle: 'SPECIAL ONE',
    chapterSubtitle: 'For the moments, the smiles, and the person who means a little more.',
    duration: 5.0,
  },

  // 9. Photo 06 (Special One: Her Photo)
  {
    id: 'slide-special-1',
    type: 'photo',
    image: specialOneImages[0],
    photoIndex: 6,
    totalPhotos: 10,
    chapter: 'special-one',
    chapterName: 'Special One',
    subtitle: 'The golden hour light, reflecting in your eyes.',
    motionVariant: 'zoom-in',
    duration: 7.0,
  },

  // 10. Shayari Moment 2
  {
    id: 'shayari-2',
    type: 'shayari',
    chapter: 'special-one',
    hindiLines: [
      'यूँ तो हर लम्हा आम सा गुज़र जाता है,',
      'पर जब तुम मुस्कुराती हो, वक़्त वहीं ठहर जाता है।',
    ],
    englishTranslation: 'Every moment passes ordinarily, but when you smile, time gently pauses.',
    duration: 5.5,
  },

  // 11. Photo 07 (Special One: Her Photo)
  {
    id: 'slide-special-2',
    type: 'photo',
    image: specialOneImages[1],
    photoIndex: 7,
    totalPhotos: 10,
    chapter: 'special-one',
    chapterName: 'Special One',
    subtitle: 'An unrehearsed laugh that brightens the entire room.',
    motionVariant: 'drift-up',
    duration: 7.0,
  },

  // 12. Shayari Moment 3
  {
    id: 'shayari-3',
    type: 'shayari',
    chapter: 'special-one',
    hindiLines: [
      'तुम्हारी हँसी में एक अजीब सा सुकून है,',
      'जैसे थकी हुई शाम को चाँद मिल गया हो।',
    ],
    englishTranslation: 'There is a rare peace in your laugh, like the night finding the moon after a long day.',
    duration: 5.5,
  },

  // 13. Photo 08 (Special One: Our Shared Photo)
  {
    id: 'slide-special-3',
    type: 'photo',
    image: specialOneImages[2],
    photoIndex: 8,
    totalPhotos: 10,
    chapter: 'special-one',
    chapterName: 'Special One',
    subtitle: 'Quiet company where no words were even needed.',
    motionVariant: 'pan-right',
    duration: 7.0,
  },

  // 14. Shayari Moment 4
  {
    id: 'shayari-4',
    type: 'shayari',
    chapter: 'special-one',
    hindiLines: [
      'कुछ बातें बिना कहे ही मुकम्मल हो जाती हैं,',
      'तुम पास होती हो तो खामोशियाँ भी गुनगुनाती हैं।',
    ],
    englishTranslation: 'Some feelings need no words; in your presence, even silence turns into music.',
    duration: 5.5,
  },

  // 15. Photo 09 (Special One: Her Photo)
  {
    id: 'slide-special-4',
    type: 'photo',
    image: specialOneImages[3],
    photoIndex: 9,
    totalPhotos: 10,
    chapter: 'special-one',
    chapterName: 'Special One',
    subtitle: 'A radiance that makes every place feel like home.',
    motionVariant: 'zoom-out',
    duration: 7.0,
  },

  // 16. Photo 10 (Special One: Our Shared Photo)
  {
    id: 'slide-special-5',
    type: 'photo',
    image: specialOneImages[4],
    photoIndex: 10,
    totalPhotos: 10,
    chapter: 'special-one',
    chapterName: 'Special One',
    subtitle: 'Every tomorrow is softer and brighter because of you.',
    motionVariant: 'zoom-in',
    duration: 7.5,
  },

  // 17. Shayari Moment 5 (Finale Poetic Wish)
  {
    id: 'shayari-5',
    type: 'shayari',
    chapter: 'special-one',
    hindiLines: [
      'दुआ है कि हर साल तुम्हारा चेहरा यूँ ही खिलता रहे,',
      'और हमें हर जनम तुम्हारा साथ मिलता रहे।',
    ],
    englishTranslation: 'May your smile blossom with every passing year, and may I always have you by my side.',
    duration: 6.0,
  },

  // 18. Finale Slide
  {
    id: 'film-finale',
    type: 'finale',
    greeting: 'Happy Birthday.',
    quote: 'Some memories are meant to be felt, not just remembered.',
  },
];
