import { GAME_DIMENSIONS, GAME_STATE } from '../core/constants.js';

const FLASH_MIN_ALPHA = 0.2;
const FLASH_ALPHA_RANGE = 0.6;
const FLASH_SPEED = 10;

const ENEMY_HEALTH_BAR_HEIGHT = 4;
const ENEMY_HEALTH_BAR_OFFSET = 4;
const ENEMY_HEALTH_BAR_BG = '#00000099';
const ENEMY_HEALTH_BAR_FILL = '#ff5f6d';

export class RenderSystem {
  constructor(canvas, imageManager, mapManager, cameraManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.imageManager = imageManager;
    this.mapManager = mapManager;
    this.cameraManager = cameraManager;
  }

  render(state, player, enemies = [], debug = false) {
    if (state == GAME_STATE.MENU) {
      this.renderMenuBackGround();
    } else {
      //background
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(
        0,
        0,
        GAME_DIMENSIONS.GAME_WIDTH,
        GAME_DIMENSIONS.GAME_HEIGHT,
      );
      this.renderFullImage();
      this.renderGrid();
      this.renderEnemies(enemies);
      this.renderPlayer(player);
      if (debug) {
        this.renderDebugOverlay(player, enemies);
        this.renderCameraOverlay(player);
      }
    }
  }
  renderEnemyHealthBar(enemy) {
    const percent = enemy.health / enemy.data.health;
    const x = enemy.x - this.cameraManager.cameraX;
    const y =
      enemy.y -
      this.cameraManager.cameraY -
      ENEMY_HEALTH_BAR_OFFSET -
      ENEMY_HEALTH_BAR_HEIGHT;
    const w = enemy.width;
    this.ctx.fillStyle = ENEMY_HEALTH_BAR_BG;
    this.ctx.fillRect(x, y, w, ENEMY_HEALTH_BAR_HEIGHT);
    this.ctx.fillStyle = ENEMY_HEALTH_BAR_FILL;
    this.ctx.fillRect(x, y, Math.ceil(w * percent), ENEMY_HEALTH_BAR_HEIGHT);
  }

  renderGrid() {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    for (
      let i = 0;
      i < GAME_DIMENSIONS.GAME_WIDTH;
      i += GAME_DIMENSIONS.GRID_SIZE
    ) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, GAME_DIMENSIONS.GAME_HEIGHT);
    }

    for (
      let i = 0;
      i < GAME_DIMENSIONS.GAME_HEIGHT;
      i += GAME_DIMENSIONS.GRID_SIZE
    ) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(GAME_DIMENSIONS.GAME_WIDTH, i);
    }
    this.ctx.stroke();
  }
  imageFlash(timer) {
    this.ctx.globalAlpha =
      FLASH_MIN_ALPHA +
      FLASH_ALPHA_RANGE * Math.abs(Math.sin(timer * FLASH_SPEED));
  }

  renderPlayer(player) {
    const playerImage = this.imageManager.get('knight');

    if (player.invincible) {
      this.imageFlash(player.invincibilityTimer);
    }

    const screenX = player.x - this.cameraManager.cameraX;
    const screenY = player.y - this.cameraManager.cameraY;

    if (playerImage) {
      this.ctx.drawImage(
        playerImage,
        screenX,
        screenY,
        player.width,
        player.height,
      );
    } else {
      const placeHolderImage = this.imageManager.get('skeleton_axe_right');

      if (placeHolderImage) {
        this.ctx.drawImage(
          placeHolderImage,
          player.x,
          player.y,
          player.width,
          player.height,
        );
      } else {
        this.ctx.fillStyle = 'green';
        this.ctx.strokeStyle = 'white';
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        this.ctx.strokeRect(player.x, player.y, player.width, player.height);
      }
    }
    this.ctx.globalAlpha = 1;
  }
  renderEnemies(enemies) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy.active) continue;
      const enemyAsset = this.imageManager.get(enemy.data.imageName);

      if (enemy.invincible) {
        this.imageFlash(enemy.invincibilityTimer);
      }

      if (enemyAsset) {
        //TODO: THIS NEEDS FIXED
        this.ctx.save();
        if (enemy.facingLeft) {
          this.ctx.translate(
            enemy.x - this.cameraManager.cameraX + enemy.width,
            enemy.y,
          );
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(enemyAsset, 0, 0, enemy.width, enemy.height);
        } else {
          this.ctx.drawImage(
            enemyAsset,
            enemy.x - this.cameraManager.cameraX,
            enemy.y - this.cameraManager.cameraY,
            enemy.width,
            enemy.height,
          );
        }
        this.ctx.restore();
      } else {
        console.warn(
          `Cannot Draw Image ${enemyAsset} is not loaded or does not exist`,
        );
      }

      this.ctx.globalAlpha = 1;

      if (enemy.health < enemy.data.health) {
        this.renderEnemyHealthBar(enemy);
      }
    }
  }
  renderMenuBackGround() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      0,
      0,
      GAME_DIMENSIONS.GAME_WIDTH,
      GAME_DIMENSIONS.GAME_HEIGHT,
    );
  }
  renderDebugOverlay(player, enemies) {
    this.ctx.save();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(
      player.x - this.cameraManager.cameraX + player.width / 2,
      player.y - this.cameraManager.cameraY + player.height / 2,
      player.collisionRadius,
      0,
      Math.PI * 2,
    );
    this.ctx.stroke();

    this.ctx.restore();
  }
  renderTileMap() {
    // console.log('Rendering Tile Map');
    const TILE_IMAGE = document.getElementById('TileMap_Village_Tester');
    const IMAGE_TILE = 32;
    const ROWS = GAME_DIMENSIONS.GAME_HEIGHT / IMAGE_TILE;
    const COLUMNS = GAME_DIMENSIONS.GAME_WIDTH / IMAGE_TILE;

    console.log(ROWS, COLUMNS);

    for (let row = 0; row < ROWS.length; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        this.ctx.drawImage(
          TILE_IMAGE,
          0 * IMAGE_TILE,
          0 * IMAGE_TILE,
          IMAGE_TILE,
          IMAGE_TILE,
          col * GAME_DIMENSIONS.GRID_SIZE,
          row * GAME_DIMENSIONS.GRID_SIZE,
          GAME_DIMENSIONS.GRID_SIZE,
          GAME_DIMENSIONS.GRID_SIZE,
        );
      }
    }
  }
  renderFullImage() {
    this.ctx.drawImage(
      this.mapManager.fullImage,
      -this.cameraManager.cameraX,
      -this.cameraManager.cameraY,
    );
  }
  renderCameraOverlay(player) {
    this.ctx.save();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'blue';
    this.ctx.strokeRect(
      player.x - this.cameraManager.cameraX,
      player.y - this.cameraManager.cameraY,
      player.width,
      player.height,
    );

    this.ctx.restore();
  }
}
