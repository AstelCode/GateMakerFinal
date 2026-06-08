export type MouseEventType =
  | "down"
  | "move"
  | "up"
  | "dblclick"
  | "wheel"
  | "drag"
  | "down:wheel"
  | "up:wheel"
  | "drag:wheel";

export type IMouseEvent = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  delta: number;
  button: number;
};
export type HandlerCallback = ({ x, y, delta }: IMouseEvent) => void;
export type Listener = (event: MouseEventType, e: IMouseEvent) => void;
export class MouseController {
  private _x: number;
  private _y: number;
  private _delta: number;
  private _dx: number;
  private _dy: number;
  private _dragging: boolean = false;
  private _button: number;

  private handlers: Record<MouseEventType, HandlerCallback[]> = {
    down: [],
    move: [],
    up: [],
    dblclick: [],
    wheel: [],
    drag: [],
    "down:wheel": [],
    "up:wheel": [],
    "drag:wheel": [],
  };

  private _listeners: Array<Listener>;

  constructor(private _canvas: HTMLCanvasElement) {
    this._x = 0;
    this._y = 0;
    this._dx = 0;
    this._dy = 0;
    this._delta = 0;
    this._button = 0;
    this._listeners = [];
    this.initialize();
  }

  addListener(listener: Listener) {
    this._listeners.push(listener);
  }

  private initialize() {
    this._canvas.addEventListener("pointerdown", this.onMouseDown);
    this._canvas.addEventListener("pointerrawupdate", this.onMouseMove, {
      passive: true,
    });
    this._canvas.addEventListener("pointerup", this.onMouseUp);
    this._canvas.addEventListener("dblclick", this.onDblClick);
    this._canvas.addEventListener("wheel", this.onWheel);
    window.addEventListener("wheel", this.onWheelBlock, { passive: false });
  }

  private onWheelBlock = (e: MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };

  private onMouseDown = (e: MouseEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this._dragging = true;
    this._dx = 0;
    this._dy = 0;
    this._button = e.button;
    if (this._button == 1) {
      this.executeHandlers("down:wheel");
    }
    if (this._button == 0) {
      this.executeHandlers("down");
    }
  };

  private onMouseMove = (_e: Event) => {
    const e = _e as MouseEvent;
    if (this._dragging) {
      this._dx = e.clientX - this._x;
      this._dy = e.clientY - this._y;

      if (this._button == 1) {
        this.executeHandlers("drag:wheel");
      }
      if (this._button == 0) {
        this.executeHandlers("drag");
      }
    }

    this._x = e.clientX;
    this._y = e.clientY;

    this.executeHandlers("move");
  };

  private onMouseUp = (e: MouseEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this._dragging = false;
    this._button = e.button;
    if (this._button == 1) {
      this.executeHandlers("up:wheel");
    }
    if (this._button == 0) {
      this.executeHandlers("up");
    }
  };

  private onDblClick = (e: MouseEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this._button = e.button;
    this.executeHandlers("dblclick");
  };

  private onWheel = (e: WheelEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this._delta = e.deltaY;
    this._button = e.button;
    this.executeHandlers("wheel");
  };

  private executeHandlers(event: MouseEventType) {
    const e = {
      x: this._x,
      y: this._y,
      delta: this._delta,
      dx: this._dx,
      dy: this._dy,
      button: this._button,
    };
    this._listeners.forEach((item) => item(event, e));
    this.handlers[event].forEach((handler) => handler(e));
  }

  public on(event: MouseEventType, callback: HandlerCallback) {
    if (this.handlers[event].find((h) => h === callback)) return;
    this.handlers[event].push(callback);
  }

  public off(event: MouseEventType, callback: HandlerCallback) {
    this.handlers[event] = this.handlers[event].filter((h) => h !== callback);
  }

  public destroy() {
    this._canvas.removeEventListener("pointerdown", this.onMouseDown);
    this._canvas.removeEventListener("pointerrawupdate", this.onMouseMove);
    this._canvas.removeEventListener("pointerup", this.onMouseUp);
    this._canvas.removeEventListener("dblclick", this.onDblClick);
    this._canvas.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("wheel", this.onWheelBlock);
    this.handlers = {
      down: [],
      move: [],
      up: [],
      dblclick: [],
      wheel: [],
      drag: [],
      "down:wheel": [],
      "drag:wheel": [],
      "up:wheel": [],
    };
  }
}
