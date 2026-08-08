import { GAME_DIMENSIONS } from '../core/constants.js';

export class ResizeSystem {
  constructor(canvas) {
    this.canvas = canvas;
  }

  resize() {
    const ratio = 16 / 9;
    let w;
    let h;

    const canvasMargin = 15;

    const availableWidth = window.innerWidth - canvasMargin * 2;
    const availableHeight = window.innerHeight - canvasMargin * 2;

    if (availableWidth / availableHeight > ratio) {
      h = availableHeight;
      w = h * ratio;
    } else {
      w = availableWidth;
      h = w / ratio;
    }

    this.canvas.width = GAME_DIMENSIONS.GAME_WIDTH;
    this.canvas.height = GAME_DIMENSIONS.GAME_HEIGHT;

    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.style.margin = `${canvasMargin}px`;
  }
}
