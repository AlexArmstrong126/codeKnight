import { RadialBehaviour } from './radialBehaviour.js';
import { ImplosionBehaviour } from './implosionBehaviour.js';
import { PARTICLE_BEHAVIOUR_TYPES } from '../../../core/constants.js';
export class ParticleBehaviourFactory {
  static create(behaviourType, opts = {}) {
    switch (behaviourType) {
      case PARTICLE_BEHAVIOUR_TYPES.RADIAL:
        return new RadialBehaviour();
      case PARTICLE_BEHAVIOUR_TYPES.IMPLOSION:
        return new ImplosionBehaviour(opts.originX, opts.originY);
      default:
        console.log(
          `[DEV] ${behaviourType} is not connected to a particular behaviour`,
        );
        return new RadialBehaviour();
    }
  }
}
