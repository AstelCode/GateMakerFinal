type MouseEventType = "down" | "move" | "up" | "dblclick" | "wheel" | "drag";
type HandlerCallback = ({
  x,
  y,
  delta,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  delta: number;
}) => void;

export class MouseController {
  private _x: number;
  private _y: number;
  private _delta: number;
  private _dx: number;
  private _dy: number;
  private _dragging: boolean = false;

  private handlers: Record<MouseEventType, HandlerCallback[]> = {
    down: [],
    move: [],
    up: [],
    dblclick: [],
    wheel: [],
    drag: [],
  };

  constructor(private _canvas: HTMLCanvasElement) {
    this._x = 0;
    this._y = 0;
    this._dx = 0;
    this._dy = 0;
    this._delta = 0;
    this.initialize();
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
    this.executeHandlers("down");
  };

  private onMouseMove = (_e: Event) => {
    const e = _e as MouseEvent;
    if (this._dragging) {
      this._dx = e.clientX - this._x;
      this._dy = e.clientY - this._y;
      this.executeHandlers("drag");
    }

    this._x = e.clientX;
    this._y = e.clientY;
    this.executeHandlers("move");
  };

  private onMouseUp = (e: MouseEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this._dragging = false;
    this.executeHandlers("up");
  };

  private onDblClick = (e: MouseEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this.executeHandlers("dblclick");
  };

  private onWheel = (e: WheelEvent) => {
    this._x = e.clientX;
    this._y = e.clientY;
    this._delta = e.deltaY;
    this.executeHandlers("wheel");
  };

  private executeHandlers(event: MouseEventType) {
    this.handlers[event].forEach((handler) =>
      handler({
        x: this._x,
        y: this._y,
        delta: this._delta,
        dx: this._dx,
        dy: this._dy,
      }),
    );
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
    };
  }
}
