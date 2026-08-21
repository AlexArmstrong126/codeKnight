export const GAME_DIMENSIONS = {
  GAME_HEIGHT: 720,
  GAME_WIDTH: 1280,
  GRID_SIZE: 20,
  ENEMY_DESPAWN_MARGIN: 10,
};
export const ASPECT_RATIO = 16 / 9;
export const CANVAS_MARGIN = 15;
export const GAME_STATE = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  MENU: 'menu',
  GAME_OVER: 'gameOver',
};
export const ENEMY_BEHAVIOUR_TYPES = {
  SEEK: 'seek',
  DRIFT: 'drift',
};

export const ENEMY_SPAWN = {
  DESPAWN_MARGIN: 200,
  SPAWN_MARGIN: 10,
  SPAWN_INTERVAL: 1,
};

export const GAME_EVENTS = {
  // Audio
  SOUND: 'sound',
  //Game State
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RETURN_TO_MENU: 'game:returnToMenu',
  // Player Related
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_DIED: 'player:died',
  // Enemy Related
  ENEMY_DAMAGED: 'enemy:damaged',
  ENEMY_DIED: 'enemy:died',
};
