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
import { MapManager } from '../managers/mapManager.js';
import { CameraManager } from '../managers/cameraManager.js';
import { CollisionSystem } from '../systems/collisionSystem.js';
import { EventEmitter } from './eventEmitter.js';
import { missionData } from '../data/missionData.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.events = new EventEmitter();
    this.collisionSystem = new CollisionSystem();

    // Managers
    this.imageManager = new ImageManager();
    this.audioManager = new AudioManager(this.events);
    this.uiManager = new UIManager(this.events);
    this.inputManager = new InputManager(this);
    this.enemyManager = new EnemyManager(this.events);
    this.enemySpawnManager = new EnemySpawnManager(this.enemyManager);
    this.collisionManager = new CollisionManager(
      this.collisionSystem,
      this.events,
    );
    this.mapManager = new MapManager();
    this.cameraManager = new CameraManager(this.mapManager);

    //  Systems
    this.renderSystem = new RenderSystem(
      this.canvas,
      this.imageManager,
      this.mapManager,
      this.cameraManager,
    );
    this.resizeCanvas = new ResizeSystem(this.canvas);

    this.player = new Player();

    // State
    this.state = {
      gameState: GAME_STATE.MENU,
    };

    this.keys = {};
    this.time = 0;
    this.lastTime = 0;
    this.enemiesKilled = 0;
    this.debug = false;

    this.init();
  }

  async init() {
    await Promise.all([
      this.imageManager.loadAll(),
      this.audioManager.loadAll(),
    ]);

    // Game state from UI Buttons
    this.events.on(GAME_EVENTS.GAME_START, () => this.startGame());
    this.events.on(GAME_EVENTS.PAUSED, () => this.pause());
    this.events.on(GAME_EVENTS.GAME_RESUME, () => this.resume());
    this.events.on(GAME_EVENTS.GAME_RETURN_TO_MENU, () => this.returnToMenu());
    this.events.on(GAME_EVENTS.MISSION_COMPLETE, () => {
      this.missionComplete();
    });

    // Player related events
    this.events.on(GAME_EVENTS.PLAYER_DAMAGED, (health, maxHealth) => {
      this.events.emit(GAME_EVENTS.SOUND, 'player_hurt');
      this.uiManager.updateHealthBar(health, maxHealth);
    });

    this.events.on(GAME_EVENTS.PLAYER_DIED, () => {
      this.events.emit(GAME_EVENTS.SOUND, 'game_over');
      this.gameOver();
    });

    this.events.on(GAME_EVENTS.ENEMY_DIED, () => {
      this.enemiesKilled++;
      this.events.emit(GAME_EVENTS.ENEMY_KILLED_COUNT, this.enemiesKilled);
    });

    // Mute Audio
    this.events.on(GAME_EVENTS.MUTE, () => {
      this.muteGame();
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
    this.cameraManager.moveCamera(deltaTime, this.player);

    this.collisionManager.update(this.player, activeEnemies);
    this.enemyManager.update(deltaTime, this.player);
    // this.enemySpawnManager.update(deltaTime);
  }

  startGame() {
    this.state = {
      gameState: GAME_STATE.PLAYING,
    };
    this.uiManager.hideAllPanels();
    this.time = 0;
    this.enemiesKilled = 0;
    this.uiManager.showHUD();

    // Reset Player Position
    this.player.resetPlayer();
    this.enemyManager.reset();
    this.enemySpawnManager.reset();
    this.uiManager.updateHealthBar(this.player.health, this.player.maxHealth);

    this.lastTime = performance.now();
  }
  z;
  pause() {
    this.state.gameState = GAME_STATE.PAUSED;
    // this.events.emit(GAME_EVENTS.SOUND, 'bonus');
    this.uiManager.showPanel('pauseMenu');
  }
  resume() {
    this.state.gameState = GAME_STATE.PLAYING;
    // this.events.emit(GAME_EVENTS.SOUND, 'bonus');

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
      // this.checkMissionConditions();
    }
    const activeEnemies = this.enemyManager.getActiveEnemies();
    this.update(deltaTime, activeEnemies);
    this.renderSystem.render(
      this.state,
      this.player,
      activeEnemies,
      this.debug,
    );
    requestAnimationFrame(t => this.gameLoop(t));
  }
  gameOver() {
    this.state.gameState = GAME_STATE.GAME_OVER;
    this.uiManager.hideHUD();
    this.uiManager.showPanel('gameOverMenu');
  }
  checkMissionConditions() {
    if (this.state.gameState !== GAME_STATE.PLAYING) return;
    if (
      this.enemiesKilled >= missionData.mission1.killCount ||
      this.time >= missionData.mission1.surviveTime
    ) {
      this.events.emit(GAME_EVENTS.MISSION_COMPLETE);
    }
  }
  missionComplete() {
    this.state.gameState = GAME_STATE.MISSION_COMPLETE;
    this.uiManager.hideHUD();
    this.uiManager.showPanel('missionCompleteMenu');
    this.events.emit(GAME_EVENTS.SOUND, 'game_over');
  }
  muteGame() {
    console.log('mute button pressed');
  }
}
