export class DriftBehaviour {
  constructor() {
    this.angle = Math.random() * Math.PI * 2;
    this.changeTimer = 0;
    this.changeInterval = 3;
  }
  update(enemy, dt, player) {
    this.changeTimer += dt;
    if (this.changeTimer >= this.changeInterval) {
      this.angle = Math.random() * Math.PI * 2;
      this.changeTimer = 0;
    }

    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);

    enemy.x += dx * enemy.speed * dt;
    enemy.y += dy * enemy.speed * dt;
  }
  reset() {
    this.angle = Math.random() * Math.PI * 2;
    this.changeTimer = 0;
  }
}
