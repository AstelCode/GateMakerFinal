import { Entity, PathCollider, V2 } from "@/engine/core";
import { WireView } from "./WireView";
import { CELL_SIZE } from "../../constants";

export class Wire extends Entity {
  public path: V2[];
  public thicknest: number;
  public collider: PathCollider;

  private lastPoint: V2;
  private lastPath: V2[];

  private startDir: V2;

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
    this.lastPoint = new V2();
    this.lastPath = [];
    this.startDir = new V2();
  }

  setStart(v: V2, dir: V2) {
    v = v.clone();
    this.path.push(v);
    this.lastPath = this.path.slice();
    this.lastPoint = v.clone();
    this.path.push(this.lastPoint);
    this.collider.updateBounds();
    this.startDir = dir;
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

    const prevPoint = this.lastPath[this.lastPath.length - 1];

    const dx = this.lastPoint.x - prevPoint.x;
    const dy = this.lastPoint.y - prevPoint.y;

    if (dx == 0 && dy > 0) {
      this.startDir.y = 1;
      this.startDir.x = 0;
    }

    if (dx == 0 && dy < 0) {
      this.startDir.y = -1;
      this.startDir.x = 0;
    }

    if (dx > 0 && dy == 0) {
      this.startDir.x = 1;
      this.startDir.y = 0;
    }

    if (dx < 0 && dy == 0) {
      this.startDir.x = -1;
      this.startDir.y = 0;
    }

    this.lastPath = this.path.slice();
    this.lastPoint = v.clone();
    this.path.push(this.lastPoint);
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
    this.lastPoint.copy(v);
    this.fixPath();
  }

  fixPath() {
    const prevPoint = this.lastPath[this.lastPath.length - 1];

    const dx = this.lastPoint.x - prevPoint.x;
    const dy = this.lastPoint.y - prevPoint.y;
    this.path = this.lastPath.slice();

    debugger;
    if (dx != 0 && dy != 0) {
      if (this.startDir.x == 0 && this.startDir.y !== 0) {
        this.path.push(new V2(this.lastPoint.x, prevPoint.y));
      } else {
        this.path.push(new V2(prevPoint.x, this.lastPoint.y));
      }
    }

    this.path.push(this.lastPoint);
  }
}
