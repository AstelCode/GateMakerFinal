import { Entity, PathCollider, V2 } from "@/engine/core";
import { WireView } from "./WireView";
import { CELL_SIZE } from "../../constants";

export class Wire extends Entity {
  public path: V2[];
  public thicknest: number;
  public collider: PathCollider;
  constructor() {
    super();
    this.view = new WireView(this);
    this.path = [];
    this.thicknest = 20;

    this.selectable = true;
    this.dragable = true;

    this.collider = new PathCollider(this.path, this.thicknest);
    this.collider.setBounds(this.bounds);
    this.transform.updateMatriz();
  }

  setStart(v: V2) {
    v = v.clone();
    this.path.push(v);
    this.path.push(v.clone());
    this.collider.updateBounds();
  }

  setEnd(v: V2) {
    v = v.clone();
    v.x = Math.floor(v.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    v.y = Math.floor(v.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    this.path.push(v);
    this.collider.updateBounds();
  }

  addPoint() {
    const v = this.path[this.path.length - 1];
    v.x = Math.floor(v.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    v.y = Math.floor(v.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    this.path.push(v.clone());
    this.collider.updateBounds();
  }

  on_dragStart() {}
  on_drag(delta: V2) {
    for (const item of this.path) {
      item.addV(delta);
    }
    this.collider.updateBounds();
  }
  on_dragEnd() {
    for (const v of this.path) {
      v.x = Math.floor(v.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
      v.y = Math.floor(v.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    }
    this.collider.updateBounds();
  }
  moveLast(v: V2) {
    v = v.clone();
    v.x = Math.floor(v.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    v.y = Math.floor(v.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    this.path[this.path.length - 1].copy(v);
  }
}
