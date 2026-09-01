import { ENEMY_BEHAVIOUR_TYPES, ENEMY_TYPES } from '../core/constants.js';

export const enemyData = {
  skeleton: {
    width: 32,
    height: 32,
    speed: 160,
    health: 2,
    collisionRadius: 32,
    damage: 10,
    imageName: 'skeleton_axe_right',
    behaviourType: ENEMY_BEHAVIOUR_TYPES.SEEK,
    pushbackForce: ENEMY_TYPES.LIGHT.pushbackForce,
    pushbackImmune: ENEMY_TYPES.LIGHT.pushbackImmune,
    sounds: {
      hit: 'enemy_hurt_1',
      death: 'enemy_hurt_1',
    },
  },
  bronzeKnight: {
    width: 32,
    height: 32,
    speed: 150,
    health: 1,
    collisionRadius: 32,
    damage: 1,
    imageName: 'bronze_knight',
    behaviourType: ENEMY_BEHAVIOUR_TYPES.DRIFT,
    pushbackForce: ENEMY_TYPES.HEAVY.pushbackForce,
    pushbackImmune: ENEMY_TYPES.HEAVY.pushbackImmune,
    sounds: {
      hit: 'enemy_hurt_2',
      death: 'enemy_hurt_2',
    },
  },
};
