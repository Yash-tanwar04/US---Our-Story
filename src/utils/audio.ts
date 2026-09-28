// Real Songs Audio Engine + Realistic Paper Flip Synthesizer

export interface SongTrack {
  id: number;
  title: string;
  artist: string;
  src: string;
}

export const PLAYLIST: SongTrack[] = [
  {
    id: 0,
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    src: "/music/song1_until_i_found_you.mp3",
  },
  {
    id: 1,
    title: "Those Eyes",
    artist: "New West",
    src: "/music/song2_those_eyes.mp3",
  },
  {
    id: 2,
    title: "High On You",
    artist: "KoshalWorld",
    src: "/music/song3_high_on_you.mp3",
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private currentTrackIndex: number = 0;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.src = PLAYLIST[0].src;
      this.audioEl.loop = false;
      this.audioEl.preload = 'auto';

      this.audioEl.addEventListener('ended', () => {
        this.nextTrack();
      });
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getCurrentTrack(): SongTrack {
    return PLAYLIST[this.currentTrackIndex];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public startMusic(trackIdx?: number) {
    if (this.isMuted || !this.audioEl) return;
    if (typeof trackIdx === 'number' && trackIdx !== this.currentTrackIndex) {
      this.currentTrackIndex = trackIdx;
      this.audioEl.src = PLAYLIST[trackIdx].src;
    }
    this.audioEl.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch(() => {
      // Autoplay blocked until user interaction
    });
  }

  public pauseMusic() {
    if (!this.audioEl) return;
    this.audioEl.pause();
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
  }

  public setTrack(idx: number) {
    if (!this.audioEl) return;
    if (idx < 0 || idx >= PLAYLIST.length) return;
    const wasPlaying = this.isPlaying;
    this.currentTrackIndex = idx;
    this.audioEl.src = PLAYLIST[idx].src;
    if (wasPlaying && !this.isMuted) {
      this.audioEl.play().catch(() => {});
    }
    this.notify();
  }

  public nextTrack() {
    const next = (this.currentTrackIndex + 1) % PLAYLIST.length;
    this.setTrack(next);
  }

  public prevTrack() {
    const prev = (this.currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    this.setTrack(prev);
  }

  public setTrackForPage(pageNumber: number) {
    // Pages 1-18: Until I Found You
    // Pages 19-34: Those Eyes
    // Pages 35+: High On You
    let targetIdx = 0;
    if (pageNumber >= 35) {
      targetIdx = 2;
    } else if (pageNumber >= 19) {
      targetIdx = 1;
    } else {
      targetIdx = 0;
    }

    if (targetIdx !== this.currentTrackIndex && this.isPlaying) {
      this.setTrack(targetIdx);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioEl) {
      this.audioEl.muted = muted;
    }
    if (muted) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
    this.notify();
  }

  // Realistic Paper Page Turn Rustle Sound Synthesizer
  public playPaperFlip() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.18);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.16);

      oscGain.gain.setValueAtTime(0.01, now + 0.08);
      oscGain.gain.linearRampToValueAtTime(0.09, now + 0.11);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now + 0.08);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio errors
    }
  }

  public playSpecialChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.01, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.5);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
