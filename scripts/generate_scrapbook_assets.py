import subprocess
import os

os.makedirs('public/scrapbook', exist_ok=True)

commands = {
    # 1. Wax Seal: Realistic crimson wax with golden embossed heart & nazar
    'waxSeal.webp': '''convert -size 280x280 xc:none \
        -fill '#7f1d1d' -draw "circle 140,140 140,25" \
        -fill '#991b1b' -draw "circle 140,140 140,32" \
        -fill '#b91c1c' -draw "circle 140,140 140,42" \
        -fill '#dc2626' -draw "circle 136,136 136,46" \
        -fill '#7f1d1d' -draw "circle 140,140 140,65" \
        -fill '#991b1b' -draw "circle 140,140 140,75" \
        -fill '#d97706' -stroke '#b45309' -strokewidth 3 -draw "circle 140,140 140,88" \
        -fill '#fbbf24' -stroke '#d97706' -strokewidth 2 \
        -draw "path 'M 140,105 C 130,90 105,90 105,115 C 105,140 140,165 140,165 C 140,165 175,140 175,115 C 175,90 150,90 140,105 Z'" \
        -fill '#1e40af' -stroke '#3b82f6' -strokewidth 1.5 -draw "circle 140,126 140,116" \
        -fill '#ffffff' -stroke 'none' -draw "circle 140,126 140,121" \
        -fill '#0f172a' -draw "circle 140,126 140,123.5" \
        -fill '#ffffff' -draw "circle 138.5,124.5 138.5,123.5" \
        -fill '#7f1d1d' -stroke 'none' -draw "path 'M 125,245 C 120,265 135,275 140,275 C 145,275 160,265 155,245 Z'" \
        public/scrapbook/waxSeal.webp''',

    # 2. Birthday Cake
    'cake.webp': '''convert -size 280x280 xc:none \
        -fill '#fce7f3' -stroke '#f472b6' -strokewidth 3 -draw "roundrectangle 40,180 240,240 15,15" \
        -fill '#fb7185' -stroke 'none' -draw "path 'M 40,180 Q 60,195 80,180 Q 100,195 120,180 Q 140,195 160,180 Q 180,195 200,180 Q 220,195 240,180 L 240,195 L 40,195 Z'" \
        -fill '#fdf2f8' -stroke '#f472b6' -strokewidth 3 -draw "roundrectangle 70,120 210,180 12,12" \
        -fill '#f43f5e' -stroke 'none' -draw "path 'M 70,120 Q 90,135 110,120 Q 130,135 150,120 Q 170,135 190,120 Q 200,130 210,120 L 210,135 L 70,135 Z'" \
        -fill '#ffe4e6' -stroke '#fb7185' -strokewidth 2.5 -draw "roundrectangle 100,75 180,120 10,10" \
        -fill '#fbcfe8' -draw "rectangle 136,45 144,75" \
        -fill '#fbbf24' -stroke '#f59e0b' -strokewidth 2 -draw "path 'M 140,25 C 132,38 135,46 140,46 C 145,46 148,38 140,25 Z'" \
        -fill '#ffffff' -draw "circle 139,38 139,36" \
        -fill '#e11d48' -draw "circle 105,75 105,70" \
        -fill '#e11d48' -draw "circle 175,75 175,70" \
        -fill '#e11d48' -draw "circle 140,75 140,70" \
        public/scrapbook/cake.webp''',

    # 3. Party Popper
    'partyPopper.webp': '''convert -size 280x280 xc:none \
        -fill '#fbbf24' -stroke '#f59e0b' -strokewidth 3 -draw "polygon 70,240 180,240 125,130" \
        -fill '#f43f5e' -draw "polygon 85,240 125,130 110,240" \
        -fill '#ec4899' -draw "circle 100,80 100,72" \
        -fill '#3b82f6' -draw "circle 160,95 160,88" \
        -fill '#10b981' -draw "circle 70,110 70,103" \
        -fill '#f59e0b' -draw "circle 190,130 190,124" \
        -fill '#8b5cf6' -stroke '#a855f7' -strokewidth 2 -draw "path 'M 125,130 Q 140,70 170,40' -stroke-width 4" \
        -fill '#f43f5e' -stroke '#fb7185' -draw "path 'M 125,130 Q 90,60 60,50' -stroke-width 4" \
        -fill '#fbbf24' -stroke 'none' -draw "polygon 130,30 135,45 150,45 137,55 142,70 130,60 118,70 123,55 110,45 125,45" \
        public/scrapbook/partyPopper.webp''',

    # 4. Teddy Bear
    'teddy.webp': '''convert -size 280x280 xc:none \
        -fill '#b45309' -stroke '#78350f' -strokewidth 3 -draw "circle 80,70 80,45" \
        -fill '#fde68a' -draw "circle 80,70 80,55" \
        -fill '#b45309' -stroke '#78350f' -strokewidth 3 -draw "circle 200,70 200,45" \
        -fill '#fde68a' -draw "circle 200,70 200,55" \
        -fill '#b45309' -stroke '#78350f' -strokewidth 3 -draw "circle 140,195 140,130" \
        -fill '#b45309' -stroke '#78350f' -strokewidth 3 -draw "circle 140,115 140,60" \
        -fill '#fde68a' -draw "ellipse 140,130 35,25 0,360" \
        -fill '#1f2937' -draw "circle 118,105 118,99" \
        -fill '#1f2937' -draw "circle 162,105 162,99" \
        -fill '#ffffff' -draw "circle 116,103 116,101" \
        -fill '#ffffff' -draw "circle 160,103 160,101" \
        -fill '#78350f' -draw "polygon 140,126 130,118 150,118" \
        -fill '#e11d48' -stroke '#be123c' -strokewidth 2 -draw "polygon 140,165 115,150 115,180" \
        -fill '#e11d48' -stroke '#be123c' -strokewidth 2 -draw "polygon 140,165 165,150 165,180" \
        -fill '#be123c' -draw "circle 140,165 140,157" \
        -fill '#f43f5e' -stroke 'none' -draw "path 'M 140,190 C 135,180 120,180 120,195 C 120,210 140,225 140,225 C 140,225 160,210 160,195 C 160,180 145,180 140,190 Z'" \
        public/scrapbook/teddy.webp''',

    # 5. Cheers Clinking Glasses
    'cheers.webp': '''convert -size 280x280 xc:none \
        -fill '#fef08a' -stroke '#f59e0b' -strokewidth 2.5 -draw "path 'M 95,70 L 130,130 L 115,140 L 80,80 Z'" \
        -fill '#fde047' -draw "path 'M 90,85 L 122,133 L 112,138 L 80,90 Z'" \
        -fill '#fef08a' -stroke '#f59e0b' -strokewidth 2.5 -draw "path 'M 185,70 L 150,130 L 165,140 L 200,80 Z'" \
        -fill '#fde047' -draw "path 'M 190,85 L 158,133 L 168,138 L 200,90 Z'" \
        -stroke '#f59e0b' -strokewidth 3 -draw "line 122,135 105,190" -draw "line 158,135 175,190" \
        -fill '#f59e0b' -draw "ellipse 100,195 20,6 0,360" -draw "ellipse 180,195 20,6 0,360" \
        -fill '#fbbf24' -stroke 'none' -draw "polygon 140,50 144,62 156,62 146,70 150,82 140,74 130,82 134,70 124,62 136,62" \
        -fill '#f43f5e' -draw "circle 115,45 115,41" \
        -fill '#ec4899' -draw "circle 165,45 165,41" \
        public/scrapbook/cheers.webp''',

    # 6. Vintage Retro Camera
    'camera.webp': '''convert -size 280x280 xc:none \
        -fill '#fce7f3' -stroke '#f472b6' -strokewidth 3.5 -draw "roundrectangle 40,80 240,220 20,20" \
        -fill '#fb7185' -stroke 'none' -draw "roundrectangle 40,80 240,120 20,20" \
        -fill '#374151' -stroke '#1f2937' -strokewidth 3 -draw "circle 140,150 140,95" \
        -fill '#60a5fa' -stroke '#2563eb' -strokewidth 2 -draw "circle 140,150 140,115" \
        -fill '#ffffff' -stroke 'none' -draw "circle 128,138 128,124" \
        -fill '#e11d48' -draw "roundrectangle 60,60 100,80 6,6" \
        -fill '#d1d5db' -draw "roundrectangle 190,65 220,80 4,4" \
        -fill '#fbbf24' -draw "circle 75,100 75,93" \
        public/scrapbook/camera.webp''',

    # 7. Gift Box
    'gift.webp': '''convert -size 280x280 xc:none \
        -fill '#fda4af' -stroke '#f43f5e' -strokewidth 3 -draw "roundrectangle 50,110 230,240 12,12" \
        -fill '#fb7185' -stroke '#f43f5e' -strokewidth 3 -draw "roundrectangle 40,90 240,125 8,8" \
        -fill '#fbbf24' -stroke '#d97706' -strokewidth 2 -draw "rectangle 125,90 155,240" \
        -fill '#fbbf24' -stroke '#d97706' -strokewidth 2 -draw "rectangle 40,155 240,185" \
        -fill '#fbbf24' -stroke '#d97706' -strokewidth 2.5 -draw "path 'M 140,90 C 120,40 70,50 85,75 C 95,90 125,90 140,90 Z'" \
        -fill '#fbbf24' -stroke '#d97706' -strokewidth 2.5 -draw "path 'M 140,90 C 160,40 210,50 195,75 C 185,90 155,90 140,90 Z'" \
        -fill '#f59e0b' -stroke 'none' -draw "circle 140,90 140,80" \
        public/scrapbook/gift.webp''',

    # 8. Red Rose / Flower
    'redflower.webp': '''convert -size 280x280 xc:none \
        -fill '#15803d' -stroke '#166534' -strokewidth 3 -draw "path 'M 140,180 Q 140,240 140,260' -stroke-width 6" \
        -fill '#22c55e' -stroke '#15803d' -strokewidth 2 -draw "ellipse 110,210 30,15 30,390" \
        -fill '#22c55e' -stroke '#15803d' -strokewidth 2 -draw "ellipse 170,225 30,15 -30,330" \
        -fill '#991b1b' -stroke '#7f1d1d' -strokewidth 2 -draw "circle 140,120 140,55" \
        -fill '#b91c1c' -draw "circle 135,115 135,65" \
        -fill '#dc2626' -draw "circle 142,122 142,80" \
        -fill '#ef4444' -draw "circle 138,118 138,92" \
        -fill '#f87171' -draw "circle 140,120 140,105" \
        -fill '#fee2e2' -draw "circle 137,117 137,112" \
        public/scrapbook/redflower.webp''',

    # 9. Cherry Sticker
    'cherry.webp': '''convert -size 280x280 xc:none \
        -fill 'none' -stroke '#15803d' -strokewidth 5 -draw "path 'M 100,160 Q 120,80 160,60' -stroke-width 6" \
        -fill 'none' -stroke '#15803d' -strokewidth 5 -draw "path 'M 180,170 Q 165,100 160,60' -stroke-width 6" \
        -fill '#22c55e' -stroke '#15803d' -strokewidth 2 -draw "ellipse 190,70 30,12 15,375" \
        -fill '#be123c' -stroke '#881337' -strokewidth 3 -draw "circle 100,180 100,135" \
        -fill '#e11d48' -draw "circle 96,176 96,140" \
        -fill '#ffffff' -draw "circle 86,166 86,156" \
        -fill '#be123c' -stroke '#881337' -strokewidth 3 -draw "circle 180,190 180,145" \
        -fill '#e11d48' -draw "circle 176,186 176,150" \
        -fill '#ffffff' -draw "circle 166,176 166,166" \
        public/scrapbook/cherry.webp''',

    # 10. Corner Floral Garland (decoration.webp)
    'decoration.webp': '''convert -size 400x300 xc:none \
        -fill 'none' -stroke '#86efac' -strokewidth 4 -draw "path 'M 10,10 Q 150,50 250,20 T 380,100' -stroke-width 5" \
        -fill '#4ade80' -stroke '#16a34a' -strokewidth 1.5 -draw "ellipse 80,35 22,10 25,385" \
        -fill '#4ade80' -stroke '#16a34a' -strokewidth 1.5 -draw "ellipse 180,30 22,10 -20,340" \
        -fill '#4ade80' -stroke '#16a34a' -strokewidth 1.5 -draw "ellipse 300,50 24,11 40,400" \
        -fill '#f472b6' -stroke '#db2777' -strokewidth 2 -draw "circle 130,45 130,22" \
        -fill '#fbcfe8' -draw "circle 130,45 130,30" \
        -fill '#f59e0b' -draw "circle 130,45 130,38" \
        -fill '#fb7185' -stroke '#e11d48' -strokewidth 2 -draw "circle 240,30 240,10" \
        -fill '#ffe4e6' -draw "circle 240,30 240,18" \
        -fill '#fbbf24' -draw "circle 240,30 240,25" \
        public/scrapbook/decoration.webp''',

    # 11. Decoration 1
    'decoration1.webp': '''convert -size 300x300 xc:none \
        -fill '#fbcfe8' -stroke '#f472b6' -strokewidth 2 -draw "path 'M 30,150 Q 150,30 270,150 Q 150,270 30,150 Z'" \
        -fill '#fbbf24' -stroke 'none' -draw "circle 150,150 150,130" \
        -fill '#f43f5e' -draw "path 'M 150,135 C 145,125 130,125 130,140 C 130,155 150,170 150,170 C 150,170 170,155 170,140 C 170,125 155,125 150,135 Z'" \
        public/scrapbook/decoration1.webp''',

    # 12. Decoration 2
    'decoration2.webp': '''convert -size 300x300 xc:none \
        -fill 'none' -stroke '#fda4af' -strokewidth 4 -draw "circle 150,150 150,50" \
        -fill '#f43f5e' -stroke 'none' -draw "circle 150,50 150,38" \
        -fill '#f43f5e' -draw "circle 250,150 250,138" \
        -fill '#f43f5e' -draw "circle 150,250 150,238" \
        -fill '#f43f5e' -draw "circle 50,150 50,38" \
        -fill '#fbbf24' -draw "polygon 150,120 156,138 174,138 160,150 165,168 150,156 135,168 140,150 126,138 144,138" \
        public/scrapbook/decoration2.webp''',

    # 13. Flower 1
    'flower1.webp': '''convert -size 280x280 xc:none \
        -fill '#fce7f3' -stroke '#f472b6' -strokewidth 2.5 \
        -draw "ellipse 140,80 25,45 0,360" \
        -draw "ellipse 140,200 25,45 0,360" \
        -draw "ellipse 80,140 45,25 0,360" \
        -draw "ellipse 200,140 45,25 0,360" \
        -draw "ellipse 95,95 25,45 45,405" \
        -draw "ellipse 185,185 25,45 45,405" \
        -draw "ellipse 185,95 25,45 -45,315" \
        -draw "ellipse 95,185 25,45 -45,315" \
        -fill '#fbbf24' -stroke '#f59e0b' -strokewidth 3 -draw "circle 140,140 140,105" \
        -fill '#ffffff' -stroke 'none' -draw "circle 132,132 132,126" \
        public/scrapbook/flower1.webp''',

    # 14. Tulip
    'tulip.webp': '''convert -size 280x280 xc:none \
        -fill 'none' -stroke '#16a34a' -strokewidth 6 -draw "path 'M 140,150 Q 135,220 140,260' -stroke-width 7" \
        -fill '#22c55e' -stroke '#15803d' -strokewidth 2 -draw "ellipse 170,210 35,16 35,395" \
        -fill '#fb7185' -stroke '#e11d48' -strokewidth 3 -draw "ellipse 140,100 45,55 0,360" \
        -fill '#f43f5e' -draw "ellipse 115,105 32,50 20,380" \
        -fill '#f43f5e' -draw "ellipse 165,105 32,50 -20,340" \
        -fill '#ffe4e6' -stroke 'none' -draw "circle 130,85 130,76" \
        public/scrapbook/tulip.webp''',

    # 15. Cloud Background
    'cloudBg.webp': '''convert -size 500x500 xc:'#fdfbf7' \
        -fill '#f0f9ff' -draw "circle 100,100 100,20" -draw "circle 150,110 150,40" \
        -fill '#eff6ff' -draw "circle 350,300 350,220" -draw "circle 420,320 420,250" \
        -fill '#fdf2f8' -draw "circle 200,400 200,320" \
        public/scrapbook/cloudBg.webp''',

    # 16. Newspaper Background
    'newsPaperBg.webp': '''convert -size 500x500 xc:'#fdfbf6' \
        -stroke '#f3e8d2' -strokewidth 1.5 \
        -draw "line 40,40 460,40" -draw "line 40,60 460,60" -draw "line 40,80 460,80" \
        -draw "line 40,120 220,120" -draw "line 40,140 220,140" -draw "line 40,160 220,160" \
        -draw "line 260,120 460,120" -draw "line 260,140 460,140" -draw "line 260,160 460,160" \
        -draw "line 40,220 460,220" -draw "line 40,240 460,240" -draw "line 40,260 460,260" \
        public/scrapbook/newsPaperBg.webp''',

    # 17. Star Background
    'starBg.webp': '''convert -size 500x500 xc:'#1e1b4b' \
        -fill '#fbbf24' -draw "circle 100,100 100,98" -draw "circle 250,60 250,57" \
        -draw "circle 420,120 420,118" -draw "circle 80,300 80,297" \
        -draw "circle 320,380 320,377" -draw "circle 450,420 450,417" \
        -fill '#fef08a' -draw "circle 180,220 180,216" -draw "circle 380,250 380,246" \
        public/scrapbook/starBg.webp''',

    # 18. Cherry Background
    'cherryBg.webp': '''convert -size 500x500 xc:'#fef7f9' \
        -fill '#f43f5e' -draw "circle 100,100 100,94" -draw "circle 112,102 112,96" \
        -fill '#16a34a' -draw "line 100,94 106,85" -draw "line 112,96 106,85" \
        -fill '#f43f5e' -draw "circle 300,200 300,194" -draw "circle 312,202 312,196" \
        -fill '#16a34a' -draw "line 300,194 306,185" -draw "line 312,196 306,185" \
        -fill '#f43f5e' -draw "circle 150,380 150,374" -draw "circle 162,382 162,376" \
        -fill '#16a34a' -draw "line 150,374 156,365" -draw "line 162,376 156,365" \
        -fill '#f43f5e' -draw "circle 400,400 400,394" -draw "circle 412,402 412,396" \
        -fill '#16a34a' -draw "line 400,394 406,385" -draw "line 412,396 406,385" \
        public/scrapbook/cherryBg.webp''',
}

for name, cmd in commands.items():
    try:
        subprocess.run(cmd, shell=True, check=True)
        print(f"Generated {name}")
    except Exception as e:
        print(f"Error {name}: {e}")
