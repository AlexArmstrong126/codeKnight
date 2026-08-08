import { RenderSystem } from '../systems/renderSystem.js';
import { ResizeSystem } from '../systems/resizeSystem.js';
import { Player } from '../entities/player.js';
import { ImageManager } from '../managers/imageManager.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.imageManager = new ImageManager();
    this.imageManager.loadAll();
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.resizeCanvas = new ResizeSystem(this.canvas);
    this.player = new Player();

    this.keys = {};
    this.lastTime;

    this.init();
  }

  init() {
    this.resizeCanvas.resize();
    window.addEventListener('resize', () => this.resizeCanvas.resize());
    this.setupInput();

    this.lastTime = performance.now();
    requestAnimationFrame(t => this.gameLoop(t));
  }
  update(deltaTime) {
    this.player.update(deltaTime, this.keys);
  }
  gameLoop(timeStamp) {
    const deltaTime = Math.min((timeStamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timeStamp;
    this.update(deltaTime);
    // console.log('Animating', timeStamp / 1000);
    this.renderSystem.render(this.player);
    requestAnimationFrame(t => this.gameLoop(t));
  }
  setupInput() {
    window.addEventListener('keydown', e => {
      this.keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', e => {
      this.keys[e.key.toLowerCase()] = false;
    });

    //clear all key values when context opens
    window.addEventListener('contextmenu', () => {
      this.keys = {};
    });

    window.addEventListener('blue', () => {
      this.keys = {};
    });
  }
}
