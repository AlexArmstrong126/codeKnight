const MOVE_DURATION = 7;
const IDLE_DURATION_MIN = 2;
const IDLE_DURATION_MAX = 5;

export class DriftBehaviour {
  constructor() {
    this.angle = 0;
    this.phaseTimer = 0;
    this.phaseDuration = MOVE_DURATION;
    this.idling = false;
    this.firstMove = true;
  }
  update(enemy, deltaTime, player) {
    if (this.firstMove) {
      this.firstMove = false;
      this.angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    }

    this.phaseTimer += deltaTime;
    if ((this, this.phaseTimer >= this.phaseDuration)) {
      this.phaseDuration = 0;
      if (this.idling) {
        this.angle = Math.random() * Math.PI * 2;
        this.phaseDuration = MOVE_DURATION;
      } else {
        this.phaseDuration =
          IDLE_DURATION_MIN +
          Math.random() * (IDLE_DURATION_MAX - IDLE_DURATION_MIN);
      }
      this.idling = !this.idling;
    }

    if (!this.idling) {
      const dx = Math.cos(this.angle);
      const dy = Math.sin(this.angle);
      enemy.x += dx * enemy.speed * deltaTime;
      enemy.y += dy * enemy.speed * deltaTime;
    }
    // this.changeTimer += dt;
    // if (this.changeTimer >= this.changeInterval) {
    //   this.angle = Math.random() * Math.PI * 2;
    //   this.changeTimer = 0;
    // }

    // const dx = Math.cos(this.angle);
    // const dy = Math.sin(this.angle);

    // enemy.x += dx * enemy.speed * dt;
    // enemy.y += dy * enemy.speed * dt;
  }
  reset() {
    this.angle = 0;
    this.phaseTimer = 0;
    this.phaseDuration = 0;
    this.idling = false;
    this.firstMove = false;
  }
}
