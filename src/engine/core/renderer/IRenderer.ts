import { Transform } from "../math/Transform";

export interface IRenderer {
  get canvas(): HTMLCanvasElement;
  get width(): number;
  get height(): number;
  set width(value: number);
  set height(value: number);
  clearScreen(): void;
  drawFPS(fps: number): void;
  applyPattern(
    name: string,
    texture: HTMLImageElement,
    repetition: string,
    props?: { transform?: Transform },
  ): void;

  drawImageCenter(
    texture: HTMLImageElement,
    width: number,
    height: number,
  ): void;

  transform(transform: Transform): void;

  fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number,
  ): void;

  drawCircle(x: number, y: number, radius: number): void;

  fill(name: string): void;

  save(): void;
  restore(): void;
}
