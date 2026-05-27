import { V2 } from "./Vector";

export class Transform {
  public scale: number;
  public position: V2;
  public rotation: number;
  public domMatriz: DOMMatrix;

  constructor() {
    this.scale = 1;
    this.position = new V2();
    this.rotation = 0;
    this.domMatriz = new DOMMatrix();
  }

  updateMatriz() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    const a = cos * this.scale;
    const b = -sin * this.scale;
    const c = sin * this.scale;
    const d = cos * this.scale;
    this.domMatriz.e = a * this.position.x + b * this.position.y;
    this.domMatriz.f = c * this.position.x + d * this.position.y;
    this.domMatriz.a = a;
    this.domMatriz.b = c;
    this.domMatriz.c = b;
    this.domMatriz.d = d;
  }

  zoomInPoint(newScale: number, { x, y }: { x: number; y: number }) {
    this.position.x = x / newScale - x / this.scale + this.position.x;
    this.position.y = y / newScale - y / this.scale + this.position.y;
    this.scale = newScale;
    this.updateMatriz();
  }

  translate(v: { x: number; y: number }) {
    this.position.x += v.x / this.scale;
    this.position.y += v.y / this.scale;
    this.updateMatriz();
  }

  mulVInv(v: V2) {
    v.x = v.x / this.scale - this.position.x;
    v.y = v.y / this.scale - this.position.y;
    return v;
  }

  toDOMMatriz() {
    return this.domMatriz;
  }

  toTransformParams(): [number, number, number, number, number, number] {
    return [
      this.domMatriz.a,
      this.domMatriz.b,
      this.domMatriz.c,
      this.domMatriz.d,
      this.domMatriz.e,
      this.domMatriz.f,
    ];
  }
}
