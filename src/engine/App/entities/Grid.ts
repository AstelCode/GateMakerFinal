import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
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
  private pivot: V2 = new V2();
  private t: number = START_T;
  public collider: RectangleCollider;

  constructor() {
    super();
    this.collider = new RectangleCollider();
    this.collider.setPosition(this.pivot);
    this.aabb = new AABB(this.pivot);
    this.type = "GRID";
  }

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
          radius
        );
        ctx.fill();
      },
      { image: true, width: CELL_SIZE, height: CELL_SIZE }
    );
    await this.context.assets.load();
    this.context.assets.getAssetSync("GRID_PATTERN", (data) => {
      this.image = data as HTMLImageElement;
    });
  }

  ready(): void {
    this.context.tree.registerEntity("GRID", this);

    this.collider.width = this.context.canvas.width;
    this.collider.height = this.context.canvas.height;

    this.aabb.width = this.context.canvas.width;
    this.aabb.height = this.context.canvas.height;

    this.pivot.x = this.context.canvas.width / 2;
    this.pivot.y = this.context.canvas.height / 2;

    this.transform.position.copy(this.pivot);
    const range = MAX_ZOOM - MIN_ZOOM;
    this.transform.scale = range * smoothZoom(this.t) + MIN_ZOOM;
    this.transform.updateMatriz();
  }

  on_drag({ dx, dy }: { dx: number; dy: number }) {
    this.transform.translate({ x: dx, y: dy });
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

    this.transform.zoomInPoint(newScale, { x, y });
  }

  on_toGridPos({ x, y }: { x: number; y: number }) {
    const v = new V2(x, y);
    this.transform.mulVInv(v);
    v.x = Math.floor(v.x / CELL_SIZE);
    v.y = Math.floor(v.y / CELL_SIZE);
    return { x: v.x, y: v.y };
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
