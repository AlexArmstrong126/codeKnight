export class RadialBehaviour {
  update(particle, deltaTime) {
    particle.x += particle.vX * deltaTime;
    particle.y += particle.vY * deltaTime;
    particle.vX += particle.gravity.x * deltaTime;
    particle.vY += particle.gravity.y * deltaTime;
  }
}
