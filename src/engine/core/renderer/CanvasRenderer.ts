import { Transform } from "../math/Transform";
import { IRenderer } from "./IRenderer";

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

export class CanvasRenderer implements IRenderer {
  private _canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private _patterns: Map<string, CanvasPattern>;

  private onResize = () => {
    this._canvas.width = innerWidth;
    this._canvas.height = innerHeight;
  };

  constructor(canvas?: HTMLCanvasElement, options?: Options) {
    if (!canvas) {
      canvas = document.createElement("canvas");
    }

    this._canvas = canvas;
    this.ctx = this._canvas.getContext("2d")!;
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

  async toImage() {
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

  clearScreen() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawFPS(fps: number) {
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

  fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number,
  ) {
    if (radius) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, width, height, radius);
      this.ctx.fill();
    } else {
    }
    this.ctx.fillRect(x, y, width, height);
  }

  drawCircle(x: number, y: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  fill(name: string): void {
    this.ctx.fillStyle = name;
  }

  drawImageCenter(
    texture: HTMLImageElement,
    width: number,
    height: number,
  ): void {
    if (!texture) return;
    this.ctx.drawImage(texture, -width / 2, -height / 2, width, height);
  }

  transform(transform: Transform): void {
    transform.applyToCanvas(this.ctx);
  }

  applyPattern(
    name: string,
    texture: HTMLImageElement,
    repetition: string,
    props?: { transform?: Transform },
  ): void {
    if (!texture) return;
    if (this._patterns.has(name)) {
      if (props?.transform)
        this._patterns.get(name)?.setTransform(props.transform!.toDOMMatriz());
      this.ctx.fillStyle = this._patterns.get(name)!;
      return;
    }
    const pattern = this.ctx.createPattern(texture, repetition)!;
    this._patterns.set(name, pattern);
    this.ctx.fillStyle = pattern;
  }

  save() {
    this.ctx.save();
  }

  restore(): void {
    this.ctx.restore();
  }
}
