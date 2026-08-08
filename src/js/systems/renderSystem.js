import { GAME_DIMENSIONS } from '../core/constants.js';

export class RenderSystem {
  constructor(canvas, imageManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.imageManager = imageManager;
  }

  render(player) {
    //background
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      0,
      0,
      GAME_DIMENSIONS.GAME_WIDTH,
      GAME_DIMENSIONS.GAME_HEIGHT,
    );
    this.renderGrid();
    this.renderPlayer(player);
  }

  renderGrid() {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;

    for (
      let i = 0;
      i < GAME_DIMENSIONS.GAME_WIDTH;
      i += GAME_DIMENSIONS.GRID_SIZE
    ) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, GAME_DIMENSIONS.GAME_HEIGHT);
      this.ctx.stroke();
    }

    for (
      let i = 0;
      i < GAME_DIMENSIONS.GAME_HEIGHT;
      i += GAME_DIMENSIONS.GRID_SIZE
    ) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(GAME_DIMENSIONS.GAME_WIDTH, i);
      this.ctx.stroke();
    }
  }

  renderPlayer(player) {
    const playerImage = this.imageManager.get('knights');

    if (playerImage) {
      this.ctx.drawImage(
        playerImage,
        player.x,
        player.y,
        player.width,
        player.height,
      );
    } else {
      const placeHolderImage = this.imageManager.get('placeHolder_Skeleton');

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
  }
}
