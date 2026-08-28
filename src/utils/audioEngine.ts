/**
 * Ambient Ethereal Soundscape Engine
 * Ultra-soft, whisper-quiet, romantic cinematic warm ambient chord drone
 * Zero harsh frequencies, zero abrupt clicks, soft exponential fade-in / fade-out
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isSynthRunning: boolean = false;
  private isMuted: boolean = false;
  private targetVolume: number = 0.15; // Soft and unobtrusive

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      // Master Gain for smooth volume control
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Warm, velvety lowpass filter removing all harshness and high frequencies
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(180, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public startAmbientSynth() {
    try {
      this.initContext();
      if (!this.ctx || !this.filter || !this.masterGain || this.isSynthRunning) return;

      // Soft harmonic chord in D Major / B Minor ethereal tuning (D 146.8Hz, A 220Hz, F# 185Hz, D 73.4Hz)
      const freqs = [73.42, 146.83, 185.00, 220.00, 293.66];
      this.oscillators = [];

      const now = this.ctx.currentTime;

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Pure sine waves only - warmest, smoothest acoustic profile
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle organic phase drift (prevents phase cancellation, sounds like gentle strings)
        const detuneCents = (idx - 2) * 2.5;
        osc.detune.setValueAtTime(detuneCents, now);

        // Extremely low individual gain
        const gainVal = 0.035 / (idx + 1);
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.exponentialRampToValueAtTime(gainVal, now + 4.0); // 4-second soft cinematic swell

        osc.connect(oscGain);
        oscGain.connect(this.filter);
        osc.start(now);
        this.oscillators.push(osc);
      });

      // Smooth master fade in
      const finalVolume = this.isMuted ? 0 : this.targetVolume;
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(finalVolume, now + 3.0);

      this.isSynthRunning = true;
    } catch {
      // Graceful fallback to silence
    }
  }

  public stopAmbientSynth() {
    if (!this.isSynthRunning || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Gentle 1.5-second fade-out to prevent clicks
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.oscillators = [];
        this.isSynthRunning = false;
      }, 1600);
    } catch {
      this.isSynthRunning = false;
    }
  }

  public setVolume(val: number) {
    this.targetVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.targetVolume, this.ctx.currentTime);
    }
  }

  public loadCustomAudio(_fileOrUrl: File | string): Promise<string> {
    return Promise.resolve('Ambient Soundscape');
  }

  public playCustomAudio() {
    this.startAmbientSynth();
  }

  public pauseCustomAudio() {
    this.stopAmbientSynth();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      const target = muted ? 0.0001 : this.targetVolume;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(target, now + 0.8);
    }
  }

  public toggleMute(): boolean {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    if (!nextMuted && !this.isSynthRunning) {
      this.startAmbientSynth();
    }
    return nextMuted;
  }

  public isAudioActive(): boolean {
    return this.isSynthRunning && !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundscapeEngine = new AudioEngine();
