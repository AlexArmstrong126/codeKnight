import { GAME_DIMENSIONS, GAME_STATE } from '../core/constants.js';

export class RenderSystem {
  constructor(canvas, imageManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.imageManager = imageManager;
  }

  render(state, player, enemies = []) {
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
      this.renderGrid();
      this.renderEnemies(enemies);
      this.renderPlayer(player);
    }
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

  renderPlayer(player) {
    const playerImage = this.imageManager.get('knight');

    if (player.invincible) {
      this.ctx.globalAlpha =
        0.2 + 0.6 * Math.abs(Math.sin(player.invinciblityTimer * 10));
    }

    if (playerImage) {
      this.ctx.drawImage(
        playerImage,
        player.x,
        player.y,
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
      const enemyAsset = this.imageManager.get(enemy.data.imageName);
      if (enemyAsset) {
        //TODO: THIS NEEDS FIXED
        this.ctx.save();
        if (enemy.facingLeft) {
          this.ctx.translate(enemy.x + enemy.width, enemy.y);
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(enemyAsset, 0, 0, enemy.width, enemy.height);
        } else {
          this.ctx.drawImage(
            enemyAsset,
            enemy.x,
            enemy.y,
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
}
