import { AABB } from "../AABB/AABB";
import { V2 } from "../math/Vector";

export abstract class Collider {
  protected static aux_v: V2 = new V2();
  protected bounds: AABB = new AABB();

  constructor(public position: V2 = new V2()) {
    this.bounds.position = position;
  }

  setPosition(position: V2) {
    this.bounds.position = position;
    this.position = position;
  }

  public getBounds() {
    return this.bounds;
  }

  public setBounds(bounds: AABB) {
    this.bounds = bounds;
  }
  public updateBounds() {}

  public pointInside(v: V2): boolean {
    return this.bounds.pointInside(v);
  }
}
