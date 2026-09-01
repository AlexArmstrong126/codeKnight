import { getPythagorus } from '../../utils/getPythagorus.js';
export class SeekBehaviour {
  constructor(camera) {
    this.camera = camera;
  }
  update(enemy, dt, player) {
    const dx =
      player.x -
      -this.camera.cameraX +
      player.width / 2 -
      (enemy.x + enemy.width / 2);
    const dy =
      player.y -
      this.camera.cameraY +
      player.height / 2 -
      (enemy.y + enemy.height / 2);
    const len = getPythagorus(dx, dy);

    if (len > 0) {
      const normalisedDx = dx / len;
      const normalisedDy = dy / len;
      enemy.x += normalisedDx * enemy.speed * dt;
      enemy.y += normalisedDy * enemy.speed * dt;
    }
  }
}
