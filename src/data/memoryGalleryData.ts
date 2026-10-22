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
    indexFormatted: '01 / 15',
    image: {
      id: 'photo-1',
      src: '/photos/photo-1.jpg',
      fallbackSrc: 'https://i.ibb.co/1JBJpkMf/IMG-20260727-WA0021-4.jpg',
      title: 'Gulabi Phool & You',
      caption: 'Black floral dress aur ye pyari si smile... un gulabi phoolon se bhi zyada noor aapke chehre pe hai. 🌸 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Black floral dress aur ye pyari si smile... un gulabi phoolon se bhi zyada noor aapke chehre pe hai. 🌸 🧿',
    title: 'Gulabi Phool & You',
    rotation: -1.8,
  },
  {
    id: 'her-photo-02',
    index: 2,
    indexFormatted: '02 / 15',
    image: {
      id: 'photo-2',
      src: '/photos/photo-2.jpg',
      fallbackSrc: 'https://i.ibb.co/MyBg0PTw/IMG-20260728-WA0011-2.jpg',
      title: 'Aankhon Ka Jaadu',
      caption: 'Sirf ye aankhen dekh kar hi dil thehar jaata hai... inmein jo gehraai aur sukoon hai, uska koi jawaab nahi. 🧿 ✨',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Sirf ye aankhen dekh kar hi dil thehar jaata hai... inmein jo gehraai aur sukoon hai, uska koi jawaab nahi. 🧿 ✨',
    title: 'Aankhon Ka Jaadu',
    rotation: 2.0,
  },
  {
    id: 'her-photo-03',
    index: 3,
    indexFormatted: '03 / 15',
    image: {
      id: 'photo-3',
      src: '/photos/photo-3.jpg',
      fallbackSrc: 'https://i.ibb.co/vxP8RdhX/IMG-20260728-WA0021-2.jpg',
      title: 'Desi Royalty',
      caption: 'Laal rang, kaano mein jhumke aur hathon mein chuda... ekdum desi royalty lagti ho aap. 👑 ❤️ 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Laal rang, kaano mein jhumke aur hathon mein chuda... ekdum desi royalty lagti ho aap. 👑 ❤️ 🧿',
    title: 'Desi Royalty',
    rotation: -1.4,
  },
  {
    id: 'her-photo-04',
    index: 4,
    indexFormatted: '04 / 15',
    image: {
      id: 'photo-4',
      src: '/photos/photo-4.jpg',
      fallbackSrc: 'https://i.ibb.co/5WSPTvhD/Screenshot-2026-06-02-01-53-43-45-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Sunset by the Waves',
      caption: 'Dhalti hui dhoop, samundar ki lehrein aur aapka ye shant andaaz... ek khubsurat shaam ka sabse haseen hissa. 🌅 🌊 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Dhalti hui dhoop, samundar ki lehrein aur aapka ye shant andaaz... ek khubsurat shaam ka sabse haseen hissa. 🌅 🌊 🧿',
    title: 'Sunset by the Waves',
    rotation: 1.6,
  },
  {
    id: 'her-photo-05',
    index: 5,
    indexFormatted: '05 / 15',
    image: {
      id: 'photo-5',
      src: '/photos/photo-5.jpg',
      fallbackSrc: 'https://i.ibb.co/wFzwSqSR/Screenshot-2026-06-04-10-19-47-20-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Ferris Wheel Moments',
      caption: 'Peeche ghumta hua colorful jhoola aur saamne meri favorite insaan... aisi yaadein dil ke hamesha paas rehti hain. 🎡 💫 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Peeche ghumta hua colorful jhoola aur saamne meri favorite insaan... aisi yaadein dil ke hamesha paas rehti hain. 🎡 💫 🧿',
    title: 'Ferris Wheel Moments',
    rotation: -2.0,
  },
  {
    id: 'her-photo-06',
    index: 6,
    indexFormatted: '06 / 15',
    image: {
      id: 'photo-6',
      src: '/photos/photo-6.jpg',
      fallbackSrc: 'https://i.ibb.co/0jbq4wRN/Screenshot-2026-06-21-13-42-18-05-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'White Shirt Charm',
      caption: 'White shirt aur khule baal... aapka ye effortless mirror selfie look dil jeetne ke liye kaafi hai. 🧸 🤍 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'White shirt aur khule baal... aapka ye effortless mirror selfie look dil jeetne ke liye kaafi hai. 🧸 🤍 🧿',
    title: 'White Shirt Charm',
    rotation: 1.8,
  },
  {
    id: 'her-photo-07',
    index: 7,
    indexFormatted: '07 / 15',
    image: {
      id: 'photo-7',
      src: '/photos/photo-7.jpg',
      fallbackSrc: 'https://i.ibb.co/dwDjxkkg/Screenshot-2026-06-21-13-42-44-57-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Hills & Sunshine',
      caption: 'Pahadon ki thandi hawa aur terrace pe dhoop ki roshni... par sabse bright aur pyari aap hi lag rahi ho. ⛰️ ✨ 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Pahadon ki thandi hawa aur terrace pe dhoop ki roshni... par sabse bright aur pyari aap hi lag rahi ho. ⛰️ ✨ 🧿',
    title: 'Hills & Sunshine',
    rotation: -1.6,
  },
  {
    id: 'her-photo-08',
    index: 8,
    indexFormatted: '08 / 15',
    image: {
      id: 'photo-8',
      src: '/photos/photo-8.jpg',
      fallbackSrc: 'https://i.ibb.co/cSgc3SWj/Screenshot-2026-06-23-20-00-30-75-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Pretty in Pink',
      caption: 'Bright pink color aap par kitna khilta hai na... ek innocent si look jo hothon pe muskurahat le aaye. 💖 🦋 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Bright pink color aap par kitna khilta hai na... ek innocent si look jo hothon pe muskurahat le aaye. 💖 🦋 🧿',
    title: 'Pretty in Pink',
    rotation: 1.4,
  },
  {
    id: 'her-photo-09',
    index: 9,
    indexFormatted: '09 / 15',
    image: {
      id: 'photo-9',
      src: '/photos/photo-9.jpg',
      fallbackSrc: 'https://i.ibb.co/dJjyP4tv/Screenshot-2026-06-27-14-05-02-08-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Deep Purple Grace',
      caption: 'Ye dark purple kurti aur aapki ye ada... har frame mein ek alag hi tehraav aur khoobsurati dikhti hai. 💜 🌙 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Ye dark purple kurti aur aapki ye ada... har frame mein ek alag hi tehraav aur khoobsurati dikhti hai. 💜 🌙 🧿',
    title: 'Deep Purple Grace',
    rotation: -1.9,
  },
  {
    id: 'her-photo-10',
    index: 10,
    indexFormatted: '10 / 15',
    image: {
      id: 'photo-10',
      src: '/photos/photo-10.jpg',
      fallbackSrc: 'https://i.ibb.co/5hy19fCp/Screenshot-2026-06-30-13-59-00-77-a63b0f8076346d26cbdc1b971a1da2a7-2.jpg',
      title: 'Dil Ki Muskaan',
      caption: 'Jab aap aise bina kisi filter ke dil se muskurati ho, sach mein duniya ki sabse pyari ladki lagti ho. 🧿 ✨',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Jab aap aise bina kisi filter ke dil se muskurati ho, sach mein duniya ki sabse pyari ladki lagti ho. 🧿 ✨',
    title: 'Dil Ki Muskaan',
    rotation: 1.5,
  },
  {
    id: 'her-photo-11',
    index: 11,
    indexFormatted: '11 / 15',
    image: {
      id: 'photo-11',
      src: '/photos/photo-11.png',
      fallbackSrc: '/assets/aistudio/Screenshot__98__8cd25c36.png',
      title: 'Elegance in White',
      caption: 'White shirt aur ye calm si saadgi... bina kisi koshish ke sabse khoobsurat lagti ho. 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'White shirt aur ye calm si saadgi... bina kisi koshish ke sabse khoobsurat lagti ho. 🧿',
    title: 'Elegance in White',
    rotation: -1.7,
  },
  {
    id: 'her-photo-12',
    index: 12,
    indexFormatted: '12 / 15',
    image: {
      id: 'photo-12',
      src: '/photos/photo-12.png',
      fallbackSrc: '/assets/aistudio/Screenshot__104__1603d4da.png',
      title: 'Rosy Glow',
      caption: 'Wo pink cheeks aur ye pyaari si nazar... dil khud-b-khud keh deta hai "Mashallah". ✨ 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Wo pink cheeks aur ye pyaari si nazar... dil khud-b-khud keh deta hai "Mashallah". ✨ 🧿',
    title: 'Rosy Glow',
    rotation: 2.1,
  },
  {
    id: 'her-photo-13',
    index: 13,
    indexFormatted: '13 / 15',
    image: {
      id: 'photo-13',
      src: '/photos/photo-13.png',
      fallbackSrc: '/assets/aistudio/Screenshot__133__9ebf8b0d.png',
      title: 'Cozy Chic',
      caption: 'Full fit ek taraf aur aapki cuteness ek taraf... style toh aapka hamesha 10 on 10 hai! 💫',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Full fit ek taraf aur aapki cuteness ek taraf... style toh aapka hamesha 10 on 10 hai! 💫',
    title: 'Cozy Chic',
    rotation: -1.5,
  },
  {
    id: 'her-photo-14',
    index: 14,
    indexFormatted: '14 / 15',
    image: {
      id: 'photo-14',
      src: '/photos/photo-14.png',
      fallbackSrc: '/assets/aistudio/Screenshot__166__3858421c.png',
      title: 'Phoolon Sa Khilna',
      caption: 'Baalon mein laga wo chhota sa phool bhi aapki khoobsurati ke saamne feeka pad gaya. 🌸 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Baalon mein laga wo chhota sa phool bhi aapki khoobsurati ke saamne feeka pad gaya. 🌸 🧿',
    title: 'Phoolon Sa Khilna',
    rotation: 1.8,
  },
  {
    id: 'her-photo-15',
    index: 15,
    indexFormatted: '15 / 15',
    image: {
      id: 'photo-15',
      src: '/photos/photo-15.png',
      fallbackSrc: '/assets/aistudio/Screenshot__164__976b4aa2.png',
      title: 'Lake Breeze & You',
      caption: 'Shant paani, thandi hawayen aur aapki ye muskaan... jahan aap ho, sukoon bas wahin hai. 🌊 🧿',
      aspectRatio: 'portrait',
    },
    hinglishLine: 'Shant paani, thandi hawayen aur aapki ye muskaan... jahan aap ho, sukoon bas wahin hai. 🌊 🧿',
    title: 'Lake Breeze & You',
    rotation: -1.9,
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
