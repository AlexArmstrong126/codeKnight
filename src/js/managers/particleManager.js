import { GAME_EVENTS, PARTICLE_POOL_SIZE } from '../core/constants.js';
import { particleData } from '../data/particleData.js';
import { ParticleBehaviourFactory } from '../entities/behaviours/particle/particleBehaviourFactory.js';
import { Particle } from '../entities/particle.js';
import { ObjectPooler } from '../utils/objectPooler.js';

// TODO: Particles seem to move with the player even if the enemy dies in a spot: particles on death should not move with player, needs fixed in future
// Think its something to do with the camera x and y coordinates
export class ParticleManager {
  constructor(events, camera) {
    this.events = events;
    this.cameraManager = camera;
    this._registerEvents(events);
    this.particlePool = new ObjectPooler(
      () => new Particle(),
      PARTICLE_POOL_SIZE,
    );
  }
  _registerEvents(events) {
    events.on(GAME_EVENTS.ENEMY_DAMAGED, enemy => {
      if (!enemy.data.particles?.hit) return;
      const { type, count, color } = enemy.data.particles?.hit;
      this.spawnEffect(
        type,
        enemy.x - this.cameraManager.cameraX + enemy.width / 2,
        enemy.y - this.cameraManager.cameraY + enemy.height / 2,
        { count: count, color: color },
      );
    });
    events.on(GAME_EVENTS.ENEMY_DIED, enemy => {
      if (!enemy.data.particles?.death) return;
      const { type, count, color } = enemy.data.particles?.death;
      this.spawnEffect(
        type,
        enemy.x - this.cameraManager.cameraX + enemy.width / 2,
        enemy.y - this.cameraManager.cameraY + enemy.height / 2,
        { count: count, color: color },
      );
    });
  }
  spawnEffect(particleType, posX, posY, opts = {}) {
    const data = particleData[particleType];

    if (!data) {
      console.warn(`Unknown particle type ${particleType}`);
      return;
    }
    const count = opts.count ?? data.count;
    const color = opts.color ?? data.color;

    for (let i = 0; i < count; i++) {
      const p = this.particlePool.get();
      const angle = Math.random() * Math.PI * 2;
      const speed = data.speed * (0.5 + Math.random() * 0.5);

      console.log(posX, posY);

      p.active = true;
      p.x = posX;
      p.y = posY;
      p.vX = Math.cos(angle) * speed;
      p.vY = Math.sin(angle) * speed;
      p.lifetime = data.lifetime;
      p.age = 0;
      p.size = data.size;
      p.baseSize = data.size;
      p.color = color;
      p.fade = data.fade;
      p.shink = data.shrik;
      p.gravity = {
        x: data.gravity.x,
        y: data.gravity.y,
      };
      p.behaviour = ParticleBehaviourFactory.create(data.behaviourType, {
        originX: posX,
        originY: posY,
      });
    }
  }
  update(deltaTime) {
    this.particlePool.updateAll(deltaTime);
  }
  reset() {
    this.particlePool.releaseAll();
  }
  getActiveParticles() {
    return this.particlePool.active;
  }
}
