import { GAME_DIMENSIONS } from '../core/constants.js';
import { playerData } from '../data/playerData.js';
export class Player {
  constructor() {
    this.width = playerData.width;
    this.height = playerData.height;
    this.collisionRadius = playerData.collisionRadius;
    this.x = (GAME_DIMENSIONS.GAME_WIDTH - this.width) / 2;
    this.y = (GAME_DIMENSIONS.GAME_HEIGHT - this.height) / 2;
    this.invincibilityDuration = playerData.invincibilityDuration;
    this.invincible = false;
    this.invinciblityTimer = 0;

    this.speed = playerData.speed; // Pixels Per Seconds
    this.maxHealth = playerData.maxHealth;
    this.speedMultiplier = 1;
    this.health = playerData.maxHealth;
  }
  resetPlayer() {
    this.x = (GAME_DIMENSIONS.GAME_WIDTH - this.width) / 2;
    this.y = (GAME_DIMENSIONS.GAME_HEIGHT - this.height) / 2;

    this.speed = playerData.speed; // Pixels Per Seconds
    this.speedMultiplier = 1;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invinciblityTimer = 0;
  }
  update(deltaTime, keys) {
    if (this.invincible) {
      this.invinciblityTimer -= deltaTime;
      if (this.invinciblityTimer <= 0) {
        this.invincible = false;
        this.invinciblityTimer = 0;
      }
    }
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
  takeDamage(damageAmount) {
    if (this.invincible) return false;

    this.health = Math.max(0, this.health - damageAmount);
    this.invincible = true;
    this.invinciblityTimer = this.invincibilityDuration;
    return true;
  }
  isDead() {
    console.log(this.health);
    return this.health <= 0;
  }
}
