import { PARTICLE_BEHAVIOUR_TYPES } from '../core/constants.js';
export const particleData = {
  sparks: {
    count: 12,
    color: '#a31717',
    speed: 180,
    lifetime: 0.5,
    fade: false,
    shrink: true,
    size: 40,
    gravity: {
      x: 0,
      y: 250,
    },
    behaviourType: PARTICLE_BEHAVIOUR_TYPES.RADIAL,
  },
  smoke: {
    count: 12,
    color: '#ffffff',
    speed: 70,
    lifetime: 2.5,
    fade: true,
    shrink: false,
    size: 20,
    gravity: {
      x: 0,
      y: -250,
    },
    behaviourType: PARTICLE_BEHAVIOUR_TYPES.RADIAL,
  },
  implosion: {
    count: 40,
    color: '#ffffff',
    speed: 600,
    lifetime: 2,
    fade: false,
    shrink: true,
    size: 10,
    gravity: {
      x: 0,
      y: 0,
    },
    behaviourType: PARTICLE_BEHAVIOUR_TYPES.IMPLOSION,
  },
};
