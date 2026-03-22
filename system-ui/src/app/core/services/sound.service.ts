import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isEnabled = true;

  constructor() {
    this.preloadSounds();
    this.loadSettings();
  }

  private preloadSounds() {
    this.addSound('levelup', 'assets/sounds/levelup.mp3');
    this.addSound('success', 'assets/sounds/success.mp3');
    this.addSound('alert', 'assets/sounds/alert.mp3');
    this.addSound('hit', 'assets/sounds/hit.mp3');
  }

  private addSound(key: string, path: string) {
    const audio = new window.Audio();
    audio.src = path;
    audio.load();
    this.sounds.set(key, audio);
  }

  playSound(key: string) {
    if (!this.isEnabled) return;
    
    const audio = this.sounds.get(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.debug('Audio play failed:', err));
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    this.saveSettings();
    return this.isEnabled;
  }

  setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    this.saveSettings();
  }

  getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  private loadSettings() {
    const stored = localStorage.getItem('system_sound_enabled');
    if (stored !== null) {
      this.isEnabled = stored === 'true';
    }
  }

  private saveSettings() {
    localStorage.setItem('system_sound_enabled', String(this.isEnabled));
  }
}

