import { GAME_DIMENSIONS, PUSHBACK_DECAY } from '../core/constants.js';
import { playerData } from '../data/playerData.js';
import { getPythagorus } from '../utils/getPythagorus.js';
export class Player {
  constructor() {
    this.width = playerData.width;
    this.height = playerData.height;
    this.collisionRadius = playerData.collisionRadius;
    this.x = (GAME_DIMENSIONS.GAME_WIDTH - this.width) / 2;
    this.y = (GAME_DIMENSIONS.GAME_HEIGHT - this.height) / 2;
    this.invincibilityDuration = playerData.invincibilityDuration;
    this.invincible = false;
    this.invincibilityTimer = 0;
    this.collisionDamage = playerData.collisionDamage;
    this.speed = playerData.speed; // Pixels Per Seconds
    this.maxHealth = playerData.maxHealth;
    this.speedMultiplier = 1;
    this.health = playerData.maxHealth;

    this.pushbackForce = playerData.pushbackForce;
    this.pushVx = 0;
    this.pushVy = 0;
  }
  resetPlayer() {
    this.x = (GAME_DIMENSIONS.GAME_WIDTH - this.width) / 2;
    this.y = (GAME_DIMENSIONS.GAME_HEIGHT - this.height) / 2;

    this.speed = playerData.speed; // Pixels Per Seconds
    this.speedMultiplier = 1;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invincibilityTimer = 0;
    this.pushVx = 0;
    this.pushVy = 0;
  }
  update(deltaTime, keys) {
    if (this.invincible) {
      this.invincibilityTimer -= deltaTime;
      if (this.invincibilityTimer <= 0) {
        this.invincible = false;
        this.invincibilityTimer = 0;
      }
    }

    if (this.pushVx !== 0 || this.pushVy !== 0) {
      this.x += this.pushVx * deltaTime;
      this.y += this.pushVy * deltaTime;

      const speed = getPythagorus(this.pushVx, this.pushVy);
      const decay = PUSHBACK_DECAY * deltaTime;

      if (speed <= decay) {
        this.pushVx = 0;
        this.pushVy = 0;
      } else {
        const ratio = (speed - decay) / speed;
        this.pushVx *= ratio;
        this.pushVy *= ratio;
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
      const len = getPythagorus(dx, dy);
      dx /= len;
      dy /= len;

      this.x += dx * this.speed * this.speedMultiplier * deltaTime;
      this.y += dy * this.speed * this.speedMultiplier * deltaTime;
    }

    //keep player
    // this.x = Math.max(
    //   0,
    //   Math.min(GAME_DIMENSIONS.GAME_WIDTH - this.width, this.x),
    // );
    // this.y = Math.max(
    //   0,
    //   Math.min(GAME_DIMENSIONS.GAME_HEIGHT - this.height, this.y),
    // );
  }
  applyPushback(dirX, dirY, force) {
    this.pushVx = dirX * force;
    this.pushVy = dirY * force;
  }
  takeDamage(damageAmount) {
    if (this.invincible) return false;

    this.health = Math.max(0, this.health - damageAmount);
    this.invincible = true;
    this.invincibilityTimer = this.invincibilityDuration;
    return true;
  }
  isDead() {
    return this.health <= 0;
  }
}
