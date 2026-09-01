import { GAME_DIMENSIONS } from '../core/constants.js';
import { playerData } from '../data/playerData.js';

export class CameraManager {
  constructor(map) {
    this.map = map;

    this.cameraHeight = GAME_DIMENSIONS.GAME_HEIGHT;
    this.cameraWidth = GAME_DIMENSIONS.GAME_WIDTH;

    this.cameraX = 0;
    this.cameraY = 0;

    this.maxCameraX = Math.max(0, this.map.fullImage.width - this.cameraWidth);

    this.maxCameraY = Math.max(
      0,
      this.map.fullImage.height - this.cameraHeight,
    );
  }
  moveCamera(deltaTime, player) {
    // Desired camera position: keep player centred
    let targetCameraX = player.x + player.width / 2 - this.cameraWidth / 2;

    let targetCameraY = player.y + player.height / 2 - this.cameraHeight / 2;

    // Don't allow camera outside the map
    this.cameraX = Math.max(0, Math.min(this.maxCameraX, targetCameraX));

    this.cameraY = Math.max(0, Math.min(this.maxCameraY, targetCameraY));

    // Keep the PLAYER inside the map
    player.x = Math.max(
      0,
      Math.min(this.map.fullImage.width - player.width, player.x),
    );

    player.y = Math.max(
      0,
      Math.min(this.map.fullImage.height - player.height, player.y),
    );
  }
}
