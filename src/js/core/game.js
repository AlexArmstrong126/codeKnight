import { RenderSystem } from '../systems/renderSystem.js';
import { ResizeSystem } from '../systems/resizeSystem.js';
import { Player } from '../entities/player.js';
import { ImageManager } from '../managers/imageManager.js';
import { AudioManager } from '../managers/audioManager.js';
import { GAME_DIMENSIONS } from './constants.js';
import { UIManager } from '../managers/uiManager.js';
import { InputManager } from '../managers/inputManager.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.imageManager = new ImageManager();
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.resizeCanvas = new ResizeSystem(this.canvas);
    this.player = new Player();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(this);
    this.inputManager = new InputManager(this);
    this.state = {
      gameState: 'menu',
    };

    this.keys = {};
    this.time = 0;
    this.lastTime = 0;

    this.init();
  }

  async init() {
    await Promise.all([
      this.imageManager.loadAll(),
      this.audioManager.loadAll(),
    ]);
    this.uiManager.showPanel('mainMenu');
    this.resizeCanvas.resize();
    window.addEventListener('resize', () => this.resizeCanvas.resize());
    this.uiManager.setUpEventListeners();

    this.lastTime = performance.now();
    requestAnimationFrame(t => this.gameLoop(t));
  }
  update(deltaTime) {
    if (this.state.gameState !== 'playing') return;
    this.player.update(deltaTime, this.keys);
  }

  startGame() {
    this.state = {
      gameState: 'playing',
    };
    this.uiManager.hideAllPanels();
    this.time = 0;
    this.uiManager.showTimer();

    // Reset Player Position
    this.player.resetPlayer();

    this.lastTime = performance.now();
  }
  pause() {
    this.state.gameState = 'paused';
    this.audioManager.play('bonus');
    this.uiManager.showPanel('pauseMenu');
  }
  resume() {
    this.state.gameState = 'playing';
    this.audioManager.play('bonus');

    this.uiManager.hideAllPanels();
  }
  returnToMenu() {
    this.state.gameState = 'menu';
    this.uiManager.hideTimer();
    this.uiManager.showPanel('mainMenu');
  }
  gameLoop(timeStamp) {
    if (this.lastTime === 0) {
      this.lastTime = timeStamp;
    }
    const deltaTime = Math.min((timeStamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timeStamp;

    if (this.state.gameState === 'playing') {
      this.time += deltaTime;
      this.uiManager.updateTimer(this.time);
    }
    this.update(deltaTime);
    this.renderSystem.render(this.state, this.player);
    requestAnimationFrame(t => this.gameLoop(t));
  }
}
