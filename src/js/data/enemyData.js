import { ENEMY_BEHAVIOUR_TYPES } from '../core/constants.js';

export const enemyData = {
  skeleton: {
    width: 64,
    height: 64,
    speed: 160,
    health: 1,
    collisionRadius: 32,
    damage: 10,
    imageName: 'skeleton_axe_right',
    behaviourType: ENEMY_BEHAVIOUR_TYPES.SEEK,
  },
  bronzeKnight: {
    width: 64,
    height: 64,
    speed: 150,
    health: 1,
    collisionRadius: 32,
    damage: 1,
    imageName: 'bronze_knight',

    behaviourType: ENEMY_BEHAVIOUR_TYPES.DRIFT,
  },
};
