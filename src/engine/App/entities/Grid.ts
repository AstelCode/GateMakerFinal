import { Entity, M3, V2 } from "@/engine/core";
import {
  BACKGROUND,
  CELL_SIZE,
  GRID_DOT_COLOR,
  GRID_DOT_RADIUS,
  GRID_DOT_SIZE,
  MAX_ZOOM,
  MIN_ZOOM,
  smoothZoom,
  START_T,
  ZOOM_STEP,
} from "../constants";

export class Grid extends Entity {
  private image!: HTMLImageElement;
  private pattern!: CanvasPattern;

  private transform: M3 = new M3();
  private pivot: V2 = new V2();
  private scale: number = 1;
  private t: number = START_T;

  async loadAssets(): Promise<void> {
    this.context.assets.addAsset<true>(
      "GRID_PATTERN",
      async ({ ctx }) => {
        ctx.fillStyle = BACKGROUND;
        ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);
        const size = GRID_DOT_SIZE;
        const radius = GRID_DOT_RADIUS;
        ctx.fillStyle = GRID_DOT_COLOR;

        ctx.beginPath();
        ctx.roundRect(
          CELL_SIZE / 2 - size / 2,
          CELL_SIZE / 2 - size / 2,
          size,
          size,
          radius,
        );
        ctx.fill();
      },
      { image: true, width: CELL_SIZE, height: CELL_SIZE },
    );
    await this.context.assets.load();
    this.context.assets.getAssetSync("GRID_PATTERN", (data) => {
      this.image = data as HTMLImageElement;
    });
  }

  ready(): void {
    this.pivot.x = this.context.canvas.width / 2;
    this.pivot.y = this.context.canvas.height / 2;
    this.position.x = this.pivot.x;
    this.position.y = this.pivot.y;

    const range = MAX_ZOOM - MIN_ZOOM;
    this.scale = range * smoothZoom(this.t) + MIN_ZOOM;

    this.transform.transform(
      this.position.x,
      this.position.y,
      0,
      this.scale,
      this.scale,
    );

    this.context.tree.registerEntity("GRID", this);
  }

  on_drag({ dx, dy }: { dx: number; dy: number }) {
    this.position.x += dx / this.scale;
    this.position.y += dy / this.scale;
    this.transform.transform(
      this.position.x,
      this.position.y,
      0,
      this.scale,
      this.scale,
    );
  }

  on_wheel({ delta, x, y }: { delta: number; x: number; y: number }) {
    if (delta > 0) {
      this.t -= ZOOM_STEP;
    } else {
      this.t += ZOOM_STEP;
    }
    this.t = Math.max(Math.min(this.t, 1), 0);
    let newScale = 0;
    const range = MAX_ZOOM - MIN_ZOOM;
    newScale = range * smoothZoom(this.t) + MIN_ZOOM;

    this.position.x = x / newScale - x / this.scale + this.position.x;
    this.position.y = y / newScale - y / this.scale + this.position.y;
    this.scale = newScale;

    this.transform.transform(
      this.position.x,
      this.position.y,
      0,
      this.scale,
      this.scale,
    );
  }

  on_toGridPos({ x, y }: { x: number; y: number }) {
    let _x = x / this.scale - this.position.x;
    let _y = y / this.scale - this.position.y;
    _x = Math.floor(_x / CELL_SIZE);
    _y = Math.floor(_y / CELL_SIZE);
    return { x: _x, y: _y };
  }

  draw(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    if (this.image && !this.pattern) {
      this.pattern = ctx.createPattern(this.image, "repeat")!;
    }
    if (!this.pattern) return;

    this.pattern.setTransform(this.transform.toDOMMatriz());

    ctx.fillStyle = this.pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.setTransform(this.transform.toDOMMatriz());
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  afterDrawChilds(): void {
    const canvas = this.context.canvas;
    const ctx = canvas.ctx;
    ctx.restore();
  }
}
