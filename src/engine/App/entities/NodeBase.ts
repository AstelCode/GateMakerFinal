import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
import { CELL_SIZE } from "../constants";
import { Connector } from "./Connector";

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

export class NodeBase extends Entity {
  public collider: RectangleCollider;
  private texture!: HTMLImageElement;
  private _width: number;
  private _height: number;
  protected pivot: V2 = new V2();
  private contectors: IConnector[];

  constructor(gridXSpan: number, gridYSpan: number) {
    super();
    this._width = gridXSpan * CELL_SIZE;
    this._height = gridYSpan * CELL_SIZE;
    this.collider = new RectangleCollider(this._width, this._height);
    this.collider.setPosition(this.transform.position);
    this.aabb.width = this._width;
    this.aabb.height = this._height;
    this.aabb.setPosition(this.transform.position);
    this.layer = 1;
    this.contectors = [];
    this.type = "NODE";
    if (gridXSpan % 2 == 0) this.transform.position.x += CELL_SIZE / 2;
    if (gridYSpan % 2 == 0) this.transform.position.y += CELL_SIZE / 2;
    this.transform.updateMatriz();

    this.contectors.push({ name: "A", direction: Direction.LEFT, idx: 1 });
  }

  async loadAssets(): Promise<void> {
    const w = this._width;
    const h = this._height;
    this.context.assets.addAsset<true>(
      "NODE_BACKGROUND",
      async ({ ctx }) => {
        const margin = 2;
        const r = 8;
        ctx.beginPath();
        ctx.fillStyle = "#585d69";
        ctx.roundRect(0, 0, w, h, r);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#1e1f23";
        ctx.roundRect(margin, margin, w - margin * 2, h - margin * 2, r);
        ctx.fill();

        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = "25px Orbitron";
        ctx.fillText("NODE", w / 2, h / 2);
        ctx.fill();
      },
      {
        image: true,
        width: w,
        height: h,
      },
    );
    await this.context.assets.load();
    this.context.assets.getAssetSync("NODE_BACKGROUND", (texture) => {
      this.texture = texture;
    });
  }

  ready(): void {
    this.generateConnectorAABB();
    this.updateLayout();
  }

  private generateConnectorAABB() {
    for (const con of this.contectors) {
      const x =
        con.direction == Direction.BOTTOM ? this._width / 2 : -this._width / 2;
      const y =
        con.direction == Direction.RIGHT ? this._height / 2 : -this._height / 2;
      const off = CELL_SIZE * con.idx;
      if (con.direction == Direction.BOTTOM || con.direction == Direction.TOP) {
        this.context.tree.setChild(
          this,
          new Connector(con.name, new V2(x + off, y)),
        );
      } else {
        this.context.tree.setChild(
          this,
          new Connector(con.name, new V2(x, y + off)),
        );
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

  draw(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    if (!this.texture) return;
    ctx.save();
    ctx.transform(...this.transform.toTransformParams());
    ctx.drawImage(
      this.texture,
      -this._width / 2,
      -this._height / 2,
      this._width,
      this._height,
    );
  }

  afterDrawChilds(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    ctx.restore();
  }
}
