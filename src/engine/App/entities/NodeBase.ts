import { Entity, RectangleCollider, V2 } from "@/engine/core";
import {
  CELL_SIZE,
  CONECTOR_COLOR,
  CONECTOR_OFFSET,
  GRID_DOT_RADIUS,
} from "../constants";

enum Direction {
  TOP = 0,
  LEFT = 1,
  BOTTOM = 2,
  RIGHT = 3,
}
interface Connector {
  name: string;
  direction: Direction;
  idx: number;
}

export class NodeBase extends Entity {
  public collider: RectangleCollider;
  private texture!: HTMLImageElement;
  private _width: number;
  private _height: number;
  protected pivot: V2 = new V2();
  private contectors: Connector[];

  constructor(gridXSpan: number, gridYSpan: number) {
    super();
    this._width = gridXSpan * CELL_SIZE + CONECTOR_OFFSET * 2;
    this._height = gridYSpan * CELL_SIZE + CONECTOR_OFFSET * 2;
    this.collider = new RectangleCollider(this._width, this._height);
    this.collider.setPosition(this.position);
    this.aabb.width = this._width;
    this.aabb.height = this._height;
    this.aabb.setPosition(this.position);
    this.layer = 1;
    this.contectors = [];
    this.name = "NODE_BASE";
    if (gridXSpan % 2 == 0) this.position.x += CELL_SIZE / 2;
    if (gridYSpan % 2 == 0) this.position.y += CELL_SIZE / 2;

    this.contectors.push({ name: "A", direction: Direction.LEFT, idx: 1 });
  }

  updateLayout(): void {}

  async loadAssets(): Promise<void> {
    const w = this.width;
    const h = this.height;
    const s = CONECTOR_OFFSET;
    const cW = this.width - s * 2;
    const cH = this.height - s * 2;
    this.context.assets.addAsset<true>(
      "NODE_BACKGROUND",
      async ({ ctx }) => {
        const margin = 1;
        const r = 8;
        ctx.beginPath();
        ctx.fillStyle = "#4f545e";
        ctx.roundRect(s, s, cW, cH, r);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#1e1f23";
        ctx.roundRect(
          margin + s,
          margin + s,
          cW - margin * 2,
          cH - margin * 2,
          r,
        );
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

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(value: number) {
    this.collider.width = value;
    this._width = value;
  }

  set height(value: number) {
    this.collider.height = value;
    this._height = value;
  }

  draw(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    if (!this.texture) return;

    const s = CONECTOR_OFFSET;
    const cs = CELL_SIZE;
    const cx = this.position.x + this.pivot.x;
    const cy = this.position.y + this.pivot.y;
    const startX = cx - this.width / 2;
    const startY = cy - this.height / 2;

    ctx.drawImage(
      this.texture,
      cx - this.width / 2,
      cy - this.height / 2,
      this.width,
      this.height,
    );

    for (const con of this.contectors) {
      ctx.beginPath();
      const radius = GRID_DOT_RADIUS;
      ctx.fillStyle = CONECTOR_COLOR;

      const of = cs * con.idx;

      const sty =
        con.direction == Direction.BOTTOM ? startY + this.height - s : startY;

      const stx =
        con.direction == Direction.RIGHT ? startX + this.width - s * 2 : startX;

      if (con.direction == Direction.BOTTOM || con.direction == Direction.TOP) {
        ctx.roundRect(stx + of, sty, s * 2, s * 2, radius);
      } else {
        ctx.roundRect(stx, sty + of, s * 2, s * 2, radius);
      }

      ctx.fill();
    }
  }
}
