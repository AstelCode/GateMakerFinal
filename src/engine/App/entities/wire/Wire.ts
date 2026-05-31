import { Entity, V2 } from "@/engine/core";
import { WireView } from "./WireView";
import { CELL_SIZE } from "../../constants";

export class Wire extends Entity {
  public path: V2[];
  public thicknest: number;
  constructor() {
    super();
    this.view = new WireView(this);
    this.path = [
      new V2(0, 0),
      new V2(100, 0),
      new V2(100, 200),
      new V2(200, 200),
    ];
    this.thicknest = 20;
    this.transform.position.set(CELL_SIZE / 2, CELL_SIZE / 2);
    this.transform.updateMatriz();
  }
}
