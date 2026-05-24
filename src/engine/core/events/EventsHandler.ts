type Events<T> = {
  [key in keyof T]: ((event: T[key]) => void)[];
};

export class EventsHandler<T extends Record<string, unknown>> {
  private events: Events<T> = {} as Events<T>;

  on<K extends keyof T>(eventType: K, callback: (arg: T[K]) => void): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(callback);
  }

  off<K extends keyof T>(eventType: K, callback: (arg: T[K]) => void): void {
    if (!this.events[eventType]) return;
    this.events[eventType] = this.events[eventType].filter(
      (cb) => cb !== callback,
    );
  }

  trigger<K extends keyof T>(eventType: K, arg: T[K]): void {
    if (!this.events[eventType]) return;
    this.events[eventType].forEach((callback) => callback(arg));
  }

  once<K extends keyof T>(eventType: K, callback: (arg: T[K]) => void): void {
    const onceCallback = (arg: T[K]) => {
      callback(arg);
      this.off(eventType, onceCallback);
    };
    this.on(eventType, onceCallback);
  }

  destroy(): void {
    this.events = {} as Events<T>;
  }
}
