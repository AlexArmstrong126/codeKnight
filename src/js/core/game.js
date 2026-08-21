import { RenderSystem } from '../systems/renderSystem.js';
import { ResizeSystem } from '../systems/resizeSystem.js';
import { Player } from '../entities/player.js';
import { ImageManager } from '../managers/imageManager.js';
import { AudioManager } from '../managers/audioManager.js';
import { GAME_DIMENSIONS, GAME_STATE, GAME_EVENTS } from './constants.js';
import { UIManager } from '../managers/uiManager.js';
import { InputManager } from '../managers/inputManager.js';
import { EnemyManager } from '../managers/enemyManager.js';
import { EnemySpawnManager } from '../managers/enemySpawnManager.js';
import { CollisionManager } from '../managers/collisionManager.js';
import { CollisionSystem } from '../systems/collisionSystem.js';
import { EventEmitter } from './eventEmitter.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.events = new EventEmitter();
    this.collisionSystem = new CollisionSystem();

    // Managers
    this.imageManager = new ImageManager();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(this.events);
    this.inputManager = new InputManager(this);
    this.enemyManager = new EnemyManager(this.events);
    this.enemySpawnManager = new EnemySpawnManager(this.enemyManager);
    this.collisionManager = new CollisionManager(
      this.collisionSystem,
      this.events,
    );

    //  Systems
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.resizeCanvas = new ResizeSystem(this.canvas);

    this.player = new Player();

    // State
    this.state = {
      gameState: GAME_STATE.MENU,
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

    // Sound Events
    this.events.on(GAME_EVENTS.SOUND, name => this.audioManager.play(name));

    // Game state from UI Buttons
    this.events.on(GAME_EVENTS.GAME_START, () => this.startGame());
    this.events.on(GAME_EVENTS.PAUSED, () => this.pause());
    this.events.on(GAME_EVENTS.GAME_RESUME, () => this.resume());
    this.events.on(GAME_EVENTS.GAME_RETURN_TO_MENU, () => this.returnToMenu());

    // Player related events
    this.events.on(GAME_EVENTS.PLAYER_DAMAGED, (health, maxHealth) => {
      this.events.emit(GAME_EVENTS.SOUND, 'player_hurt');
      this.uiManager.updateHealthBar(health, maxHealth);
    });

    this.events.on(GAME_EVENTS.PLAYER_DIED, () => {
      this.events.emit(GAME_EVENTS.SOUND, 'game_over');
      this.gameOver();
    });

    this.uiManager.showPanel('mainMenu');
    this.resizeCanvas.resize();
    window.addEventListener('resize', () => this.resizeCanvas.resize());
    this.uiManager.setUpEventListeners();

    this.lastTime = performance.now();
    requestAnimationFrame(t => this.gameLoop(t));
  }
  update(deltaTime, activeEnemies) {
    if (this.state.gameState !== GAME_STATE.PLAYING) return;
    this.player.update(deltaTime, this.keys);

    this.enemyManager.update(deltaTime, this.player);
    this.enemySpawnManager.update(deltaTime);
    this.collisionManager.update(this.player, activeEnemies);
  }

  startGame() {
    this.state = {
      gameState: GAME_STATE.PLAYING,
    };
    this.uiManager.hideAllPanels();
    this.time = 0;
    this.uiManager.showHUD();

    // Reset Player Position
    this.player.resetPlayer();
    this.enemyManager.reset();
    this.enemySpawnManager.reset();
    this.uiManager.updateHealthBar(this.player.health, this.player.maxHealth);

    this.lastTime = performance.now();
  }
  pause() {
    this.state.gameState = GAME_STATE.PAUSED;
    this.events.emit(GAME_EVENTS.SOUND, 'bonus');
    this.uiManager.showPanel('pauseMenu');
  }
  resume() {
    this.state.gameState = GAME_STATE.PLAYING;
    this.events.emit(GAME_EVENTS.SOUND, 'bonus');

    this.uiManager.hideAllPanels();
  }
  returnToMenu() {
    this.state.gameState = GAME_STATE.MENU;
    this.uiManager.hideHUD();
    this.uiManager.showPanel('mainMenu');
  }
  gameLoop(timeStamp) {
    const deltaTime = Math.min((timeStamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timeStamp;

    if (this.state.gameState === GAME_STATE.PLAYING) {
      this.time += deltaTime;
      this.uiManager.updateTimer(this.time);
    }
    const activeEnemies = this.enemyManager.getActiveEnemies();
    this.update(deltaTime, activeEnemies);
    this.renderSystem.render(this.state, this.player, activeEnemies);
    requestAnimationFrame(t => this.gameLoop(t));
  }
  gameOver() {
    this.state.gameState = GAME_STATE.GAME_OVER;
    this.uiManager.hideHUD();
    this.uiManager.showPanel('gameOverMenu');
  }
}
