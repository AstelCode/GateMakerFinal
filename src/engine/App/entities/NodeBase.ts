import { Entity, RectangleCollider, V2 } from "@/engine/core";
import {
  CELL_SIZE,
  CONECTOR_COLOR,
  GRID_DOT_RADIUS,
  GRID_DOT_SIZE,
} from "../constants";

export class NodeBase extends Entity {
  public collider: RectangleCollider;
  private texture!: HTMLImageElement;
  private _width: number;
  private _height: number;
  protected pivot: V2 = new V2();

  constructor(gridXSpan: number, gridYSpan: number) {
    super();
    this._width = gridXSpan * CELL_SIZE + GRID_DOT_SIZE;
    this._height = gridYSpan * CELL_SIZE + GRID_DOT_SIZE;
    this.collider = new RectangleCollider(this._width, this._height);
    this.collider.setPosition(this.position);
    this.layer = 1;

    if (gridXSpan % 2 == 0) this.pivot.x += CELL_SIZE / 2;
    if (gridYSpan % 2 == 0) this.pivot.y += CELL_SIZE / 2;
  }

  async loadAssets(): Promise<void> {
    const w = this.width;
    const h = this.height;
    const s = GRID_DOT_SIZE;
    const cW = this.width - s;
    const cH = this.height - s;
    this.context.assets.addAsset<true>(
      "NODE_BACKGROUND",
      async ({ ctx }) => {
        const margin = 1;
        const r = 8;
        ctx.beginPath();
        ctx.fillStyle = "#4f545e";
        ctx.roundRect(s / 2, s / 2, cW, cH, r);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#1e1f23";
        ctx.roundRect(
          margin + s / 2,
          margin + s / 2,
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

        ctx.beginPath();
        const radius = GRID_DOT_RADIUS;
        ctx.fillStyle = CONECTOR_COLOR;
        ctx.roundRect(CELL_SIZE * 6 - 10, 0, s + 10, s + 5, radius);
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

    ctx.drawImage(
      this.texture,
      this.position.x + this.pivot.x - this.width / 2,
      this.position.y + this.pivot.y - this.height / 2,
      this.width,
      this.height,
    );
  }
}
