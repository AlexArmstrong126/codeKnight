import { SeekBehaviour } from './seekBehaviour.js';
import { DriftBehaviour } from './driftBehaviour.js';
import { ENEMY_BEHAVIOUR_TYPES } from '../../core/constants.js';

export class BehaviourFactory {
  static create(behaviourType) {
    switch (behaviourType) {
      case ENEMY_BEHAVIOUR_TYPES.SEEK:
        return new SeekBehaviour();
      case ENEMY_BEHAVIOUR_TYPES.DRIFT:
        return new DriftBehaviour();
      default:
        console.log(
          `[DEV] ${behaviourType} is not connected to a particular behaviour`,
        );
        return SeekBehaviour();
    }
  }
}
