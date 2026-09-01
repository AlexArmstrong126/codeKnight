import { GAME_EVENTS } from '../core/constants.js';
export class UIManager {
  constructor(events) {
    this.events = events;

    // HUD
    this.hudEl = document.getElementById('hud');
    this.healthBarFillEl = document.getElementById('healthBarFill');
    this.timerEl = document.getElementById('timer');

    // UI Panels
    this.mainMenuEl = document.getElementById('mainMenu');
    this.pauseMenuEl = document.getElementById('pauseMenu');
    this.loadingScreenEl = document.getElementById('loadingScreen');
    this.gameOverMenuEl = document.getElementById('gameOverMenu');
    this.missionCompleteMenuEl = document.getElementById('missionCompleteMenu');

    this.setUpEventListeners();
  }
  setUpEventListeners() {
    document.querySelectorAll('[data-action="start"]').forEach(btn => {
      btn?.addEventListener('click', () =>
        this.events.emit(GAME_EVENTS.GAME_START),
      );
    });
    document.querySelectorAll('[data-action="resume"]').forEach(btn => {
      btn?.addEventListener('click', () =>
        this.events.emit(GAME_EVENTS.GAME_RESUME),
      );
    });
    document.querySelectorAll('[data-action="returnToMenu"]').forEach(btn => {
      btn?.addEventListener('click', () =>
        this.events.emit(GAME_EVENTS.GAME_RETURN_TO_MENU),
      );
    });
    document.querySelectorAll('[data-action="mute"]').forEach(btn => {
      btn?.addEventListener('click', () => this.events.emit(GAME_EVENTS.MUTE));
    });

    document.querySelectorAll('[data-action]').forEach(btn => {
      // btn?.addEventListener('mouseenter', () =>
      //   this.events.emit(GAME_EVENTS.SOUND, 'button_click'),
      // );
    });
  }
  hideAllPanels() {
    [
      this.mainMenuEl,
      this.pauseMenuEl,
      this.loadingScreenEl,
      this.gameOverMenuEl,
      this.missionCompleteMenuEl,
    ].forEach(p => p?.classList.remove('active'));
  }
  showPanel(panelId) {
    this.hideAllPanels();
    this[`${panelId}El`]?.classList.add('active');
  }
  showHUD() {
    if (this.hudEl) {
      this.hudEl.style.display = 'block';
    }
  }
  hideHUD() {
    if (this.hudEl) {
      this.hudEl.style.display = 'none';
    }
  }
  updateTimer(time) {
    if (!this.timerEl) return;
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    this.timerEl.textContent = `${mins} : ${String(secs).padStart(2, '0')}`;
  }
  updateHealthBar(health, maxHealth) {
    if (!this.healthBarFillEl) return;

    const pct = Math.max(0, health / maxHealth);
    this.healthBarFillEl.style.setProperty('--health-pct', pct);
  }
}
