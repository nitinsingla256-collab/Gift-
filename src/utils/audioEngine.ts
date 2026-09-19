// Robust Audio Engine for background song playback (Preet Re)
type AudioStateListener = (isPlaying: boolean) => void;

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;
  private listeners: Set<AudioStateListener> = new Set();
  private userInteracted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      this.setupAutoUnlock();
    }
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.src = '/preet-re.mp3';
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = this.volume;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notifyListeners();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Primary audio source error, attempting secondary fallback...', e);
        if (this.audio && !this.audio.src.includes('Preet%20Re.mp3')) {
          this.audio.src = '/Preet%20Re.mp3';
          this.audio.load();
        }
      });

      this.initialized = true;
    } catch (err) {
      console.warn('AudioEngine initialization error:', err);
    }
  }

  private setupAutoUnlock() {
    const handleFirstInteraction = () => {
      this.userInteracted = true;
      if (this.audio && !this.isPlaying) {
        this.play().catch(() => {});
      }
      // Clean up event listeners once interacted
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isPlaying);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async play(): Promise<boolean> {
    if (!this.initialized) {
      this.initAudio();
    }
    if (!this.audio) return false;

    try {
      this.audio.volume = this.volume;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Audio play request prevented by browser policy or error:', err);
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    }
  }

  public pause(): void {
    if (!this.audio) return;
    try {
      this.audio.pause();
      this.isPlaying = false;
      this.notifyListeners();
    } catch (err) {
      console.warn('Audio pause error:', err);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play().catch(() => {});
      return true;
    }
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isAudioActive(): boolean {
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Compatibility aliases for existing components
  public startAmbientSynth() {
    return this.play();
  }

  public stopAmbientSynth() {
    this.pause();
  }

  public playCustomAudio() {
    return this.play();
  }

  public pauseCustomAudio() {
    this.pause();
  }

  public toggleMute(): boolean {
    return !this.toggle();
  }

  public getIsMuted(): boolean {
    return !this.isPlaying;
  }

  public setMuted(muted: boolean) {
    if (muted) {
      this.pause();
    } else {
      this.play().catch(() => {});
    }
  }

  public loadCustomAudio(_fileOrUrl: File | string): Promise<string> {
    return Promise.resolve('Preet Re');
  }
}

export const soundscapeEngine = new AudioEngine();
