import { GAME_DIMENSIONS } from '../core/constants.js';
export class Player {
  constructor() {
    this.width = 64;
    this.height = 64;
    this.x = (GAME_DIMENSIONS.GAME_WIDTH - this.width) / 2;
    this.y = (GAME_DIMENSIONS.GAME_HEIGHT - this.height) / 2;

    this.speed = 150; // Pixels Per Seconds
    this.speedMultiplier = 1;
  }
  update(deltaTime, keys) {
    let dx = 0;
    let dy = 0;

    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    //Normalise Diagonal Movement
    if (dx || dy) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx / +len;
      dy /= len;

      this.x += dx * this.speed * this.speedMultiplier * deltaTime;
      this.y += dy * this.speed * this.speedMultiplier * deltaTime;
    }

    //keep player
    this.x = Math.max(
      0,
      Math.min(GAME_DIMENSIONS.GAME_WIDTH - this.width, this.x),
    );
    this.y = Math.max(
      0,
      Math.min(GAME_DIMENSIONS.GAME_HEIGHT - this.height, this.y),
    );
  }
}
