export class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, fn) {
    //Register a new event listener
    (this.listeners[event] ??= []).push(fn);
  }
  off(event, fn) {
    // Removes an event listener
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(l => l != fn);
  }
  emit(event, ...args) {
    // Calls all listeners associated with an event
    this.listeners[event]?.forEach(fn => fn(...args));
  }
}
