import { MemoryImage } from '../types';

/**
 * =======================================================================
 * EXACTLY 10 CURATED INDIVIDUAL PHOTOGRAPHS OF HER
 * =======================================================================
 * Genuine, romantic, personal-feeling Hinglish captions for each photograph.
 * Tasteful 🧿 details on every card.
 */
export interface GalleryMemorySlot {
  id: string;
  index: number;
  indexFormatted: string; // e.g. "01 / 10"
  image: MemoryImage;
  hinglishLine: string;
  title: string;
  rotation: number; // Subtle tilt for floating card cluster
}

export const tenHerPhotographs: GalleryMemorySlot[] = [
  {
    id: 'her-photo-01',
    index: 1,
    indexFormatted: '01 / 10',
    image: {
      id: 'photo-1',
      src: 'https://i.ibb.co/1JBJpkMf/IMG-20260727-WA0021-4.jpg',
      title: 'Gentle Smile',
      caption: 'Ye smile bas photo mein nahi hai... pura mood change kar dene ki capability rakhti hai.',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Ye smile bas photo mein nahi hai... pura mood change kar dene ki capability rakhti hai.',
    title: 'That Smile',
    rotation: -1.8,
  },
  {
    id: 'her-photo-02',
    index: 2,
    indexFormatted: '02 / 10',
    image: {
      id: 'photo-2',
      src: 'https://i.ibb.co/MyBg0PTw/IMG-20260728-WA0011-2.jpg',
      title: 'First Gaze',
      caption: 'Apki aankhon ka koi jawaab nahi... seriously, camera bhi inke saamne thoda nervous lagta hai. 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Apki aankhon ka koi jawaab nahi... seriously, camera bhi inke saamne thoda nervous lagta hai. 🧿',
    title: 'That Radiance',
    rotation: 2.0,
  },
  {
    id: 'her-photo-03',
    index: 3,
    indexFormatted: '03 / 10',
    image: {
      id: 'photo-3',
      src: 'https://i.ibb.co/vxP8RdhX/IMG-20260728-WA0021-2.jpg',
      title: 'Effortless Grace',
      caption: 'Honestly, is picture ko dekh ke ek hi thought aata hai — itni effortlessly pretty kaise? 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Honestly, is picture ko dekh ke ek hi thought aata hai — itni effortlessly pretty kaise? 🧿',
    title: 'Effortless Grace',
    rotation: -1.4,
  },
  {
    id: 'her-photo-04',
    index: 4,
    indexFormatted: '04 / 10',
    image: {
      id: 'photo-4',
      src: 'https://i.ibb.co/5WSPTvhD/Screenshot-2026-06-02-01-53-43-45-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Silent Charm',
      caption: 'Is wali photo mein kuch toh alag hai... aur haan, main exactly kya hai ye explain nahi kar paunga.',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Is wali photo mein kuch toh alag hai... aur haan, main exactly kya hai ye explain nahi kar paunga.',
    title: 'Quiet Grace',
    rotation: 1.6,
  },
  {
    id: 'her-photo-05',
    index: 5,
    indexFormatted: '05 / 10',
    image: {
      id: 'photo-5',
      src: 'https://i.ibb.co/wFzwSqSR/Screenshot-2026-06-04-10-19-47-20-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Pure Simplicity',
      caption: 'Simple, sweet aur bilkul genuine... aapki yahi saadgi seedha dil chhu jaati hai. ✨',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Simple, sweet aur bilkul genuine... aapki yahi saadgi seedha dil chhu jaati hai. ✨',
    title: 'Pure Simplicity',
    rotation: -2.0,
  },
  {
    id: 'her-photo-06',
    index: 6,
    indexFormatted: '06 / 10',
    image: {
      id: 'photo-6',
      src: 'https://i.ibb.co/0jbq4wRN/Screenshot-2026-06-21-13-42-18-05-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Warmth',
      caption: 'Bas ek baar dekh lo, aur din bhar ki saari thakaan gayab... magic se kam thodi na ho. 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Bas ek baar dekh lo, aur din bhar ki saari thakaan gayab... magic se kam thodi na ho. 🧿',
    title: 'Warm Glow',
    rotation: 1.8,
  },
  {
    id: 'her-photo-07',
    index: 7,
    indexFormatted: '07 / 10',
    image: {
      id: 'photo-7',
      src: 'https://i.ibb.co/dwDjxkkg/Screenshot-2026-06-21-13-42-44-57-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Candid Joy',
      caption: 'Candid pictures mein aapki jo real wali muskurahat aati hai, uska koi muqabla nahi.',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Candid pictures mein aapki jo real wali muskurahat aati hai, uska koi muqabla nahi.',
    title: 'Candid Joy',
    rotation: -1.6,
  },
  {
    id: 'her-photo-08',
    index: 8,
    indexFormatted: '08 / 10',
    image: {
      id: 'photo-8',
      src: 'https://i.ibb.co/cSgc3SWj/Screenshot-2026-06-23-20-00-30-75-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Khilkhilati Smile',
      caption: 'Nazar na lage kabhi is noor ko... hamesha aise hi khilkhilati rehna. 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Nazar na lage kabhi is noor ko... hamesha aise hi khilkhilati rehna. 🧿',
    title: 'Khilkhilati Smile',
    rotation: 1.4,
  },
  {
    id: 'her-photo-09',
    index: 9,
    indexFormatted: '09 / 10',
    image: {
      id: 'photo-9',
      src: 'https://i.ibb.co/dJjyP4tv/Screenshot-2026-06-27-14-05-02-08-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Timeless Grace',
      caption: 'A timeless kind of grace... jise kisi filter ya words mein capture karna mushkil hai.',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'A timeless kind of grace... jise kisi filter ya words mein capture karna mushkil hai.',
    title: 'Timeless Grace',
    rotation: -1.9,
  },
  {
    id: 'her-photo-10',
    index: 10,
    indexFormatted: '10 / 10',
    image: {
      id: 'photo-10',
      src: 'https://i.ibb.co/5hy19fCp/Screenshot-2026-06-30-13-59-00-77-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Fursat Se Banaya',
      caption: 'Rab ne sach mein fursat se aur bohot pyaar se banaya hai aapko. ✨ 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Rab ne sach mein fursat se aur bohot pyaar se banaya hai aapko. ✨ 🧿',
    title: 'Fursat Se Banaya',
    rotation: 1.5,
  },
];

/**
 * Backwards-compatibility aliases for other imports
 */
export const fourMemoryCards = tenHerPhotographs.slice(0, 4);
export const specialOnePhotos = tenHerPhotographs.slice(4, 8);
export const littleMomentsImages: MemoryImage[] = tenHerPhotographs.map(s => s.image);
export const specialOneImages: MemoryImage[] = tenHerPhotographs.slice(4).map(s => s.image);
export const allTenMemories: MemoryImage[] = tenHerPhotographs.map(s => s.image);

export interface SpatialMemoryItem {
  id: string;
  indexNumber: string;
  chapter: 'little-moments' | 'special-one';
  image: MemoryImage;
  tag: string;
  cinematicLine: string;
  date?: string;
  hasNazarAmulet?: boolean;
}

export const normalSpatialMemories: SpatialMemoryItem[] = tenHerPhotographs.map((s, idx) => ({
  id: s.id,
  indexNumber: String(idx + 1).padStart(2, '0'),
  chapter: idx < 5 ? 'little-moments' : 'special-one',
  image: s.image,
  tag: s.title,
  cinematicLine: s.hinglishLine,
  hasNazarAmulet: true,
}));

export const specialSpatialMemories = normalSpatialMemories;

export const specialRomanticNote = {
  title: 'From the Core of My Heart',
  salutation: '',
  lines: [],
  signoff: 'Always,',
  signature: 'Yours',
};

export const birthdayLetter = {
  title: specialRomanticNote.title,
  subtitle: '',
  salutation: '',
  paragraphs: [],
  signoff: specialRomanticNote.signoff,
  signature: specialRomanticNote.signature,
};

export const littleNote = birthdayLetter;

export interface SpecialOneItem {
  id: string;
  type: 'her_photo';
  src: string;
  title: string;
  tag: string;
  aspectRatio: 'portrait';
  offset?: 'left' | 'right' | 'center';
  shayariAfter?: {
    lines: string[];
    englishTranslation?: string;
  };
}

export const specialOneItems: SpecialOneItem[] = tenHerPhotographs.map((s, idx) => ({
  id: s.id,
  type: 'her_photo' as const,
  src: s.image.src,
  title: s.title,
  tag: 'Her Photo',
  aspectRatio: 'portrait' as const,
  offset: idx % 2 === 0 ? 'left' : 'right',
  shayariAfter: {
    lines: [s.hinglishLine],
  },
}));
