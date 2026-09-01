import { GAME_DIMENSIONS, ENEMY_SPAWN } from '../core/constants.js';
import { enemyData } from '../data/enemyData.js';
export class EnemySpawnManager {
  constructor(enemyManager) {
    this.enemyManager = enemyManager;
    this.spawnTimer = 0;
    this.spawnInterval = ENEMY_SPAWN.SPAWN_INTERVAL;

    this.enemyTypes = [];
    for (const type in enemyData) {
      this.enemyTypes.push(type);
      console.log(type);
    }
  }
  update(dt) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnWave();
      this.spawnTimer -= this.spawnInterval;
    }
  }
  spawnWave() {
    const type =
      this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

    //Spawn from sides
    const edge = Math.floor(Math.random() * 4);
    let x;
    let y;

    switch (edge) {
      case 0: // Top
        x = Math.random() * GAME_DIMENSIONS.GAME_WIDTH;
        y = -ENEMY_SPAWN.SPAWN_MARGIN;
        break;
      case 1: // Right
        x = GAME_DIMENSIONS.GAME_WIDTH + ENEMY_SPAWN.SPAWN_MARGIN;
        y = Math.random() * GAME_DIMENSIONS.GAME_HEIGHT;
        break;
      case 2: // Bottom
        x = Math.random() * GAME_DIMENSIONS.GAME_WIDTH;
        y = GAME_DIMENSIONS.GAME_HEIGHT + ENEMY_SPAWN.SPAWN_MARGIN;
        break;
      case 3: // Left
        x = -ENEMY_SPAWN.SPAWN_MARGIN;
        y = Math.random() * GAME_DIMENSIONS.GAME_HEIGHT;
        break;
      default:
        x = -ENEMY_SPAWN.SPAWN_MARGIN;
        y = Math.random() * GAME_DIMENSIONS.GAME_HEIGHT;
    }

    this.enemyManager.spawn(type, x, y);
  }
  reset() {
    this.spawnTimer = 0;
  }
}
