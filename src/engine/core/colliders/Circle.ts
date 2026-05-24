import { V2 } from "../math/Vector";
import { Collider } from "./Collider";

export class CircleCollider extends Collider {
  private _radius: number;
  constructor();
  constructor(r: number = 0) {
    super();
    this._radius = r;
  }

  get radius() {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
    this.updateAABB();
  }

  public updateAABB(): void {
    this.aabb.width = this.aabb.height = this._radius / 2;
  }

  public pointInside(v: V2): boolean {
    if (!this.aabb.pointInside(v)) return false;
    return Collider.aux_v.copy(v).subV(this.position).length() < this.radius;
  }
}
