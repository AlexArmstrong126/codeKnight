export class ObjectPooler {
  constructor(factoryFn, poolSize) {
    this.factoryFn = factoryFn;
    this.pool = []; // Holds objects ready to be used
    this.active = []; //Holds active objects

    for (let i = 0; i < poolSize; i++) {
      this.pool.push(this.factoryFn());
    }
  }
  get() {
    // Retreive object from pool
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.factoryFn();
      console.log(`[DEV] Pool expanded, new object created`);
    }
    this.active.push(obj);
    return obj;
  }
  updateAll(dt, ...args) {
    // Loop through all active objects and call update method
    for (let index = this.active.length - 1; index >= 0; index--) {
      const obj = this.active[index];
      obj.update(dt, ...args);

      if (!obj.active) {
        this.release(obj);
      }
    }
  }
  release(obj) {
    // Deactivates object, resets properties and return to pool for future use
    const index = this.active.indexOf(obj);
    if (index > -1) {
      this.active.splice(index, 1);
      obj.reset();
      this.pool.push(obj);
    }
  }
  releaseAll() {
    // Deactivates and releases all objects and return active list to pool
    for (let i = 0; i < this.active.length; i++) {
      this.active[i].reset();
      this.pool.push(this.active[i]);
    }
    this.active = [];
  }
}
