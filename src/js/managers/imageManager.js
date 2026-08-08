export class ImageManager {
  constructor() {
    this.images = {};
  }

  load(name, path) {
    const img = new Image();
    img.src = path;
    this.images[name] = { img, isLoaded: false };

    img.onload = () => {
      this.images[name].isLoaded = true;

      console.log(`Image Loaded, ${name}`);
    };

    img.onerror = () => {
      console.log(`Image failure: ${name}`);
    };
  }

  get(name) {
    return this.images[name]?.isLoaded ? this.images[name].img : null;
  }

  loadAll() {
    this.load(
      'placeHolder_Skeleton',
      './src/assets/placeholder/skeleton_placeholder.png',
    );
    this.load('knight', './src/assets/player/knight_foward.png');
  }
}
