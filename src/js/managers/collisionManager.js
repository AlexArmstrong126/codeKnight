import { GAME_EVENTS } from '../core/constants.js';

export class CollisionManager {
  constructor(collisionSystem, events) {
    this.collisionSystem = collisionSystem;
    this.events = events;
  }
  update(player, enemy) {
    this.checkPlayerVsEnemies(player, enemy);
  }
  checkPlayerVsEnemies(player, enemies) {
    for (const enemy of enemies) {
      if (!enemy.active) {
        continue;
      }
      if (this.collisionSystem.checkCircleCircle(player, enemy)) {
        enemy.active = false;
        const damageApplied = player.takeDamage(enemy.damage);

        if (damageApplied) {
          this.events.emit(
            GAME_EVENTS.PLAYER_DAMAGED,
            player.health,
            player.maxHealth,
          );
          if (player.isDead()) {
            this.events.emit(GAME_EVENTS.PLAYER_DIED);
            return;
          }
        }
        this.events.emit(GAME_EVENTS.ENEMY_DIED, enemy);
      }
    }
  }
  checkPlayerVsObjects() {}
}
