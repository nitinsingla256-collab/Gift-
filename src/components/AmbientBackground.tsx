import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  pulseSpeed: number;
  pulseOffset: number;
  colorType: 'champagne' | 'blush' | 'gold' | 'starlight';
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Low particle count for refined minimalism and battery efficiency
    const particleCount = Math.min(32, Math.floor((width * height) / 28000));
    const particles: Particle[] = [];

    const colors = {
      champagne: '230, 202, 156',
      blush: '217, 165, 160',
      gold: '201, 163, 94',
      starlight: '245, 242, 235',
    };

    for (let i = 0; i < particleCount; i++) {
      const typeKeys: (keyof typeof colors)[] = ['champagne', 'blush', 'gold', 'starlight'];
      const colorType = typeKeys[Math.floor(Math.random() * typeKeys.length)];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.6,
        baseAlpha: Math.random() * 0.35 + 0.1,
        alpha: Math.random() * 0.3 + 0.1,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.18 + 0.05), // Gentle upward drift
        pulseSpeed: Math.random() * 0.008 + 0.003,
        pulseOffset: Math.random() * Math.PI * 2,
        colorType,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric vignette & soft warm light glow in background
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, 'rgba(28, 23, 20, 0.45)');
      grad.addColorStop(0.5, 'rgba(14, 12, 11, 0.25)');
      grad.addColorStop(1, 'rgba(6, 5, 5, 0.85)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Gentle breathing opacity
        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.15;
        const currentAlpha = Math.max(0.04, Math.min(0.65, p.alpha));

        const rgb = colors[p.colorType];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${currentAlpha})`;
        ctx.fill();

        // Soft halo glow for larger particles
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${currentAlpha * 0.15})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep baseline background */}
      <div className="absolute inset-0 bg-[#060505]" />
      
      {/* Animated canvas with floating stardust */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Gentle ambient light sweeps */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-[110px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(230,202,156,0.3) 0%, rgba(217,165,160,0.15) 50%, transparent 80%)',
        }}
      />

      {/* Film grain texture */}
      <div className="absolute inset-0 film-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
};
