export const GAME_DIMENSIONS = {
  GAME_HEIGHT: 360,
  GAME_WIDTH: 640,
  GRID_SIZE: 32,
  GAME_TILE: 32,
  ENEMY_DESPAWN_MARGIN: 10,
};
export const ASPECT_RATIO = 16 / 9;
export const CANVAS_MARGIN = 0;
export const GAME_STATE = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  MENU: 'menu',
  GAME_OVER: 'gameOver',
  MISSION_COMPLETE: 'missionComplete',
};
export const ENEMY_BEHAVIOUR_TYPES = {
  SEEK: 'seek',
  DRIFT: 'drift',
};

export const PARTICLE_BEHAVIOUR_TYPES = {
  RADIAL: 'radial',
  IMPLOSION: 'implosion',
};

export const PARTICLE_TYPES = {
  SPARKS: 'sparks',
  SMOKE: 'smoke',
  IMPLOSION: 'implosion',
};

export const ENEMY_TYPES = {
  NORMAL: {
    pushbackForce: 100,
    pushbackImmune: false,
  },
  HEAVY: {
    pushbackForce: 0,
    pushbackImmune: true,
  },
  LIGHT: {
    pushbackForce: 800,
    pushbackImmune: false,
  },
};

export const ENEMY_SPAWN = {
  DESPAWN_MARGIN: 200,
  SPAWN_MARGIN: 10,
  SPAWN_INTERVAL: 1,
};

export const ENEMY_HIT_INVINCIBILITY_DURATION = 2;
export const PUSHBACK_DECAY = 800;
export const PARTICLE_POOL_SIZE = 200;
export const ENEMY_POOL_SIZE = 10;

export const GAME_EVENTS = {
  // Audio
  SOUND: 'sound',
  MUTE: 'mute',
  //Game State
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RETURN_TO_MENU: 'game:returnToMenu',
  MISSION_COMPLETE: 'mission:complete',
  // Player Related
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_DIED: 'player:died',
  // Enemy Related
  ENEMY_DAMAGED: 'enemy:damaged',
  ENEMY_DIED: 'enemy:died',
  ENEMY_KILLED_COUNT: 'enemy:killedCount',
};
