interface PlayOpts {
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
}

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private resumeListenersAdded = false;
  private queuedStarts: Array<() => void> = [];
  private currentBGM: HTMLAudioElement | null = null;
  private masterVolume: number = 1;
  private storage = new Map<string, boolean>();

  private static STORAGE_PREFIX = 'app_sound_played#';

  constructor(private audioFiles: { [key: string]: string }) {
    this.initializeAudioContext();
  }

  private getStorageKey(key: string): string {
    return SoundManager.STORAGE_PREFIX + key;
  }

  private hasLocalPlayed(key: string): boolean {
    try {
      return localStorage.getItem(this.getStorageKey(key)) === '1';
    } catch {
      return this.storage.get(key) || false;
    }
  }

  private markLocalPlayed(key: string): void {
    try {
      localStorage.setItem(this.getStorageKey(key), '1');
    } catch {
      this.storage.set(key, true);
    }
  }

  private initializeAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioCtx.state === 'suspended' && !this.resumeListenersAdded) {
      const resume = () => {
        if (!this.audioCtx) return;
        this.audioCtx.resume().catch(() => {});
        this.queuedStarts.forEach(fn => { try { fn(); } catch {} });
        this.queuedStarts = [];
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
        window.removeEventListener('touchstart', resume);
        this.resumeListenersAdded = false;
      };

      window.addEventListener('click', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
      window.addEventListener('touchstart', resume, { once: true });
      this.resumeListenersAdded = true;
    }
  }

  private ensureAudioContext(): AudioContext {
    this.initializeAudioContext();
    return this.audioCtx!;
  }

  private resumeAudioContext() {
    if (!this.audioCtx) return Promise.resolve();
    return this.audioCtx.resume().then(() => {
      this.queuedStarts.forEach(fn => { try { fn(); } catch {} });
      this.queuedStarts = [];
    }).catch(() => {});
  }

  private safePlayAudioElement(audio: HTMLAudioElement) {
    try {
      audio.play().catch(() => {});
    } catch {}
  }

  public hasPlayed(key: string): boolean {
    return this.hasLocalPlayed(key);
  }

  public async play(url: string, opts: PlayOpts = {}) {
    const volume = typeof opts.volume === 'number' ? opts.volume * this.masterVolume : this.masterVolume;
    const fadeIn = typeof opts.fadeIn === 'number' ? opts.fadeIn : 0;
    const fadeOut = typeof opts.fadeOut === 'number' ? opts.fadeOut : 0;
    const loop = !!opts.loop;

    try {
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      audio.loop = loop;

      const ctx = this.ensureAudioContext();
      const start = () => {
        try {
          const source = ctx.createMediaElementSource(audio);
          const gain = ctx.createGain();
          gain.gain.value = 0;
          source.connect(gain);
          gain.connect(ctx.destination);

          const now = ctx.currentTime;
          gain.gain.setValueAtTime(0, now);
          if (fadeIn > 0) gain.gain.linearRampToValueAtTime(volume, now + fadeIn);
          else gain.gain.setValueAtTime(volume, now);

          if (fadeOut > 0) {
            const scheduleFadeOut = () => {
              const dur = audio.duration || 0;
              if (isFinite(dur) && dur > 0) {
                const fadeStart = now + Math.max(0, dur - fadeOut);
                gain.gain.linearRampToValueAtTime(0, fadeStart + fadeOut);
              }
            };

            if (!isNaN(audio.duration) && audio.duration > 0) scheduleFadeOut();
            else audio.addEventListener('loadedmetadata', scheduleFadeOut, { once: true });
          }

          audio.addEventListener('ended', () => {
            try { audio.remove(); } catch {}
          }, { once: true });

          this.safePlayAudioElement(audio);
        } catch (e) {
          this.safePlayAudioElement(audio);
        }
      };

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.queuedStarts.push(start);
      } else {
        start();
      }
    } catch (e) {
      try {
        const a = new Audio(url);
        a.volume = volume;
        a.loop = loop;
        this.safePlayAudioElement(a);
      } catch {}
    }
  }

  public async playOnce(key: string, url: string, opts: PlayOpts = {}) {
    if (this.hasLocalPlayed(key)) return;
    try {
      await this.play(url, opts);
      this.markLocalPlayed(key);
    } catch {
      this.markLocalPlayed(key);
    }
  }

  public playClick(url = '/button-click.mp3') {
    try {
      const a = new Audio(url);
      a.volume = 0.5 * this.masterVolume;
      a.play().catch(() => {});
    } catch {}
  }

  public isSuspended(): boolean {
    return this.audioCtx ? this.audioCtx.state === 'suspended' : false;
  }

  public resume() {
    try {
      this.ensureAudioContext();
      return this.resumeAudioContext();
    } catch { return Promise.resolve(); }
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  public playBGM(key: string, opts: PlayOpts = {}) {
    const url = this.audioFiles[key];
    if (!url) return;

    this.stopBGM();
    this.play(url, { ...opts, loop: true }).catch(console.error);
  }

  public stopBGM() {
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM = null;
    }
  }
}

function ensureAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // If suspended, prepare a resume-on-interaction listener
  if (audioCtx.state === 'suspended' && !resumeListenersAdded) {
    const resume = () => {
      if (!audioCtx) return;
      audioCtx.resume().catch(() => {});
      // run queued
      queuedStarts.forEach(fn => { try { fn(); } catch {} });
      queuedStarts = [];
      window.removeEventListener('click', resume);
      window.removeEventListener('keydown', resume);
      window.removeEventListener('touchstart', resume);
      resumeListenersAdded = false;
    };
    window.addEventListener('click', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    window.addEventListener('touchstart', resume, { once: true });
    resumeListenersAdded = true;
  }
  return audioCtx;
}

function resumeAudioContext() {
  if (!audioCtx) return Promise.resolve();
  return audioCtx.resume().then(() => {
    queuedStarts.forEach(fn => { try { fn(); } catch {} });
    queuedStarts = [];
  }).catch(() => {});
}

function safePlayAudioElement(audio: HTMLAudioElement) {
  try {
    audio.play().catch(() => {});
  } catch {}
}

export class SoundManager {
  private audioCtx: AudioContext | null = null;
  private resumeListenersAdded = false;
  private queuedStarts: Array<() => void> = [];
  private currentBGM: HTMLAudioElement | null = null;
  private masterVolume = 1;
  private storage = new Map<string, boolean>();

  constructor(private audioFiles: Record<string, string>) {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioCtx.state === 'suspended' && !this.resumeListenersAdded) {
      const resume = () => {
        if (!this.audioCtx) return;
        this.audioCtx.resume().catch(() => {});
        this.queuedStarts.forEach(fn => { try { fn(); } catch {} });
        this.queuedStarts = [];
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
        window.removeEventListener('touchstart', resume);
        this.resumeListenersAdded = false;
      };

      window.addEventListener('click', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
      window.addEventListener('touchstart', resume, { once: true });
      this.resumeListenersAdded = true;
    }
  }

  private safePlayAudioElement(audio: HTMLAudioElement) {
    audio.play().catch(() => {});
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.currentBGM) {
      this.currentBGM.volume = this.masterVolume;
    }
  }

  public async play(url: string, opts: PlayOpts = {}) {
    const volume = typeof opts.volume === 'number' ? opts.volume * this.masterVolume : this.masterVolume;
    const fadeIn = typeof opts.fadeIn === 'number' ? opts.fadeIn : 0;
    const fadeOut = typeof opts.fadeOut === 'number' ? opts.fadeOut : 0;
    const loop = !!opts.loop;

    const audio = new Audio(url);
    audio.volume = volume;
    audio.loop = loop;

    if (fadeIn > 0) {
      audio.volume = 0;
      const fadeStep = volume / (fadeIn * 100);
      let currentVolume = 0;

      const fadeInterval = setInterval(() => {
        if (currentVolume < volume) {
          currentVolume = Math.min(volume, currentVolume + fadeStep);
          audio.volume = currentVolume;
        } else {
          clearInterval(fadeInterval);
        }
      }, 10);
    }

    if (fadeOut > 0 && !loop) {
      audio.addEventListener('timeupdate', () => {
        const timeLeft = (audio.duration || 0) - audio.currentTime;
        if (timeLeft <= fadeOut) {
          audio.volume = (timeLeft / fadeOut) * volume;
        }
      });
    }

    this.safePlayAudioElement(audio);
    return audio;
  }

  public async playBGM(key: string, opts: PlayOpts = {}) {
    const url = this.audioFiles[key];
    if (!url) return;

    if (this.currentBGM) {
      this.currentBGM.pause();
    }

    this.currentBGM = await this.play(url, {
      ...opts,
      loop: true,
      volume: 0.5 * this.masterVolume
    });
  }

  public pauseBGM() {
    if (this.currentBGM) {
      this.currentBGM.pause();
    }
  }

  public resumeBGM() {
    if (this.currentBGM) {
      this.safePlayAudioElement(this.currentBGM);
    }
  }

  public async playSFX(key: string) {
    const url = this.audioFiles[key];
    if (!url) return;

    await this.play(url, {
      volume: 0.7 * this.masterVolume,
      loop: false
    });
  }

  public stopBGM(fadeOut: boolean = false) {
    if (!this.currentBGM) return;

    if (fadeOut) {
      const currentVolume = this.currentBGM.volume;
      const fadeStep = currentVolume / (2 * 100); // 2 seconds fade
      const fadeInterval = setInterval(() => {
        if (this.currentBGM && this.currentBGM.volume > 0) {
          this.currentBGM.volume = Math.max(0, this.currentBGM.volume - fadeStep);
        } else {
          if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM = null;
          }
          clearInterval(fadeInterval);
        }
      }, 10);
    } else {
      this.currentBGM.pause();
      this.currentBGM = null;
    }
  }
}
