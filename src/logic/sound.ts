// Lightweight HTMLAudio-based SFX/music helper.
// Never throws. Catches autoplay-block rejections silently.
// Mute state is persisted in localStorage so kids don't have to re-mute.

const STORAGE_KEY = "kidsScienceBattle.muted";

const cache: Record<string, HTMLAudioElement> = {};
let muted: boolean = readPersistedMuted();
const listeners = new Set<(m: boolean) => void>();

function readPersistedMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writePersistedMuted(m: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, m ? "true" : "false");
  } catch {
    // ignore
  }
}

export function playSound(name: string, volume = 0.5): void {
  if (muted) return;
  try {
    if (!cache[name]) {
      cache[name] = new Audio(`/sounds/${name}.mp3`);
    }
    cache[name].volume = volume;
    cache[name].currentTime = 0;
    void cache[name].play().catch(() => {
      // browsers may block autoplay before user gesture; that's fine
    });
  } catch {
    // never throw from sound
  }
}

export function setMuted(m: boolean): void {
  muted = m;
  writePersistedMuted(m);
  listeners.forEach((fn) => {
    try {
      fn(m);
    } catch {
      // ignore listener errors
    }
  });
}

export function isMuted(): boolean {
  return muted;
}

export function subscribeMute(listener: (muted: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Music: a single shared looping audio element.
let music: HTMLAudioElement | null = null;
let musicSrc: string | null = null;

export function playMusic(src: string, volume = 0.3): void {
  try {
    if (!music || musicSrc !== src) {
      stopMusic();
      music = new Audio(src);
      music.loop = true;
      musicSrc = src;
    }
    music.volume = muted ? 0 : volume;
    if (!muted) {
      void music.play().catch(() => {
        // autoplay blocked — wait for user gesture
      });
    }
  } catch {
    // ignore
  }
}

export function stopMusic(): void {
  try {
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
  } catch {
    // ignore
  }
}

export function setMusicVolume(volume: number): void {
  try {
    if (music) music.volume = muted ? 0 : volume;
  } catch {
    // ignore
  }
}

// When mute toggles, reflect on the live music element.
subscribeMute((m) => {
  try {
    if (music) {
      if (m) {
        music.pause();
      } else {
        void music.play().catch(() => {});
      }
    }
  } catch {
    // ignore
  }
});
