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
    await Promise.all([
      this.load(
        'placeHolder_Skeleton',
        './src/assets/placeholder/skeleton_placeholder.png',
      ),
      this.load('knight', './src/assets/player/knight_foward.png'),
    ]);

    await new Promise(res => setTimeout(res, 500));
  }
}
