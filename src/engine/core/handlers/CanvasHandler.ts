import { Transform } from "../math/Transform";

interface Options {
  autoResize: boolean;
}

interface FillStyle {
  pattern?: string;
  transform?: Transform;
}
interface RenderStyle {
  fill?: FillStyle;
}

export class CanvasHandler {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _patterns: Map<string, CanvasPattern>;

  constructor(canvas?: HTMLCanvasElement, options?: Options) {
    if (!canvas) {
      canvas = document.createElement("canvas");
    }

    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d")!;
    this._patterns = new Map();

    if (options?.autoResize) window.addEventListener("resize", this.onResize);
    /*     CanvasHandler.initCanvasRing(canvas); */
  }

  get width() {
    return this._canvas.width;
  }

  get canvas() {
    return this._canvas;
  }

  get height() {
    return this._canvas.height;
  }

  set width(value: number) {
    this._canvas.width = value;
    this.ctx.canvas.width = value;
  }

  set height(value: number) {
    this._canvas.height = value;
    this.ctx.canvas.height = value;
  }

  get ctx() {
    return this._ctx;
  }

  public async toImage() {
    return await new Promise<HTMLImageElement>((res, rej) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          rej();
          return;
        }
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        res(img);
      });
    });
  }

  public clearScreen() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public drawFPS(fps: number) {
    this.ctx.save();
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, 80, 20);
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "top";
    this.ctx.font = "20px serif";
    this.ctx.fillText(`FPS : ${fps}`, 0, 0);
    this.ctx.restore();
  }

  public createPattern(
    name: string,
    texture: HTMLImageElement,
    repetition: string,
    transform?: Transform,
  ) {
    if (this._patterns.has(name)) {
      if (transform)
        this._patterns.get(name)?.setTransform(transform.toDOMMatriz());
      return;
    }
    this._patterns.set(name, this.ctx.createPattern(texture, repetition)!);
  }

  public fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    config: FillStyle = {},
  ) {
    if (config.pattern && this._patterns.has(config.pattern)) {
      this.ctx.fillStyle = this._patterns.get(config.pattern!)!;
    }
    this.ctx.fillRect(x, y, width, height);
  }

  private onResize = () => {
    this._canvas.width = innerWidth;
    this._canvas.height = innerHeight;
  };
}
