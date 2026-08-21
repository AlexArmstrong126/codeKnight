export class CollisionSystem {
  constructor() {}
  checkCircleCircle(circleA, circleB) {
    const ax = circleA.x + circleA.width / 2;
    const ay = circleA.y + circleA.height / 2;

    const bx = circleB.x + circleB.width / 2;
    const by = circleB.y + circleB.height / 2;

    const dx = ax - bx;
    const dy = ay - by;

    const disSq = dx * dx + dy * dy;
    const radSum = circleA.collisionRadius + circleB.collisionRadius;

    return disSq < radSum * radSum;
  }
  checkSquareSquare() {}
}
