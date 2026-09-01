import { getPythagorus } from '../../../utils/getPythagorus.js';
const HOVER_DURATION_MIN = 0.2;
const HOVER_DURATION_MAX = 0.6;
const BURST_DURATION = 0.25;
const BURST_DRAG = 3;
const ARRIVE_RADIUS = 5;
const IMPLOSE_ACCEL = 700;

export class ImplosionBehaviour {
  constructor(originX, originY) {
    this.originX = originX;
    this.originY = originY;
    this.hoverDuration =
      HOVER_DURATION_MAX +
      Math.random() * (HOVER_DURATION_MAX - HOVER_DURATION_MIN);
  }
  update(particle, deltaTime) {
    const age = particle.age;
    if (age < BURST_DURATION) {
      // Burst outward
      particle.x += particle.vX * deltaTime;
      particle.y += particle.vY * deltaTime;
      particle.vX *= Math.exp(-BURST_DRAG * deltaTime);
      particle.vY *= Math.exp(-BURST_DRAG * deltaTime);
    } else if (age < BURST_DURATION + this.hoverDuration) {
      // hover
    } else {
      const dx = this.originX - particle.x;
      const dy = this.originY - particle.y;
      const dist = getPythagorus(dx, dy);

      if (dist < ARRIVE_RADIUS) {
        particle.active = false;
        return;
      }
      const nx = dx / dist;
      const ny = dy / dist;
      particle.vX += nx * IMPLOSE_ACCEL * deltaTime;
      particle.vY += ny * IMPLOSE_ACCEL * deltaTime;
      particle.x += particle.vX * deltaTime;
      particle.y += particle.vY * deltaTime;
    }
  }
}
