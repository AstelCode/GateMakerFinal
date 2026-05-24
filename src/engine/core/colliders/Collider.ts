import { AABB } from "../AABB/AABB";
import { V2 } from "../math/Vector";

export abstract class Collider {
  protected static aux_v: V2 = new V2();
  protected aabb: AABB = new AABB();

  constructor(public position: V2 = new V2()) {
    this.aabb.position = position;
  }

  setPosition(position: V2) {
    this.aabb.position = position;
    this.position = position;
  }

  public updateAABB() {}

  public pointInside(v: V2): boolean {
    return this.aabb.pointInside(v);
  }
}
