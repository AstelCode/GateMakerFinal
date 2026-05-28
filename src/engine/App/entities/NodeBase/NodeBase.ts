/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
import { CELL_SIZE } from "../../constants";
import { Connector } from "../connector/Connector";
import { INodeBaseLogic } from "./INodeBaseLogic";
import { NodeBaseView } from "./NodeBaseView";

export enum Direction {
  TOP = 0,
  LEFT = 1,
  BOTTOM = 2,
  RIGHT = 3,
}
interface IConnector {
  name: string;
  direction: Direction;
  idx: number;
  box?: AABB;
}

export class NodeBase extends Entity implements INodeBaseLogic {
  public collider: RectangleCollider;
  public width: number;
  public height: number;
  public pivot: V2 = new V2();
  private contectors: IConnector[];

  public isDragging: boolean;
  public newPosition: V2;

  constructor(gridXSpan: number, gridYSpan: number) {
    super();
    this.width = gridXSpan * CELL_SIZE;
    this.height = gridYSpan * CELL_SIZE;
    this.collider = new RectangleCollider(this.width, this.height);
    this.collider.setPosition(this.transform.position);
    this.bounds.width = this.width;
    this.bounds.height = this.height;
    this.bounds.setPosition(this.transform.position);
    this.contectors = [];
    this.type = "NODE";
    if (gridXSpan % 2 == 0) this.pivot.x = CELL_SIZE / 2;
    if (gridYSpan % 2 == 0) this.pivot.y = CELL_SIZE / 2;

    this.transform.position.addV(this.pivot);
    this.transform.updateMatriz();

    this.view = new NodeBaseView(this);
    this.layer = 1;
    this.isDragging = false;
    this.newPosition = new V2();
  }

  ready(): void {
    this.contectors.push({ name: "Hola1", direction: Direction.RIGHT, idx: 0 });
    this.contectors.push({ name: "Hola2", direction: Direction.LEFT, idx: 1 });
    this.contectors.push({
      name: "Hola3",
      direction: Direction.BOTTOM,
      idx: 0,
    });
    this.contectors.push({ name: "Hola4", direction: Direction.TOP, idx: 0 });

    this.generateConnectors();
    this.updateLayout();
  }

  private generateConnectors() {
    for (const con of this.contectors) {
      const x =
        con.direction == Direction.RIGHT ? this.width / 2 : -this.width / 2;
      const y =
        con.direction == Direction.BOTTOM ? this.height / 2 : -this.height / 2;
      const off = CELL_SIZE * (con.idx + 1);

      if (con.direction == Direction.BOTTOM || con.direction == Direction.TOP) {
        this.addChild(
          new Connector(con.name, con.direction, new V2(x + off, y)),
        );
      } else {
        this.addChild(
          new Connector(con.name, con.direction, new V2(x, y + off)),
        );
      }
    }
  }

  on_down() {
    console.log("node");
  }

  on_dragStart() {
    this.newPosition.copy(this.transform.position);
  }

  on_drag(_: any, delta: V2) {
    this.transform.position.addV(delta);
    this.transform.updateMatriz();
    this.isDragging = true;
    this.newPosition.copy(this.transform.position);
    this.newPosition
      .addV(this.pivot)
      .snapToGridSmooth(CELL_SIZE, 0.8)
      .subV(this.pivot);
  }

  on_dragEnd() {
    this.isDragging = false;
    this.transform.position.copy(this.newPosition);
    this.transform.updateMatriz();
  }
}
