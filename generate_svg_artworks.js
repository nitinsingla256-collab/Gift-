import fs from 'fs';

const shayaris = [
  {
    id: 1,
    file: 'shayari_1.svg',
    title: 'I. Moonlight & Gaze',
    themeGlow: '#e8d5b5',
    accentColor: '#f8c8d8',
    lines: [
      "Chandi sona ek taraf,",
      "Tere bina hona ek taraf,",
      "Ek taraf tere ye kaatil-numa aankhein,",
      "Jadon toona ek taraf."
    ],
    motif: `
      <!-- Moon & Celestial Elements -->
      <path d="M400,120 A30,30 0 1,0 435,165 A25,25 0 1,1 400,120 Z" fill="url(#goldGrad)" opacity="0.85" filter="url(#glow)"/>
      <circle cx="430" cy="130" r="2.5" fill="#f8c8d8" opacity="0.9"/>
      <circle cx="370" cy="140" r="1.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="445" cy="155" r="2" fill="#e8d5b5" opacity="0.7"/>
      <path d="M360,165 Q400,150 440,165" stroke="url(#goldGrad)" stroke-width="1" fill="none" opacity="0.4"/>
    `
  },
  {
    id: 2,
    file: 'shayari_2.svg',
    title: 'II. Unmatched Beauty',
    themeGlow: '#f8c8d8',
    accentColor: '#f8c8d8',
    lines: [
      "Jo jee bhar dekhne baithe usse, toh sharmaaya,",
      "Ek umar bhi kam lagti hai,",
      "Woh itni khoobsurat hai,",
      "Uske aage mujhe duniya ki",
      "Har khoobsurati feeki lagti hai."
    ],
    motif: `
      <!-- Blush Floral Petals & Bloom -->
      <g transform="translate(400, 140)" filter="url(#glow)">
        <path d="M0,0 C-15,-25 -35,-15 -25,10 C-15,35 15,35 25,10 C35,-15 15,-25 0,0 Z" fill="url(#pinkGrad)" opacity="0.75"/>
        <path d="M0,0 C-10,-18 -25,-10 -18,8 C-10,25 10,25 18,8 C25,-10 10,-18 0,0 Z" fill="url(#goldGrad)" opacity="0.8"/>
        <circle cx="0" cy="5" r="3.5" fill="#ffffff" opacity="0.9"/>
      </g>
      <circle cx="340" cy="150" r="2" fill="#f8c8d8" opacity="0.6"/>
      <circle cx="460" cy="145" r="2" fill="#f8c8d8" opacity="0.6"/>
    `
  },
  {
    id: 3,
    file: 'shayari_3.svg',
    title: 'III. Friendship to Forever',
    themeGlow: '#e8c07d',
    accentColor: '#f8c8d8',
    lines: [
      "Pehle thi dosti, phir pyaar hua,",
      "Baaton baaton mein",
      "Yeh izhaar hua,",
      "Woh kehte rahe mujhe,",
      "“Bhi achhi milegi tumko,”",
      "Par usse kya pata,",
      "Mujhe usse hi pyaar hua."
    ],
    motif: `
      <!-- Intertwined Feather & Destiny Lines -->
      <g transform="translate(400, 130)" filter="url(#glow)">
        <path d="M-40,15 C-20,-20 20,-20 40,15 C20,5 -20,5 -40,15 Z" fill="url(#goldGrad)" opacity="0.7"/>
        <path d="M0,-15 Q20,10 0,35 Q-20,10 0,-15" fill="none" stroke="url(#pinkGrad)" stroke-width="1.5" opacity="0.8"/>
        <circle cx="0" cy="10" r="3" fill="#ffffff"/>
      </g>
    `
  },
  {
    id: 4,
    file: 'shayari_4.svg',
    title: 'IV. Sanctuary of Love',
    themeGlow: '#f2b5ca',
    accentColor: '#f8c8d8',
    lines: [
      "Mere liye mohabbat ka",
      "Dusra naam tum ho,",
      "Meri zindagi ka safar tum ho,",
      "Mere dil mein rehne wali",
      "Tum ho,",
      "Meri zindagi ka antim",
      "Samay tum ho,",
      "Mujhe jiske khayal aate",
      "Hain, woh bhi tum ho,",
      "Mere liye sab kuch tum ho,",
      "Tum ho."
    ],
    motif: `
      <!-- Sacred Glowing Heart Sanctuary -->
      <g transform="translate(400, 125)" filter="url(#glow)">
        <path d="M0,15 C-25,-15 -50,10 0,45 C50,10 25,-15 0,15 Z" fill="url(#pinkGrad)" opacity="0.85"/>
        <circle cx="0" cy="22" r="2.5" fill="#ffffff" opacity="0.9"/>
      </g>
      <circle cx="340" cy="140" r="1.5" fill="#f8c8d8" opacity="0.5"/>
      <circle cx="460" cy="140" r="1.5" fill="#f8c8d8" opacity="0.5"/>
    `
  },
  {
    id: 5,
    file: 'shayari_5.svg',
    title: 'V. The Rose & The Book',
    themeGlow: '#e2a878',
    accentColor: '#f8c8d8',
    lines: [
      "Tod leta agar tu gulaab hoti,",
      "Padh leta tere un saare baaton ko",
      "Agar tu kitaab hoti,",
      "Pee leta teri un aankhon ko",
      "Agar tu sharaab hoti,",
      "Soch, woh lamha kya hota",
      "Jab tu mere saath hoti."
    ],
    motif: `
      <!-- Open Book & Rose Petal Silhouette -->
      <g transform="translate(400, 130)" filter="url(#glow)">
        <path d="M-35,15 Q-15,-5 0,5 Q15,-5 35,15 Q15,5 0,15 Q-15,5 -35,15 Z" fill="url(#goldGrad)" opacity="0.75"/>
        <path d="M0,5 L0,25" stroke="#f8c8d8" stroke-width="1.5" opacity="0.8"/>
        <circle cx="0" cy="-2" r="4" fill="url(#pinkGrad)" opacity="0.9"/>
      </g>
    `
  },
  {
    id: 6,
    file: 'shayari_6.svg',
    title: 'VI. Starlit Constellations',
    themeGlow: '#b5c7e8',
    accentColor: '#f8c8d8',
    lines: [
      "Sitaron se bhari woh raat pasand hai,",
      "Mujhe uski kahi har baat pasand hai,",
      "Tareef ke kaabil hain",
      "Uski zulfein bhi,",
      "Par mujhe zyada uski",
      "Aankhein pasand hain."
    ],
    motif: `
      <!-- Constellations & Beautiful Gaze Motif -->
      <g transform="translate(400, 135)" filter="url(#glow)">
        <path d="M-50,0 Q0,-25 50,0 Q0,25 -50,0 Z" stroke="url(#goldGrad)" stroke-width="1.5" fill="none" opacity="0.75"/>
        <circle cx="0" cy="0" r="7" fill="url(#pinkGrad)" opacity="0.85"/>
        <circle cx="0" cy="0" r="3" fill="#ffffff" opacity="0.95"/>
        <circle cx="-30" cy="-5" r="1.5" fill="#ffffff"/>
        <circle cx="30" cy="-5" r="1.5" fill="#ffffff"/>
      </g>
    `
  }
];

