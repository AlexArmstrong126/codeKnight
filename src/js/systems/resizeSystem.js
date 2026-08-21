import {
  GAME_DIMENSIONS,
  ASPECT_RATIO,
  CANVAS_MARGIN,
} from '../core/constants.js';

export class ResizeSystem {
  constructor(canvas) {
    this.canvas = canvas;
  }

  resize() {
    let w;
    let h;

    const availableWidth = window.innerWidth - CANVAS_MARGIN * 2;
    const availableHeight = window.innerHeight - CANVAS_MARGIN * 2;

    if (availableWidth / availableHeight > ASPECT_RATIO) {
      h = availableHeight;
      w = h * ASPECT_RATIO;
    } else {
      w = availableWidth;
      h = w / ASPECT_RATIO;
    }

    this.canvas.width = GAME_DIMENSIONS.GAME_WIDTH;
    this.canvas.height = GAME_DIMENSIONS.GAME_HEIGHT;

    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.style.margin = `${CANVAS_MARGIN}px`;
  }
}
