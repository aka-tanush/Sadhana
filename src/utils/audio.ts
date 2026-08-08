// Web Audio API Synthesizer for Spiritual Audio Effects

class SoundManager {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Realistic Temple Bell Sound synthesis using multiple sine wave harmonics with exponential decay
  playTempleBell(enabled: boolean = true): void {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Fundamental frequency of a traditional bronze bell (e.g. A4 440Hz or C5 523Hz)
      const baseFreq = 523.25; // C5
      const harmonics = [1, 2.01, 3.02, 4.18, 5.43, 6.7];
      const gains = [0.6, 0.35, 0.25, 0.15, 0.1, 0.05];
      const decayTimes = [3.5, 2.8, 2.0, 1.5, 1.0, 0.6];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.5, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);
      masterGain.connect(ctx.destination);

      harmonics.forEach((harmonic, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * harmonic, now);

        // Strike impact attack
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(gains[idx], now + 0.008);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[idx]);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(now);
        osc.stop(now + decayTimes[idx]);
      });
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  // Soft subtle click/bead sound for quick count buttons (+108, +1)
  playBeadClick(enabled: boolean = true): void {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore audio context errors
    }
  }

  // Trigger tactile vibration on mobile devices
  triggerVibration(enabled: boolean = true, pattern: number | number[] = 25): void {
    if (!enabled) return;
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored
      }
    }
  }
}

export const soundManager = new SoundManager();
