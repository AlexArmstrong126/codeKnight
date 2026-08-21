// Define Enemy Class

import { GAME_DIMENSIONS } from '../core/constants.js';

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
  }
  spawn(x, y) {
    console.log(`[DEV] spawning: ${this.data.imageName} ${x}, ${y}`);
    this.x = x;
    this.y = y;
    this.health = this.data.health;
    this.active = true;
  }
  reset() {
    this.active = false;
    this.health = this.data.health;
    if (this.behaviour.reset) {
      this.behaviour.reset();
    }
  }

  update(dt, player) {
    // Move to the player

    if (!this.active) return;
    if (
      this.x < -GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN ||
      this.x >
        GAME_DIMENSIONS.GAME_WIDTH + GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN ||
      this.y < -GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN ||
      this.y > GAME_DIMENSIONS.GAME_WIDTH + GAME_DIMENSIONS.ENEMY_DESPAWN_MARGIN
    ) {
      this.active = false;
      return;
    }
    const oldX = this.x;
    this.behaviour.update(this, dt, player);
    if (this.x < this.oldX) {
      this.facingLeft = true;
    } else {
      this.facingLeft = false;
    }
  }
}
