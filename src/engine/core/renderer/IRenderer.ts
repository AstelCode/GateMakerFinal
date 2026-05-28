import { Transform } from "../math/Transform";

export interface Font {
  size: number;
  name: string;
}

export interface IRenderer {
  get canvas(): HTMLCanvasElement;
  get width(): number;
  get height(): number;
  set width(value: number);
  set height(value: number);

  isRenderer(value: "2d" | "webgl"): boolean;

  clearScreen(): void;
  drawFPS(fps: number): void;
  applyPattern(
    name: string,
    texture: HTMLImageElement,
    repetition: string,
    props?: { transform?: Transform },
  ): void;

  imageCenter(texture: HTMLImageElement, width: number, height: number): void;

  transform(transform: Transform): void;

  fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number,
  ): void;

  rect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number,
  ): void;

  fillRectCenter(width: number, height: number, radius?: number): void;

  circle(x: number, y: number, radius: number): void;

  fillStyle(color: string): void;
  strokeStyle(color: string, lineWidth?: number): void;

  save(): void;
  restore(): void;

  fillTextCenter(text: string, x: number, y: number, font: Font): void;
  fillText(
    text: string,
    x: number,
    y: number,
    font?: Font,
    direction?: `${"top" | "bottom" | "middle"}:${"end" | "center" | "start"}`,
  ): void;

  fill(): void;
  stroke(): void;
}
