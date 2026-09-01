// Define Enemy Class

import {
  GAME_DIMENSIONS,
  ENEMY_HIT_INVINCIBILITY_DURATION,
  PUSHBACK_DECAY,
} from '../core/constants.js';
import { getPythagorus } from '../utils/getPythagorus.js';

export class Enemy {
  constructor(data, behaviour) {
    this.data = data;
    this.behaviour = behaviour;

    // Position and Dimension
    this.x = 0;
    this.y = 0;
    this.width = data.width;
    this.height = data.height;

    // Stats
    this.health = data.health;
    this.speed = data.speed;
    this.damage = data.damage;
    this.collisionRadius = data.collisionRadius;
    this.active = false;
    this.facingLeft = false;
    this.invincible = false;
    this.invincibilityTimer = 0;
    this.pushVx = 0;
    this.pushVy = 0;
  }
  spawn(x, y) {
    // console.log(`[DEV] spawning: ${this.data.imageName} ${x}, ${y}`);
    this.x = x;
    this.y = y;
    this.health = this.data.health;
    this.active = true;
  }
  reset() {
    this.active = false;
    this.health = this.data.health;
    this.pushVx = 0;
    this.pushVy = 0;
    if (this.behaviour.reset) {
      this.behaviour.reset();
    }
  }

  update(deltaTime, player) {
    // Move to the player

    if (!this.active) return;
    if (this.invincible) {
      this.invincibilityTimer -= deltaTime;
      if (this.invincibilityTimer <= 0) {
        this.invincible = false;
        this.invincibilityTimer = 0;
      }
    }

    if (
      this.x < -GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN ||
      this.x >
        GAME_DIMENSIONS.GAME_WIDTH + GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN ||
      this.y < -GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN ||
      this.y >
        GAME_DIMENSIONS.GAME_HEIGHT + GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN
    ) {
      this.active = false;
      return;
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

    const oldX = this.x;
    this.behaviour.update(this, deltaTime, player);
    this.facingLeft = this.x < oldX;
  }
  applyPushback(dirX, dirY, force) {
    this.pushVx = dirX * force;
    this.pushVy = dirY * force;
  }
  takeDamage(damageAmount) {
    if (this.invincible) return false;

    this.health = Math.max(0, this.health - damageAmount);
    this.invincible = true;
    this.invincibilityTimer = ENEMY_HIT_INVINCIBILITY_DURATION;
    return true;
  }
  isDead() {
    return this.health <= 0;
  }
}
