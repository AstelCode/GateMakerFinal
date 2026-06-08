import { Entity, V2 } from "@/engine/core";
import { WireView } from "./WireView";
import { CELL_SIZE } from "../../constants";

export class Wire extends Entity {
  public path: V2[];
  public thicknest: number;

  constructor() {
    super();
    this.view = new WireView(this);
    this.path = [];
    this.thicknest = 20;
    this.transform.updateMatriz();
  }

  setStart(v: V2) {
    this.path.push(v);
    this.path.push(v.clone());
  }

  setEnd(v: V2) {
    this.path.push(v);
  }

  addPoint() {
    const v = this.path[this.path.length - 1];
    v.x = Math.floor(v.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    v.y = Math.floor(v.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    this.path.push(v);
    this.path.push(v.clone());
  }

  moveLast(v: V2) {
    this.path[this.path.length - 1].copy(v);
  }
}
