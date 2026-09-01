import { GAME_EVENTS } from '../core/constants.js';
import { getPythagorus } from '../utils/getPythagorus.js';

export class CollisionManager {
  constructor(collisionSystem, events, camera) {
    this.collisionSystem = collisionSystem;
    this.events = events;
    this.camera = camera;
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
        const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2);

        const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2);

        const dist = getPythagorus(dx, dy);

        const nx = dist > 0 ? dx / dist : 1;
        const ny = dist > 0 ? dy / dist : 0;

        const enemyDamageApplied = enemy.takeDamage(player.collisionDamage);

        if (enemyDamageApplied) {
          this.events.emit(GAME_EVENTS.ENEMY_DAMAGED, enemy);
          if (enemy.isDead()) {
            enemy.active = false;
            this.events.emit(GAME_EVENTS.ENEMY_DIED, enemy);
          } else if (!enemy.data.pushbackImmune) {
            enemy.applyPushback(-nx, -ny, enemy.data.pushbackForce);
          }
        }

        const playerDamageApplied = player.takeDamage(enemy.damage);

        if (playerDamageApplied) {
          this.events.emit(
            GAME_EVENTS.PLAYER_DAMAGED,
            player.health,
            player.maxHealth,
          );
          if (player.isDead()) {
            this.events.emit(GAME_EVENTS.PLAYER_DIED);
            return;
          }
          if (enemy.data.pushbackImmune) {
            player.applyPushback(nx, ny, player.pushbackForce);
          }
        }
      }
    }
  }
  checkPlayerVsObjects() {}
}
