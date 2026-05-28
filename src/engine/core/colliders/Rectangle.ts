import { V2 } from "../math/Vector";
import { Collider } from "./Collider";

export class RectangleCollider extends Collider {
  private _width: number;
  private _height: number;

  constructor();
  constructor(width: number, height: number);
  constructor(width: number = 0, height: number = 0) {
    super();
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(value: number) {
    this._width = value;
    this.updateAABB();
  }

  set height(value: number) {
    this._height = value;
    this.updateAABB();
  }

  set size(value: number) {
    this._width = value;
    this._height = value;
    this.updateAABB();
  }

  public pointInside(v: V2): boolean {
    return this.aabb.pointInside(v);
  }

  public updateAABB(): void {
    this.aabb.width = this._width;
    this.aabb.height = this._height;
  }
}
