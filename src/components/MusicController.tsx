import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Upload, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundscapeEngine } from '../utils/audioEngine';

export const MusicController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [customTrack, setCustomTrack] = useState<string | null>(null);
  const [mode, setMode] = useState<'ambient' | 'custom'>('ambient');

  const togglePlay = () => {
    if (isPlaying) {
      if (mode === 'ambient') {
        soundscapeEngine.stopAmbientSynth();
      } else {
        soundscapeEngine.pauseCustomAudio();
      }
      setIsPlaying(false);
    } else {
      if (mode === 'ambient') {
        soundscapeEngine.startAmbientSynth();
      } else {
        soundscapeEngine.playCustomAudio();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundscapeEngine.setMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
      soundscapeEngine.setMuted(false);
    }
    soundscapeEngine.setVolume(val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const trackName = await soundscapeEngine.loadCustomAudio(file);
        setCustomTrack(trackName);
        setMode('custom');
        if (isPlaying) {
          soundscapeEngine.stopAmbientSynth();
          soundscapeEngine.playCustomAudio();
        }
      } catch (err) {
        console.error('Audio load error:', err);
      }
    }
  };

  const switchToAmbient = () => {
    if (mode === 'ambient') return;
    setMode('ambient');
    if (isPlaying) {
      soundscapeEngine.pauseCustomAudio();
      soundscapeEngine.startAmbientSynth();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundscapeEngine.stopAmbientSynth();
      soundscapeEngine.pauseCustomAudio();
    };
  }, []);

  return (
    <div id="music-controller-root" className="fixed top-4 right-4 z-40">
      {/* Collapsed Pill Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex items-center"
      >
        <button
          id="music-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Soundscape Controls"
          className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12100f]/80 backdrop-blur-md border border-[#2a2420]/80 text-[#c8beaf] hover:text-[#f2ebe1] hover:border-[#4d4036] transition-all duration-300 shadow-sm"
        >
          {/* Subtle audio visualizer bars when playing */}
          <div className="flex items-center gap-[2.5px] h-3 w-3 justify-center">
            {isPlaying && !isMuted ? (
              <>
                <motion.span
                  animate={{ height: ['3px', '11px', '4px', '9px', '3px'] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="w-[1.5px] bg-[#d4af78] rounded-full"
                />
                <motion.span
                  animate={{ height: ['8px', '4px', '12px', '5px', '8px'] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                  className="w-[1.5px] bg-[#d9a5a0] rounded-full"
                />
                <motion.span
                  animate={{ height: ['4px', '10px', '3px', '8px', '4px'] }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: 0.4, ease: 'easeInOut' }}
                  className="w-[1.5px] bg-[#e6ca9c] rounded-full"
                />
              </>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5c524a] group-hover:bg-[#8c7e73] transition-colors" />
            )}
          </div>

          <span className="text-[11px] tracking-wider uppercase font-light text-[#9e9286] group-hover:text-[#d6ccc0] transition-colors">
            {isPlaying ? (mode === 'ambient' ? 'Atmosphere' : 'Music') : 'Sound'}
          </span>
        </button>
      </motion.div>

      {/* Expanded Control Modal / Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute top-10 right-0 w-[270px] mt-2 p-4 rounded-2xl bg-[#0e0c0b]/95 backdrop-blur-xl border border-[#2a2420] text-[#e6e0d4] shadow-2xl shadow-black/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1815]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af78]" />
                <span className="text-xs font-serif-luxury tracking-widest text-[#d8cfc4]">
                  Sound Atmosphere
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[11px] text-[#786d63] hover:text-[#b0a498] transition-colors p-1"
                aria-label="Close sound menu"
              >
                ✕
              </button>
            </div>

            {/* Playback Controls */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <button
                id="audio-main-play-btn"
                onClick={togglePlay}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1a1715] hover:bg-[#25201d] border border-[#332b25] text-xs text-[#e8e1d5] transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#d4af78]" />
                    <span>Pause Sound</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#d4af78] fill-[#d4af78]" />
                    <span>Play Atmosphere</span>
                  </>
                )}
              </button>

              <button
                id="audio-mute-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-2 rounded-lg bg-[#1a1715] hover:bg-[#25201d] border border-[#332b25] text-[#b5a99c] transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#d9a5a0]" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="py-2">
              <div className="flex justify-between text-[10px] text-[#85796f] mb-1.5 uppercase tracking-wider">
                <span>Volume</span>
                <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume slider"
                className="w-full h-1 bg-[#241f1c] rounded-lg appearance-none cursor-pointer accent-[#d4af78]"
              />
            </div>

            {/* Soundscape Type Switcher */}
            <div className="pt-3 mt-1 border-t border-[#1c1815] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <button
                  onClick={switchToAmbient}
                  className={`text-left transition-colors flex items-center gap-1.5 ${
                    mode === 'ambient' ? 'text-[#e6ca9c]' : 'text-[#7d7166] hover:text-[#a89b8d]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${mode === 'ambient' ? 'bg-[#e6ca9c]' : 'bg-transparent'}`} />
                  Ethereal Meditation Drone
                </button>
              </div>

              {/* Custom Track Architecture Slot */}
              <div className="relative mt-1">
                <label
                  htmlFor="custom-audio-upload"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#141211] border border-[#231e1a] hover:border-[#38302a] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {customTrack ? (
                      <Music className="w-3.5 h-3.5 text-[#d9a5a0] flex-shrink-0" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#73685e] group-hover:text-[#a6998d] flex-shrink-0" />
                    )}
                    <span className="text-[10.5px] truncate text-[#9e9185] group-hover:text-[#cfc3b6]">
                      {customTrack ? customTrack : 'Add Personal Song (MP3)'}
                    </span>
                  </div>
                  <span className="text-[9.5px] text-[#5e544c] group-hover:text-[#8a7c70] flex-shrink-0 ml-1">
                    {customTrack ? 'Change' : 'Browse'}
                  </span>
                </label>
                <input
                  id="custom-audio-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
