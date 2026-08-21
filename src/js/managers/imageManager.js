import { playerData } from '../data/playerData.js';
import { enemyData } from '../data/enemyData.js';
export class ImageManager {
  constructor() {
    this.images = {};
  }

  load(name, path) {
    return new Promise(resolve => {
      const img = new Image();
      img.src = path;
      this.images[name] = { img, isLoaded: false };

      img.onload = () => {
        this.images[name].isLoaded = true;
        console.log(`[DEV] Image: ${name} loaded`);

        resolve();
      };

      img.onerror = () => {
        console.error(`Image failure: ${name}`);
        resolve();
      };
    });
  }

  get(name) {
    return this.images[name]?.isLoaded ? this.images[name].img : null;
  }

  async loadAll() {
    const imageEnteries = [
      ...Object.values(enemyData).map(e => ({
        name: e.imageName,
        path: `./src/assets/monsters/${e.imageName}.png`,
      })),
      {
        name: 'knight',
        path: `./src/assets/player/${playerData.imageName}.png`,
      },
    ];
    await Promise.all([
      imageEnteries.map(({ name, path }) => {
        this.load(name, path);
      }),
    ]);

    const DEBUG_DEPLAY = 1000;
    await new Promise(res => setTimeout(res, DEBUG_DEPLAY));
  }
}
