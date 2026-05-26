import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
import { CELL_SIZE, CONECTOR_SIZE } from "../constants";
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
  private contectors: IConnector[]; // ? move to static

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

    this.contectors.push({ name: "A", direction: Direction.LEFT, idx: 1 }); // ? move to static
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
      }
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
          new Connector(con.name, new V2(x + off, y))
        );
      } else {
        this.context.tree.setChild(
          this,
          new Connector(con.name, new V2(x, y + off))
        );
      }
    }
    // ? move to static
    /*     const s = CONECTOR_OFFSET;
    const cs = CELL_SIZE; */
    /*   const cx = this.transform.position.x + this.pivot.x;
    const cy = this.transform.position.y + this.pivot.y; */
    /*     const startX = -this._width / 2;
    const startY = -this._height / 2;

    for (let i = 0; i < this.contectors.length; i++) {
      const con = this.contectors[i];
      const of = cs * con.idx;

      const sty =
        con.direction == Direction.BOTTOM ? startY + this._height - s : startY;

      const stx =
        con.direction == Direction.RIGHT
          ? startX + this._width - s * 2
          : startX;

      if (con.direction == Direction.BOTTOM || con.direction == Direction.TOP) {
        con.box = new AABB().fromRect(stx + of, sty, s * 2, s * 2);
      } else {
        con.box = new AABB().fromRect(stx, sty + of, s * 2, s * 2);
      }
    } */
  }

  pointCollition(): undefined | Entity {
    return undefined;
  }

  on_down(e: V2) {
    const v = e.clone();
    for (const node of this.children) {
      if (node.collider?.pointInside(v)) {
        console.log(node);
      }
    }

    /* //this.transform.mulVInv(v);
    console.log(v); */
  }

  draw(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    if (!this.texture) return;

    /*     const s = CONECTOR_OFFSET;
    const cs = CELL_SIZE;
    const cx = this.transform.position.x;
    const cy = this.transform.position.y;
    const startX = cx - this._width / 2;
    const startY = cy - this._height / 2; */

    ctx.save();
    ctx.transform(...this.transform.toTransformParams());
    ctx.drawImage(
      this.texture,
      -this._width / 2,
      -this._height / 2,
      this._width,
      this._height
    );

    /*     for (const con of this.contectors) {
      ctx.beginPath();
      const radius = GRID_DOT_RADIUS;
      ctx.fillStyle = CONECTOR_COLOR;

      const of = cs * con.idx;

      const sty =
        con.direction == Direction.BOTTOM ? startY + this._height - s : startY;

      const stx =
        con.direction == Direction.RIGHT
          ? startX + this._width - s * 2
          : startX;

      if (con.direction == Direction.BOTTOM || con.direction == Direction.TOP) {
        ctx.roundRect(stx + of, sty, s * 2, s * 2, radius);
      } else {
        ctx.roundRect(stx, sty + of, s * 2, s * 2, radius);
      }

      ctx.fill();
    } */
  }

  afterDrawChilds(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    ctx.restore();
  }
}
