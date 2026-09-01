// TODO
// Make the sounds have the ability to loop
// Start sound from any point
import { GAME_EVENTS } from '../core/constants.js';
import { audioData } from '../data/audioData.js';
export class AudioManager {
  constructor(events) {
    this.sounds = {};
    this._registerEvents(events);
  }
  _registerEvents(events) {
    // Sound Events
    events.on(GAME_EVENTS.SOUND, name => this.play(name));
    events.on(GAME_EVENTS.ENEMY_DAMAGED, enemy =>
      this.play(enemy.data.sounds?.hit),
    );
    events.on(GAME_EVENTS.ENEMY_DIED, enemy =>
      this.play(enemy.data.sounds?.death),
    );
  }
  load(name, path) {
    return new Promise(resolve => {
      const audio = new Audio(path);
      this.sounds[name] = { audio, loaded: false };

      audio.onloadeddata = () => {
        this.sounds[name].loaded = true;
        // console.log(`[DEV] Audio ${name} is loaded`);

        resolve();
      };

      audio.onerror = () => {
        console.log(`Audio Failed: ${name}`);
        resolve();
      };
    });
  }
  play(name) {
    if (!name) return;
    const sound = this.sounds[name]?.loaded ? this.sounds[name] : null;
    if (sound) {
      sound.audio.currentTime = 0;
      sound.audio.play().catch(err => {
        console.log(`Could Not Play Audio ${name}`, err);
      });
    }
  }
  async loadAll() {
    await Promise.all([
      audioData.map(({ name, path }) => {
        this.load(name, path);
      }),
    ]);
  }
}
