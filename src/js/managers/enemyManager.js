import { Enemy } from '../entities/enemy.js';
import { enemyData } from '../data/enemyData.js';
import { ObjectPooler } from '../utils/objectPooler.js';
import { enemyBehaviourFactory } from '../entities/behaviours/enemy/enemyBehaviourFactory.js';
import { GAME_EVENTS, ENEMY_POOL_SIZE } from '../core/constants.js';
export class EnemyManager {
  constructor(events) {
    this.pools = {};
    this.events = events;

    for (const type in enemyData) {
      this.pools[type] = new ObjectPooler(() => {
        const data = enemyData[type];
        const behaviour = enemyBehaviourFactory.create(data.behaviourType);
        return new Enemy(data, behaviour);
      }, ENEMY_POOL_SIZE);
    }
  }
  spawn(type, x, y) {
    const pool = this.pools[type];
    if (!pool) {
      console.warn('Unknown Enemy type', type);
      return null;
    }
    const enemy = pool.get();
    // this.events.emit(GAME_EVENTS.SOUND, 'bonus'); // This is for wave sounds later on
    enemy.spawn(x, y);
    return enemy;
  }

  getActiveEnemies(type) {
    const enemies = [];

    for (const type in this.pools) {
      enemies.push(...this.pools[type].active);
    }

    return enemies;
  }
  update(dt, player) {
    for (const type in this.pools) {
      this.pools[type].updateAll(dt, player);
    }
  }
  reset() {
    for (const type in this.pools) {
      this.pools[type].releaseAll();
    }
  }
}