shayaris.forEach((item) => {
  const lineCount = item.lines.length;
  // Calculate text vertical placement
  const startY = lineCount <= 4 ? 400 : lineCount <= 5 ? 380 : lineCount <= 7 ? 360 : 330;
  const lineSpacing = lineCount <= 4 ? 65 : lineCount <= 5 ? 54 : lineCount <= 7 ? 46 : 38;
  const fontSize = lineCount <= 4 ? 32 : lineCount <= 5 ? 28 : lineCount <= 7 ? 24 : 21;

  const textNodes = item.lines
    .map((line, idx) => {
      const y = startY + idx * lineSpacing;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="'Playfair Display', 'Cinzel Decorative', 'Georgia', serif" font-size="${fontSize}" font-style="italic" font-weight="400" fill="#faf4ec" filter="url(#textShadow)" letter-spacing="0.8">${line}</text>`;
    })
    .join('\n      ');

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1066" width="100%" height="100%">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#191116"/>
      <stop offset="35%" stop-color="#120c10"/>
      <stop offset="70%" stop-color="#0a0608"/>
      <stop offset="100%" stop-color="#030203"/>
    </linearGradient>

    <linearGradient id="parchmentLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdfbf7" stop-opacity="0.04"/>
      <stop offset="50%" stop-color="#f5efe6" stop-opacity="0.01"/>
      <stop offset="100%" stop-color="#eadecc" stop-opacity="0.03"/>
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f9e6b3"/>
      <stop offset="35%" stop-color="#d4af37"/>
      <stop offset="70%" stop-color="#aa7c11"/>
      <stop offset="100%" stop-color="#f6df9a"/>
    </linearGradient>

    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd5e3"/>
      <stop offset="50%" stop-color="#f8c8d8"/>
      <stop offset="100%" stop-color="#e094ac"/>
    </linearGradient>

    <radialGradient id="ambientGlow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${item.themeGlow}" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="#f8c8d8" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.95"/>
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${item.themeGlow}" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="1066" rx="36" fill="url(#bgGrad)"/>
  <rect width="800" height="1066" rx="36" fill="url(#ambientGlow)"/>
  <rect width="800" height="1066" rx="36" fill="url(#parchmentLight)"/>

  <!-- Outer Double Gold Inset Borders -->
  <rect x="28" y="28" width="744" height="1010" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.45"/>
  <rect x="42" y="42" width="716" height="982" rx="18" fill="none" stroke="url(#pinkGrad)" stroke-width="0.8" stroke-dasharray="6,4" stroke-opacity="0.35"/>

  <!-- Ornate Corner Flourishes -->
  <!-- Top Left -->
  <g transform="translate(36, 36)">
    <path d="M0,40 L0,10 Q0,0 10,0 L40,0" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="8" cy="8" r="3" fill="#f8c8d8"/>
    <path d="M5,25 Q12,12 25,5" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.6"/>
  </g>
  <!-- Top Right -->
  <g transform="translate(764, 36) scale(-1, 1)">
    <path d="M0,40 L0,10 Q0,0 10,0 L40,0" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="8" cy="8" r="3" fill="#f8c8d8"/>
    <path d="M5,25 Q12,12 25,5" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.6"/>
  </g>
  <!-- Bottom Left -->
  <g transform="translate(36, 1030) scale(1, -1)">
    <path d="M0,40 L0,10 Q0,0 10,0 L40,0" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="8" cy="8" r="3" fill="#f8c8d8"/>
    <path d="M5,25 Q12,12 25,5" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.6"/>
  </g>
  <!-- Bottom Right -->
  <g transform="translate(764, 1030) scale(-1, -1)">
    <path d="M0,40 L0,10 Q0,0 10,0 L40,0" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="8" cy="8" r="3" fill="#f8c8d8"/>
    <path d="M5,25 Q12,12 25,5" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.6"/>
  </g>

  <!-- Top Header Badge -->
  <g transform="translate(400, 75)">
    <text x="0" y="0" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', serif" font-size="12" font-weight="600" fill="#f8c8d8" letter-spacing="4" opacity="0.9">SHAYARI FOLIO • 0${item.id} / 06</text>
    <line x1="-120" y1="-4" x2="-60" y2="-4" stroke="url(#goldGrad)" stroke-width="1" opacity="0.4"/>
    <line x1="60" y1="-4" x2="120" y2="-4" stroke="url(#goldGrad)" stroke-width="1" opacity="0.4"/>
  </g>

  <!-- Thematic Visual Motif Section -->
  ${item.motif}

  <!-- Header Flourish Divider -->
  <g transform="translate(400, 220)">
    <line x1="-140" y1="0" x2="-20" y2="0" stroke="url(#goldGrad)" stroke-width="1" opacity="0.5"/>
    <circle cx="0" cy="0" r="3" fill="#f8c8d8" filter="url(#glow)"/>
    <path d="M-8,-6 L0,0 L8,-6 L0,6 Z" fill="url(#goldGrad)" opacity="0.7"/>
    <line x1="20" y1="0" x2="140" y2="0" stroke="url(#goldGrad)" stroke-width="1" opacity="0.5"/>
  </g>

  <!-- Exact Handwritten Calligraphy Verses -->
  <g id="poetry-text">
    ${textNodes}
  </g>

  <!-- Bottom Divider Flourish -->
  <g transform="translate(400, 930)">
    <line x1="-100" y1="0" x2="-15" y2="0" stroke="url(#pinkGrad)" stroke-width="1" opacity="0.4"/>
    <text x="0" y="4" text-anchor="middle" font-size="14" fill="#f8c8d8" opacity="0.9">🧿</text>
    <line x1="15" y1="0" x2="100" y2="0" stroke="url(#pinkGrad)" stroke-width="1" opacity="0.4"/>
  </g>

  <!-- Bottom Chapter Title -->
  <text x="400" y="975" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', serif" font-size="11" fill="#9c8992" letter-spacing="3" opacity="0.8">${item.title.toUpperCase()}</text>
</svg>`;

  fs.writeFileSync(`public/artworks/${item.file}`, svgContent, 'utf8');
  console.log(`Generated public/artworks/${item.file}`);
});
