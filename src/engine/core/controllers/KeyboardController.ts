type HandlerCallback = ({
  key,
  isDown,
}: {
  key: string;
  isDown: boolean;
}) => void;

export type KeyEventType =
  | "keydown"
  | "keyup"
  | "keypress"
  | `keydown:${string}`
  | `keyup:${string}`
  | `keypress:${string}`;

type Handlers = Partial<Record<KeyEventType, HandlerCallback[]>>;

export class KeyboardController {
  private keys: Set<string> = new Set();
  private handlers: Handlers = {};
  private shortcuts: Map<string, HandlerCallback[]> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("keypress", this.onKeyPress);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.keys.has(e.key)) {
      this.keys.add(e.key);
      this.executeHandlers(`keydown`, e.key, true);
      this.executeHandlers(`keydown:${e.key}`, e.key, true);
    }
    this.executeShortcuts();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (this.keys.has(e.key)) {
      this.keys.delete(e.key);
      this.executeHandlers(`keyup`, e.key, true);
      this.executeHandlers(`keyup:${e.key}`, e.key, false);
    }
  };

  private executeHandlers(event: KeyEventType, key: string, isDown: boolean) {
    this.handlers[event]?.forEach((handler) => handler({ key, isDown }));
  }

  private onKeyPress = (e: KeyboardEvent) => {
    this.executeHandlers("keypress", e.key, true);
  };

  public on(event: KeyEventType, callback: HandlerCallback) {
    this.handlers[event] ??= [];
    this.handlers[event].push(callback);
  }

  public onShortcut(key: string, callback: HandlerCallback) {
    if (!this.shortcuts.has(key)) {
      this.shortcuts.set(key, []);
    }
    this.shortcuts.get(key)!.push(callback);
  }

  public executeShortcuts() {
    this.shortcuts.forEach((callbacks, shortcut) => {
      const keys = shortcut.split("+");
      if (keys.every((key) => this.keys.has(key))) {
        callbacks.forEach((callback) =>
          callback({ key: shortcut, isDown: true }),
        );
      }
    });
  }

  public isActiveShortcut(shortcut: string): boolean {
    const keys = shortcut.split("+");
    return keys.every((key) => this.keys.has(key));
  }

  public destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("keypress", this.onKeyPress);
    this.handlers = {};
    this.keys.clear();
    this.shortcuts.clear();
  }
}
