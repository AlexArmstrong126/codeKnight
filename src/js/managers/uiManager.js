export class UIManager {
  constructor(game) {
    this.game = game;
    this.setUpEventListeners();
  }
  setUpEventListeners() {
    document.getElementById('playBtn').onclick = () => {
      return this.game.startGame();
    };
    document.getElementById('resumeBtn').onclick = () => {
      return this.game.resume();
    };
    document.getElementById('quitBtn').onclick = () => {
      return this.game.returnToMenu();
    };
    document.querySelectorAll('button').forEach(btn => {
      btn.onmouseenter = () => {
        this.game.audioManager.play('button_click');
      };
    });
  }
  hideAllPanels() {
    document
      .querySelectorAll('.ui-panel')
      .forEach(p => p.classList.remove('active'));
  }
  showPanel(panelId) {
    this.hideAllPanels();
    document.getElementById(panelId).classList.add('active');
  }
  showTimer() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.style.display = 'block';
    }
  }
  hideTimer() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.style.display = 'none';
    }
  }
  updateTimer(time) {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = `${mins} : ${String(secs).padStart(2, '0')}`;
    }
  }
}
