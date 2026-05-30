import { V2 } from "../math";
import { Transform } from "../math/Transform";
import { Font, IRenderer } from "./IRenderer";

interface Options {
  autoResize: boolean;
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

  strokeStyle(color: string, lineWidth?: number): void {
    this.ctx.strokeStyle = color;
    if (lineWidth) this.ctx.lineWidth = lineWidth;
  }

  isRenderer(value: "2d" | "webgl"): boolean {
    return value == "2d";
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
  fillTextCenter(text: string, x: number, y: number, font?: Font): void {
    this.ctx.save();
    if (font) this.ctx.font = `${font.size}px ${font.name}`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  fillText(
    text: string,
    x: number,
    y: number,
    font?: Font,
    direction?: `${"top" | "bottom" | "middle"}:${"end" | "center" | "start"}`
  ): void {
    this.ctx.save();
    if (font) this.ctx.font = `${font.size}px ${font.name}`;

    this.ctx.textBaseline =
      (direction?.split(":")[0] as "top" | "bottom" | "middle") ?? "center";

    this.ctx.textAlign =
      (direction?.split(":")[1] as "end" | "center" | "start") ?? "center";

    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number
  ) {
    if (radius) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, width, height, radius);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(x, y, width, height);
    }
  }

  rect(x: number, y: number, width: number, height: number, radius?: number) {
    if (radius) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, width, height, radius);
    } else {
      this.ctx.fillRect(x, y, width, height);
    }
  }

  fillRectCenter(width: number, height: number, radius?: number) {
    if (radius) {
      this.ctx.beginPath();
      this.ctx.roundRect(-width / 2, -height / 2, width, height, radius);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(-width / 2, -height / 2, width, height);
    }
  }

  circle(x: number, y: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  fillStyle(name: string): void {
    this.ctx.fillStyle = name;
  }

  fill() {
    this.ctx.fill();
  }

  stroke(): void {
    this.ctx.stroke();
  }

  imageCenter(texture: HTMLImageElement, width: number, height: number): void {
    if (!texture) return;
    this.ctx.drawImage(texture, -width / 2, -height / 2, width, height);
  }

  transform(transform: Transform): void {
    transform.applyToCanvas(this.ctx);
  }

  translate(x: number, y: number): void {
    this.ctx.translate(x, y);
  }

  applyPattern(
    name: string,
    texture: HTMLImageElement,
    repetition: string,
    props?: { transform?: Transform }
  ): void {
    if (!texture || !texture.complete) return;
    if (this._patterns.has(name)) {
      const pattern = this._patterns.get(name)!;

      if (props?.transform) {
        pattern.setTransform(props.transform.toDOMMatriz());
      }

      this.ctx.fillStyle = pattern;
      return;
    }

    const pattern = this.ctx.createPattern(texture, repetition);

    if (!pattern) return;

    if (props?.transform) {
      pattern.setTransform(props.transform.toDOMMatriz());
    }

    this._patterns.set(name, pattern);
    this.ctx.fillStyle = pattern;
  }

  save() {
    this.ctx.save();
  }

  private drawRoundedPath(path: V2[], radius: number) {
    if (path.length <= 1) return;
    this.ctx.beginPath();
    this.ctx.moveTo(path[0].x, path[0].y);

    if (path.length == 2) {
      this.ctx.lineTo(path[1].x, path[1].y);
      this.ctx.stroke();
      return;
    }

    for (let i = 1; i < path.length - 1; i++) {
      const a = path[i - 1];
      const b = path[i];
      const c = path[i + 1];

      const distAB = Math.hypot(b.x - a.x, b.y - a.y);
      const distBC = Math.hypot(c.x - b.x, c.y - b.y);

      if (distAB === 0 || distBC === 0) {
        this.ctx.lineTo(b.x, b.y);
        continue;
      }

      const t1 = radius / distAB;
      const t2 = radius / distBC;
      const x1 = b.x + (a.x - b.x) * t1;
      const y1 = b.y + (a.y - b.y) * t1;
      const x2 = b.x + (c.x - b.x) * t2;
      const y2 = b.y + (c.y - b.y) * t2;

      this.ctx.lineTo(x1, y1);
      this.ctx.arcTo(
        b.x,
        b.y,
        x2,
        y2,
        Math.min(radius, distAB / 2, distBC / 2)
      );
    }

    this.ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y);
    this.ctx.stroke();
  }

  drawPath(path: V2[], thicknest: number, radius: number = 10) {
    if (path.length <= 1) return;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = thicknest;

    this.drawRoundedPath(path, radius);

    const innerRadius = Math.max(0, radius - thicknest);
    if (innerRadius > 0) {
      this.drawRoundedPath(path, innerRadius);
    }
  }

  restore(): void {
    this.ctx.restore();
  }
}
