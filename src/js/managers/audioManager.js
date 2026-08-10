// TODO
// Make the sounds have the ability to loop
// Start sound from any point

export class AudioManager {
  constructor() {
    this.sounds = {};
  }

  load(name, path) {
    return new Promise(resolve => {
      const audio = new Audio(path);
      this.sounds[name] = { audio, loaded: false };

      audio.onloadeddata = () => {
        this.sounds[name].loaded = true;
        console.log(`Audio ${name} is loaded`);

        resolve();
      };

      audio.onerror = () => {
        console.log(`Audio Failed: ${name}`);
        resolve();
      };
    });
  }
  play(name) {
    const sound = this.sounds[name];
    if (sound && sound.loaded) {
      sound.audio.currentTime = 0;
      sound.audio.play().catch(err => {
        console.log(`Could Not Play Audio ${name}`, err);
      });
    }
  }
  async loadAll() {
    await Promise.all([
      this.load('button_click', './src/audio/button_click.mp3'),
      this.load('bonus', './src/audio/bonus.mp3'),
      this.load('main_menu', './src/audio/main_menu.mp3'),
      this.load('sword_slash', './src/audio/sword_slash.mp3'),
    ]);
  }
}
