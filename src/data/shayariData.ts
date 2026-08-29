export interface ShayariArtworkData {
  id: number;
  numberFormatted: string;
  theme: string;
  subTitle: string;
  imageSrc: string;
  lines: string[];
  visualMotif: 'celestial_moon' | 'blush_florals' | 'intertwined_destiny' | 'infinite_love' | 'rose_and_book' | 'starlit_night';
  parchmentTone: {
    base: string;
    border: string;
    glow: string;
    accent: string;
    decorColor: string;
  };
}

export const SHAYARIS: ShayariArtworkData[] = [
  {
    id: 1,
    numberFormatted: '01 / 06',
    theme: 'Moonlight & Enthralling Gaze',
    subTitle: 'A spell cast in silver & gold',
    imageSrc: '/artworks/shayari_1.svg',
    lines: [
      'Chandi sona ek taraf,',
      'Tere bina hona ek taraf,',
      'Ek taraf tere ye kaatil-numa aankhein,',
      'Jadon toona ek taraf.'
    ],
    visualMotif: 'celestial_moon',
    parchmentTone: {
      base: 'from-[#1c1418]/90 via-[#150e12]/95 to-[#0b0709]',
      border: 'border-[#e8d5b5]/30',
      glow: 'rgba(232, 213, 181, 0.15)',
      accent: '#f8c8d8',
      decorColor: '#e8d5b5',
    }
  },
  {
    id: 2,
    numberFormatted: '02 / 06',
    theme: 'Unmatched Beauty',
    subTitle: 'Where time stands completely still',
    imageSrc: '/artworks/shayari_2.svg',
    lines: [
      'Jo jee bhar dekhne baithe usse, toh sharmaaya,',
      'Ek umar bhi kam lagti hai,',
      'Woh itni khoobsurat hai,',
      'Uske aage mujhe duniya ki',
      'Har khoobsurati feeki lagti hai.'
    ],
    visualMotif: 'blush_florals',
    parchmentTone: {
      base: 'from-[#1f1218]/90 via-[#160d13]/95 to-[#0d070b]',
      border: 'border-[#f8c8d8]/30',
      glow: 'rgba(248, 200, 216, 0.18)',
      accent: '#f8c8d8',
      decorColor: '#f3d2c1',
    }
  },
  {
    id: 3,
    numberFormatted: '03 / 06',
    theme: 'Friendship to Forever',
    subTitle: 'Words unsaid turning into love',
    imageSrc: '/artworks/shayari_3.svg',
    lines: [
      'Pehle thi dosti, phir pyaar hua,',
      'Baaton baaton mein',
      'Yeh izhaar hua,',
      'Woh kehte rahe mujhe,',
      '“Bhi achhi milegi tumko,”',
      'Par usse kya pata,',
      'Mujhe usse hi pyaar hua.'
    ],
    visualMotif: 'intertwined_destiny',
    parchmentTone: {
      base: 'from-[#1a1115]/90 via-[#130b10]/95 to-[#0a0608]',
      border: 'border-[#e8c07d]/30',
      glow: 'rgba(232, 192, 125, 0.15)',
      accent: '#f8c8d8',
      decorColor: '#e8c07d',
    }
  },
  {
    id: 4,
    numberFormatted: '04 / 06',
    theme: 'The Sanctuary of My Heart',
    subTitle: 'Every thought begins and ends in you',
    imageSrc: '/artworks/shayari_4.svg',
    lines: [
      'Mere liye mohabbat ka',
      'Dusra naam tum ho,',
      'Meri zindagi ka safar tum ho,',
      'Mere dil mein rehne wali',
      'Tum ho,',
      'Meri zindagi ka antim',
      'Samay tum ho,',
      'Mujhe jiske khayal aate',
      'Hain, woh bhi tum ho,',
      'Mere liye sab kuch tum ho,',
      'Tum ho.'
    ],
    visualMotif: 'infinite_love',
    parchmentTone: {
      base: 'from-[#221019]/90 via-[#180a12]/95 to-[#0c0509]',
      border: 'border-[#f2b5ca]/35',
      glow: 'rgba(242, 181, 202, 0.2)',
      accent: '#f8c8d8',
      decorColor: '#f9d2de',
    }
  },
  {
    id: 5,
    numberFormatted: '05 / 06',
    theme: 'The Rose & The Book',
    subTitle: 'A timeless chapter waiting to be lived',
    imageSrc: '/artworks/shayari_5.svg',
    lines: [
      'Tod leta agar tu gulaab hoti,',
      'Padh leta tere un saare baaton ko',
      'Agar tu kitaab hoti,',
      'Pee leta teri un aankhon ko',
      'Agar tu sharaab hoti,',
      'Soch, woh lamha kya hota',
      'Jab tu mere saath hoti.'
    ],
    visualMotif: 'rose_and_book',
    parchmentTone: {
      base: 'from-[#201014]/90 via-[#160a0e]/95 to-[#0c0507]',
      border: 'border-[#e2a878]/30',
      glow: 'rgba(226, 168, 120, 0.18)',
      accent: '#f8c8d8',
      decorColor: '#e2a878',
    }
  },
  {
    id: 6,
    numberFormatted: '06 / 06',
    theme: 'Under the Starlit Sky',
    subTitle: 'Those mesmerizing eyes above all constellations',
    imageSrc: '/artworks/shayari_6.svg',
    lines: [
      'Sitaron se bhari woh raat pasand hai,',
      'Mujhe uski kahi har baat pasand hai,',
      'Tareef ke kaabil hain',
      'Uski zulfein bhi,',
      'Par mujhe zyada uski',
      'Aankhein pasand hain.'
    ],
    visualMotif: 'starlit_night',
    parchmentTone: {
      base: 'from-[#0f1422]/90 via-[#0a0d17]/95 to-[#04060b]',
      border: 'border-[#b5c7e8]/30',
      glow: 'rgba(181, 199, 232, 0.18)',
      accent: '#f8c8d8',
      decorColor: '#d6e2f7',
    }
  }
];
