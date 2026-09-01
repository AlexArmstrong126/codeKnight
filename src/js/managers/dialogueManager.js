import { VOICE_PROFILES } from '../data/voiceProfiles.js';
export class DialogueManager {
  constructor(audioManager) {
    this.audioManager = audioManager;

    this.lastSound = null;
    this.characterCounter = 0;
  }

  speakCharacter(character, voice = 'villager') {
    if (!character || /\s/.test(character)) return;

    // Don't make punctuation generate a voice.
    if (!/[a-zA-Z0-9]/.test(character)) return;

    const profile = VOICE_PROFILES[voice] ?? VOICE_PROFILES.villager;

    this.characterCounter++;

    if (this.characterCounter % profile.charactersPerBleep !== 0) {
      return;
    }

    const soundNumber = this.getRandomSound(profile.sounds);

    const pitch =
      profile.pitch + (Math.random() * 2 - 1) * profile.pitchVariation;

    this.audioManager.playDialogueBleep(
      `bleep${String(soundNumber).padStart(3, '0')}`,
      {
        volume: profile.volume,
        pitch,
      },
    );
  }
  testDialogueVoice() {
    const text = 'Hello there, traveller!';

    let index = 0;

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        return;
      }

      const character = text[index];

      console.log(character);

      this.speakCharacter(character, 'guard');

      index++;
    }, 70);
  }

  reset() {
    this.characterCounter = 0;
    this.lastSound = null;
  }

  getRandomSound(sounds) {
    if (sounds.length === 1) {
      return sounds[0];
    }

    let sound;

    do {
      sound = sounds[Math.floor(Math.random() * sounds.length)];
    } while (sound === this.lastSound);

    this.lastSound = sound;

    return sound;
  }
}
