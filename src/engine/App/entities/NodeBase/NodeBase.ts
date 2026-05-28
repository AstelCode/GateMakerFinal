import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
import { CELL_SIZE } from "../../constants";
import { Connector } from "../connector/Connector";
import { ITextureData } from "@/engine/core/assetManager";
import { INodeBaseLogic } from "./INodeBaseLogic";
import { NodeBaseView } from "./NodeBaseView";

enum Direction {
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
  protected pivot: V2 = new V2();
  private contectors: IConnector[];

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
    if (gridXSpan % 2 == 0) this.transform.position.x += CELL_SIZE / 2;
    if (gridYSpan % 2 == 0) this.transform.position.y += CELL_SIZE / 2;
    this.transform.updateMatriz();

    this.view = new NodeBaseView(this);
    this.layer = 1;
  }

  ready(): void {
    this.contectors.push({ name: "A", direction: Direction.LEFT, idx: 1 });
    this.contectors.push({ name: "B", direction: Direction.LEFT, idx: 2 });

    this.generateConnectors();
    this.updateLayout();
  }

  private generateConnectors() {
    for (const con of this.contectors) {
      const x =
        con.direction == Direction.BOTTOM ? this.width / 2 : -this.width / 2;
      const y =
        con.direction == Direction.RIGHT ? this.height / 2 : -this.height / 2;
      const off = CELL_SIZE * con.idx;
      if (con.direction == Direction.BOTTOM || con.direction == Direction.TOP) {
        this.addChild(new Connector(con.name, new V2(x + off, y)));
      } else {
        this.addChild(new Connector(con.name, new V2(x, y + off)));
      }
    }
  }

  pointCollition(): undefined | Entity {
    return undefined;
  }

  on_down(e: V2) {
    const v = this.transform.mulVInv(e.clone());
    for (const node of this.children) {
      if (node.collider?.pointInside(v)) {
        console.log((node as Connector).name);
      }
    }
  }

  private lastEntity?: Entity;
  on_hover(e: V2) {
    const v = this.transform.mulVInv(e.clone());
    let selectedNode: Entity | undefined = undefined;
    for (const node of this.children) {
      if (node.collider?.pointInside(v)) {
        selectedNode = node;
      }
    }
    if (this.lastEntity && this.lastEntity != selectedNode) {
      this.lastEntity.emit("leave");
    }
    selectedNode?.emit("hover");
    this.lastEntity = selectedNode;
  }
}
