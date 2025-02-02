export class SoundManager {
  private sounds: Map<string, HTMLAudioElement>;
  private enabled: boolean = true;

  constructor() {
    this.sounds = new Map();
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      'place_soft': '/sounds/place_soft.mp3',
      'place_hard': '/sounds/place_hard.mp3',
      'place_metal': '/sounds/place_metal.mp3',
      'break_soft': '/sounds/break_soft.mp3',
      'break_hard': '/sounds/break_hard.mp3',
      'break_metal': '/sounds/break_metal.mp3',
      'error': '/sounds/error.mp3'
    };

    for (const [key, url] of Object.entries(soundFiles)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    }
  }

  public playSound(name: string, volume: number = 1.0) {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }

  public toggleSound(enabled: boolean) {
    this.enabled = enabled;
  }
}