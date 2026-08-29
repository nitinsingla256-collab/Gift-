class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Create a single HTML5 audio element
      this.audio = new Audio('https://archive.org/download/Classical_Sampler-9615/Kevin_MacLeod_-_Canon_in_D_Major.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.25;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
      });
      
      this.audio.addEventListener('error', () => {
        this.isPlaying = false;
      });
    }
  }

  public startAmbientSynth() {
    this.playCustomAudio();
  }

  public stopAmbientSynth() {
    this.pauseCustomAudio();
  }

  public setVolume(val: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, val));
    }
  }

  public loadCustomAudio(_fileOrUrl: File | string): Promise<string> {
    return Promise.resolve('Ambient Soundscape');
  }

  public playCustomAudio() {
    if (!this.audio || this.isMuted) return;
    
    // Only attempt to play if we are paused
    if (this.audio.paused) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Gracefully handle browser autoplay blocks or missing files
          this.isPlaying = false;
        });
      }
    }
  }

  public pauseCustomAudio() {
    if (!this.audio) return;
    if (!this.audio.paused) {
      this.audio.pause();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.pauseCustomAudio();
    } else {
      this.playCustomAudio();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public isAudioActive(): boolean {
    return this.isPlaying && !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundscapeEngine = new AudioEngine();
