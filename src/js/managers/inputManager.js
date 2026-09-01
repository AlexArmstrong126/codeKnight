export class InputManager {
  constructor(game) {
    this.game = game;
    this.setupInput();
  }

  setupInput(game) {
    window.addEventListener('keydown', e => {
      this.game.keys[e.key.toLowerCase()] = true;

      // ESC toggle
      if (e.key === 'Escape') {
        console.log(this.game.state.gameState);
        if (this.game.state.gameState === 'playing') {
          this.game.pause();
        } else if (this.game.state.gameState === 'menu') {
          return;
        } else {
          this.game.resume();
        }
      }
      if (e.code === 'Space') {
        console.log('Space bar pressed');
      }

      // Backtick toggles debugd
      if (e.key === '`') {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener('keyup', e => {
      this.game.keys[e.key.toLowerCase()] = false;
    });

    //clear all key values when context opens
    window.addEventListener('contextmenu', () => {
      this.game.keys = {};
    });

    window.addEventListener('blue', () => {
      this.game.keys = {};
    });
    window.addEventListener('contextmenu', () => {
      return console.log('right click');
    });
    window.addEventListener('click', () => {
      return console.log('left click');
    });
  }
}
